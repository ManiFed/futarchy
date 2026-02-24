import type { PolicyState, OutcomeMetricState, DecisionMarketsState, SimulationResult } from '../types';

function generatePricePath(
  startPrice: number,
  drift: number,
  volatility: number,
  steps: number
): number[] {
  const path: number[] = [startPrice];
  const dt = 1 / steps;
  for (let i = 1; i < steps; i++) {
    const prev = path[i - 1];
    const randomShock = (Math.random() - 0.5) * 2;
    const change = prev * (drift * dt + volatility * Math.sqrt(dt) * randomShock);
    const next = Math.max(0.01, Math.min(0.99, prev + change));
    path.push(next);
  }
  return path;
}

export function runSimulationEngine(
  _policy: PolicyState,
  outcome: OutcomeMetricState,
  markets: DecisionMarketsState
): SimulationResult {
  const steps = 100;

  const baselineValue = outcome.expectedBaseline || 50;
  const policyValue = outcome.expectedWithPolicy || 60;
  const policyEffect = (policyValue - baselineValue) / Math.max(baselineValue, 1);

  const passStartPrice = Math.min(0.95, Math.max(0.05, 0.5 + policyEffect * 0.5));
  const failStartPrice = Math.min(0.95, Math.max(0.05, 0.5 - policyEffect * 0.3));

  const totalLiquidity = markets.passMarket.initialLiquidity + markets.failMarket.initialLiquidity;
  const liquidityFactor = Math.min(1, totalLiquidity / 100000);
  const volatility = 0.3 * (1 - liquidityFactor * 0.6);

  const passDrift = policyEffect * 0.5;
  const failDrift = -policyEffect * 0.3;

  const passPricePath = generatePricePath(passStartPrice, passDrift, volatility, steps);
  const failPricePath = generatePricePath(failStartPrice, failDrift, volatility, steps);

  const finalPassPrice = passPricePath[passPricePath.length - 1];
  const finalFailPrice = failPricePath[failPricePath.length - 1];

  const probabilityOfAdoption = finalPassPrice > finalFailPrice
    ? 50 + (finalPassPrice - finalFailPrice) * 100
    : 50 - (finalFailPrice - finalPassPrice) * 100;
  const clampedProbability = Math.max(5, Math.min(95, probabilityOfAdoption));

  const manipulationCost = totalLiquidity * 0.1;
  const manipulationResistance = Math.min(100, manipulationCost / 1000);

  const expectedOutcomePass = baselineValue + (policyValue - baselineValue) * finalPassPrice;
  const expectedOutcomeFail = baselineValue + (policyValue - baselineValue) * (1 - finalFailPrice) * 0.3;

  let recommendation: 'adopt' | 'reject' | 'uncertain';
  if (finalPassPrice > finalFailPrice + 0.1) {
    recommendation = 'adopt';
  } else if (finalFailPrice > finalPassPrice + 0.1) {
    recommendation = 'reject';
  } else {
    recommendation = 'uncertain';
  }

  const timestamps = Array.from({ length: steps }, (_, i) => i);

  return {
    pricePaths: { pass: passPricePath, fail: failPricePath },
    probabilityOfAdoption: clampedProbability,
    manipulationResistance,
    expectedOutcomePass,
    expectedOutcomeFail,
    recommendation,
    timestamps,
  };
}

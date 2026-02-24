export type TimeHorizon = '3m' | '1y' | '3y' | 'custom';

export interface PolicyParameter {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}

export interface PolicyState {
  title: string;
  description: string;
  parameters: PolicyParameter[];
  timeHorizon: TimeHorizon;
  customMonths: number;
  assumptions: string;
}

export type MetricType = 'binary' | 'scalar' | 'indexed';

export interface OutcomeMetricState {
  metricType: MetricType | null;
  name: string;
  unit: string;
  resolutionTiming: string;
  expectedBaseline: number;
  expectedWithPolicy: number;
  resolutionRule: string;
}

export interface MarketConfig {
  initialLiquidity: number;
  feePercent: number;
  liquidityDepth: number;
}

export interface DecisionMarketsState {
  passMarket: MarketConfig;
  failMarket: MarketConfig;
}

export interface SimulationResult {
  pricePaths: { pass: number[]; fail: number[] };
  probabilityOfAdoption: number;
  manipulationResistance: number;
  expectedOutcomePass: number;
  expectedOutcomeFail: number;
  recommendation: 'adopt' | 'reject' | 'uncertain';
  timestamps: number[];
}

export type SectionId = 'policy' | 'outcome' | 'markets' | 'results';

export interface AppState {
  labName: string;
  status: 'draft' | 'simulating' | 'completed';
  activeSection: SectionId;
  inspectorOpen: boolean;
  inspectorContent: 'policy' | 'outcome' | 'markets' | null;

  policy: PolicyState;
  outcome: OutcomeMetricState;
  markets: DecisionMarketsState;
  simulation: SimulationResult | null;
  isSimulating: boolean;

  setLabName: (name: string) => void;
  setActiveSection: (section: SectionId) => void;
  setInspector: (content: 'policy' | 'outcome' | 'markets' | null) => void;

  updatePolicy: (updates: Partial<PolicyState>) => void;
  addPolicyParameter: () => void;
  updatePolicyParameter: (id: string, updates: Partial<PolicyParameter>) => void;
  removePolicyParameter: (id: string) => void;

  updateOutcome: (updates: Partial<OutcomeMetricState>) => void;

  updatePassMarket: (updates: Partial<MarketConfig>) => void;
  updateFailMarket: (updates: Partial<MarketConfig>) => void;

  runSimulation: () => void;
  resetSimulation: () => void;

  getSectionCompletion: () => Record<SectionId, boolean>;
}

import { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useStore } from '../../store/useStore';
import { Card, CardHeader, CardBody } from '../shared/Card';
import styles from './ResultsSection.module.css';

function AnimatedCounter({ target, duration = 2000, prefix = '', suffix = '', decimals = 1 }: {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(start + (target - start) * eased);
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return (
    <span className="mono">
      {prefix}{current.toFixed(decimals)}{suffix}
    </span>
  );
}

export function ResultsSection() {
  const { simulation, isSimulating, runSimulation } = useStore();
  const [animatedStep, setAnimatedStep] = useState(0);

  useEffect(() => {
    if (simulation && animatedStep < simulation.timestamps.length) {
      const timer = setTimeout(() => {
        setAnimatedStep((prev) => Math.min(prev + 3, simulation.timestamps.length));
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [simulation, animatedStep]);

  useEffect(() => {
    if (simulation) {
      setAnimatedStep(0);
    }
  }, [simulation]);

  const chartData = useMemo(() => {
    if (!simulation) return [];
    const limit = animatedStep;
    return simulation.timestamps.slice(0, limit).map((t, i) => ({
      step: t,
      'Pass Market': Math.round(simulation.pricePaths.pass[i] * 1000) / 10,
      'Fail Market': Math.round(simulation.pricePaths.fail[i] * 1000) / 10,
    }));
  }, [simulation, animatedStep]);

  if (!simulation && !isSimulating) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionNumber}>4</div>
          <div>
            <h2 className={styles.sectionTitle}>Results</h2>
            <p className={styles.sectionSubtitle}>
              Run a simulation to see market dynamics and policy recommendations
            </p>
          </div>
        </div>

        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <polygon points="5,3 19,12 5,21" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>No Simulation Results Yet</h3>
          <p>Configure your policy, outcome metric, and markets, then click <strong>Run Simulation</strong> to generate results.</p>
          <button className={styles.runBtn} onClick={runSimulation}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polygon points="5,3 19,12 5,21" fill="currentColor"/>
            </svg>
            Run Simulation
          </button>
        </div>
      </div>
    );
  }

  if (isSimulating) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionNumber}>4</div>
          <div>
            <h2 className={styles.sectionTitle}>Results</h2>
            <p className={styles.sectionSubtitle}>Running simulation...</p>
          </div>
        </div>

        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />
          <h3>Running Simulation</h3>
          <p>Generating price paths and analyzing market dynamics...</p>
          <div className={styles.loadingBar}>
            <div className={styles.loadingFill} />
          </div>
        </div>
      </div>
    );
  }

  if (!simulation) return null;

  const recommendationConfig = {
    adopt: {
      label: 'Adopt Policy',
      color: 'var(--green-600)',
      bg: 'var(--green-50)',
      border: 'var(--green-100)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    reject: {
      label: 'Reject Policy',
      color: 'var(--red-600)',
      bg: 'var(--red-50)',
      border: 'var(--red-100)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
    },
    uncertain: {
      label: 'Uncertain',
      color: 'var(--amber-600)',
      bg: 'rgba(251, 191, 36, 0.08)',
      border: 'rgba(251, 191, 36, 0.2)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 16v.01M12 12a2 2 0 10-2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
  };

  const rec = recommendationConfig[simulation.recommendation];

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionNumber}>4</div>
        <div>
          <h2 className={styles.sectionTitle}>Simulation Results</h2>
          <p className={styles.sectionSubtitle}>
            Analysis of market dynamics and policy recommendation
          </p>
        </div>
      </div>

      <div
        className={styles.recommendationCard}
        style={{
          background: rec.bg,
          borderColor: rec.border,
          color: rec.color,
        }}
      >
        <div className={styles.recIcon}>{rec.icon}</div>
        <div className={styles.recContent}>
          <div className={styles.recLabel}>Recommendation</div>
          <div className={styles.recValue}>{rec.label}</div>
        </div>
        <div className={styles.recProb}>
          <div className={styles.recProbLabel}>Adoption Probability</div>
          <div className={styles.recProbValue}>
            <AnimatedCounter target={simulation.probabilityOfAdoption} suffix="%" />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h3 className={styles.cardTitle}>Market Price Paths</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="step"
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
                label={{ value: 'Time Steps', position: 'insideBottom', offset: -2, fontSize: 11 }}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
                domain={[0, 100]}
                label={{ value: 'Price (%)', angle: -90, position: 'insideLeft', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
                  fontSize: '13px',
                }}
                formatter={(value: number | undefined) => value !== undefined ? [`${value.toFixed(1)}%`] : ['']}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <ReferenceLine y={50} stroke="#d1d5db" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="Pass Market"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="Fail Market"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <div className={styles.metricsGrid}>
        <Card>
          <CardBody>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon} style={{ color: 'var(--blue-500)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className={styles.metricLabel}>Probability of Adoption</div>
              <div className={styles.metricValue}>
                <AnimatedCounter target={simulation.probabilityOfAdoption} suffix="%" />
              </div>
              <div className={styles.metricBar}>
                <div
                  className={styles.metricBarFill}
                  style={{
                    width: `${simulation.probabilityOfAdoption}%`,
                    background: simulation.probabilityOfAdoption > 50 ? 'var(--green-500)' : 'var(--red-500)',
                  }}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon} style={{ color: 'var(--amber-500)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.metricLabel}>Manipulation Resistance</div>
              <div className={styles.metricValue}>
                <AnimatedCounter target={simulation.manipulationResistance} suffix="%" />
              </div>
              <div className={styles.metricBar}>
                <div
                  className={styles.metricBarFill}
                  style={{
                    width: `${simulation.manipulationResistance}%`,
                    background: simulation.manipulationResistance > 60 ? 'var(--green-500)' : 'var(--amber-500)',
                  }}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon} style={{ color: 'var(--green-500)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.metricLabel}>Expected Outcome (Pass)</div>
              <div className={styles.metricValue}>
                <AnimatedCounter target={simulation.expectedOutcomePass} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon} style={{ color: 'var(--red-500)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <polyline points="22,17 13.5,8.5 8.5,13.5 2,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.metricLabel}>Expected Outcome (Fail)</div>
              <div className={styles.metricValue}>
                <AnimatedCounter target={simulation.expectedOutcomeFail} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className={styles.cardTitle}>Summary</h3>
        </CardHeader>
        <CardBody>
          <div className={styles.summary}>
            <p>
              Based on the simulation of {simulation.timestamps.length} time steps, the conditional
              prediction markets indicate that the policy{' '}
              <strong>
                {simulation.recommendation === 'adopt'
                  ? 'should be adopted'
                  : simulation.recommendation === 'reject'
                  ? 'should be rejected'
                  : 'has insufficient market signal for a clear recommendation'}
              </strong>
              . The pass market settled at{' '}
              <strong className="mono">
                {(simulation.pricePaths.pass[simulation.pricePaths.pass.length - 1] * 100).toFixed(1)}%
              </strong>{' '}
              while the fail market settled at{' '}
              <strong className="mono">
                {(simulation.pricePaths.fail[simulation.pricePaths.fail.length - 1] * 100).toFixed(1)}%
              </strong>
              .
            </p>
            <p>
              The manipulation resistance score of{' '}
              <strong className="mono">{simulation.manipulationResistance.toFixed(1)}%</strong>{' '}
              indicates{' '}
              {simulation.manipulationResistance > 70
                ? 'strong market integrity'
                : simulation.manipulationResistance > 40
                ? 'moderate market integrity'
                : 'potential vulnerability to manipulation'}
              . Consider{' '}
              {simulation.manipulationResistance < 70
                ? 'increasing liquidity to improve resistance.'
                : 'the current liquidity levels are adequate.'}
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

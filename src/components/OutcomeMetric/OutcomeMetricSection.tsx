import { useMemo, type ReactNode } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useStore } from '../../store/useStore';
import { Card, CardHeader, CardBody } from '../shared/Card';
import type { MetricType } from '../../types';
import styles from './OutcomeMetricSection.module.css';

const metricTypes: { type: MetricType; label: string; description: string; icon: ReactNode }[] = [
  {
    type: 'binary',
    label: 'Binary Outcome',
    description: 'Yes/No, Pass/Fail',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    type: 'scalar',
    label: 'Scalar Value',
    description: 'Continuous number',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    type: 'indexed',
    label: 'Indexed Score',
    description: 'Composite index',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="12" width="4" height="9" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="10" y="7" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="17" y="3" width="4" height="18" rx="1" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
];

const unitOptions = ['%', '$', 'index points', 'units', 'ratio'];

export function OutcomeMetricSection() {
  const { outcome, updateOutcome, policy, setInspector } = useStore();

  const timeSteps = useMemo(() => {
    const months = policy.timeHorizon === '3m' ? 3
      : policy.timeHorizon === '1y' ? 12
      : policy.timeHorizon === '3y' ? 36
      : policy.customMonths;
    return months;
  }, [policy.timeHorizon, policy.customMonths]);

  const chartData = useMemo(() => {
    const points = Math.min(timeSteps, 24);
    return Array.from({ length: points + 1 }, (_, i) => {
      const t = i / points;
      const baseline = outcome.expectedBaseline;
      const withPolicy = outcome.expectedBaseline +
        (outcome.expectedWithPolicy - outcome.expectedBaseline) * t;
      return {
        month: `M${Math.round(t * timeSteps)}`,
        Baseline: Math.round(baseline * 100) / 100,
        'With Policy': Math.round(withPolicy * 100) / 100,
      };
    });
  }, [outcome.expectedBaseline, outcome.expectedWithPolicy, timeSteps]);

  const isConfigured = outcome.metricType !== null && outcome.name.trim().length > 0;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionNumber}>2</div>
        <div>
          <h2 className={styles.sectionTitle}>Outcome Metric</h2>
          <p className={styles.sectionSubtitle}>
            What measurable outcome determines success?
          </p>
        </div>
        {isConfigured && (
          <span className={styles.badge}>Configured</span>
        )}
      </div>

      <div className={styles.metricTiles}>
        {metricTypes.map((mt) => (
          <button
            key={mt.type}
            className={`${styles.metricTile} ${outcome.metricType === mt.type ? styles.metricTileActive : ''} ${mt.type === 'indexed' ? styles.metricTileDisabled : ''}`}
            onClick={() => mt.type !== 'indexed' && updateOutcome({ metricType: mt.type })}
            disabled={mt.type === 'indexed'}
          >
            <span className={styles.tileIcon}>{mt.icon}</span>
            <span className={styles.tileLabel}>{mt.label}</span>
            <span className={styles.tileDesc}>{mt.description}</span>
            {mt.type === 'indexed' && <span className={styles.comingSoon}>Coming Soon</span>}
          </button>
        ))}
      </div>

      {outcome.metricType && (
        <Card onClick={() => setInspector('outcome')}>
          <CardHeader>
            <h3 className={styles.cardTitle}>Metric Configuration</h3>
          </CardHeader>
          <CardBody>
            <div className={styles.configGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Metric Name</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder={outcome.metricType === 'binary' ? 'e.g., Policy target achieved' : 'e.g., GDP Growth Rate'}
                  value={outcome.name}
                  onChange={(e) => updateOutcome({ name: e.target.value })}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Unit</label>
                <select
                  className={styles.select}
                  value={outcome.unit}
                  onChange={(e) => updateOutcome({ unit: e.target.value })}
                >
                  {unitOptions.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Resolution Timing</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g., End of fiscal year 2026"
                  value={outcome.resolutionTiming}
                  onChange={(e) => updateOutcome({ resolutionTiming: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.projectionInputs}>
              <div className={styles.projectionInput}>
                <label className={styles.fieldLabel}>Expected Baseline</label>
                <div className={styles.numericInput}>
                  <input
                    type="number"
                    value={outcome.expectedBaseline}
                    onChange={(e) => updateOutcome({ expectedBaseline: parseFloat(e.target.value) || 0 })}
                  />
                  <span className={styles.inputUnit}>{outcome.unit}</span>
                </div>
              </div>
              <div className={styles.projectionDivider}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.projectionInput}>
                <label className={styles.fieldLabel}>Expected With Policy</label>
                <div className={styles.numericInput}>
                  <input
                    type="number"
                    value={outcome.expectedWithPolicy}
                    onChange={(e) => updateOutcome({ expectedWithPolicy: parseFloat(e.target.value) || 0 })}
                  />
                  <span className={styles.inputUnit}>{outcome.unit}</span>
                </div>
              </div>
            </div>

            <div className={styles.chartContainer}>
              <h4 className={styles.chartTitle}>Projected Outcome Over Time</h4>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
                      fontSize: '13px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line
                    type="monotone"
                    dataKey="Baseline"
                    stroke="#9ca3af"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="With Policy"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.resolutionRule}>
              <label className={styles.fieldLabel}>Resolution Rule</label>
              <p className={styles.resolutionHint}>
                Describe in plain language how the outcome will be determined at the end of the time horizon.
              </p>
              <textarea
                className={styles.textarea}
                placeholder={
                  outcome.metricType === 'binary'
                    ? 'e.g., The metric resolves YES if the unemployment rate falls below 4% by December 2026 as measured by the Bureau of Labor Statistics.'
                    : 'e.g., The final value is determined by the official GDP growth rate published by the BEA for the relevant quarter.'
                }
                value={outcome.resolutionRule}
                onChange={(e) => updateOutcome({ resolutionRule: e.target.value })}
                rows={3}
              />
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

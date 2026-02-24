import { useStore } from '../../store/useStore';
import styles from './OutcomeInspector.module.css';

export function OutcomeInspector() {
  const outcome = useStore((s) => s.outcome);

  const delta = outcome.expectedWithPolicy - outcome.expectedBaseline;
  const deltaPercent = outcome.expectedBaseline !== 0
    ? ((delta / outcome.expectedBaseline) * 100).toFixed(1)
    : '0';
  const isPositive = delta > 0;

  return (
    <div className={styles.inspector}>
      <div className={styles.metricSummary}>
        <h4 className={styles.label}>Metric Type</h4>
        <span className={styles.typeTag}>
          {outcome.metricType === 'binary' ? 'Binary Outcome' : outcome.metricType === 'scalar' ? 'Scalar Value' : 'Not Selected'}
        </span>
      </div>

      {outcome.name && (
        <div className={styles.metricSummary}>
          <h4 className={styles.label}>Metric</h4>
          <p className={styles.metricName}>{outcome.name}</p>
        </div>
      )}

      <div className={styles.impactCard}>
        <h4 className={styles.label}>Expected Policy Impact</h4>
        <div className={styles.impactGrid}>
          <div className={styles.impactValue}>
            <span className={styles.impactLabel}>Baseline</span>
            <span className={`${styles.impactNum} mono`}>
              {outcome.expectedBaseline}{outcome.unit}
            </span>
          </div>
          <div className={styles.impactValue}>
            <span className={styles.impactLabel}>With Policy</span>
            <span className={`${styles.impactNum} mono`}>
              {outcome.expectedWithPolicy}{outcome.unit}
            </span>
          </div>
        </div>
        <div className={`${styles.deltaRow} ${isPositive ? styles.deltaPositive : styles.deltaNegative}`}>
          <span className={styles.deltaIcon}>
            {isPositive ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </span>
          <span className={`mono ${styles.deltaValue}`}>
            {isPositive ? '+' : ''}{delta.toFixed(1)}{outcome.unit} ({isPositive ? '+' : ''}{deltaPercent}%)
          </span>
        </div>
      </div>

      {outcome.resolutionTiming && (
        <div className={styles.metricSummary}>
          <h4 className={styles.label}>Resolution Timing</h4>
          <p className={styles.metaText}>{outcome.resolutionTiming}</p>
        </div>
      )}

      {outcome.resolutionRule && (
        <div className={styles.metricSummary}>
          <h4 className={styles.label}>Resolution Rule</h4>
          <p className={styles.ruleText}>{outcome.resolutionRule}</p>
        </div>
      )}
    </div>
  );
}

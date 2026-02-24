import { useStore } from '../../store/useStore';
import styles from './PolicyInspector.module.css';

export function PolicyInspector() {
  const policy = useStore((s) => s.policy);

  const timeLabel = {
    '3m': '3 months',
    '1y': '1 year',
    '3y': '3 years',
    custom: `${policy.customMonths} months`,
  }[policy.timeHorizon];

  const hasTitle = policy.title.trim().length > 0;
  const hasParams = policy.parameters.length > 0;

  return (
    <div className={styles.inspector}>
      <div className={styles.previewSection}>
        <h4 className={styles.previewLabel}>Live Policy Summary</h4>
        <div className={styles.previewCard}>
          {hasTitle ? (
            <>
              <p className={styles.previewStatement}>
                <strong>Proposal:</strong> {policy.title}
              </p>
              {policy.description && (
                <p className={styles.previewDesc}>{policy.description}</p>
              )}
              {hasParams && (
                <div className={styles.previewParams}>
                  <span className={styles.previewParamsLabel}>Key Parameters:</span>
                  <ul className={styles.paramList}>
                    {policy.parameters.map((p) => (
                      <li key={p.id}>
                        <span className={styles.paramName}>{p.name}:</span>{' '}
                        <span className={`${styles.paramValue} mono`}>
                          {p.value}{p.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className={styles.previewMeta}>
                <span className={styles.metaItem}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Evaluation period: {timeLabel}
                </span>
              </div>
            </>
          ) : (
            <p className={styles.previewEmpty}>
              Enter a policy title to see a live summary preview here.
            </p>
          )}
        </div>
      </div>

      <div className={styles.completionSection}>
        <h4 className={styles.previewLabel}>Completion Status</h4>
        <div className={styles.checkList}>
          <div className={`${styles.checkItem} ${hasTitle ? styles.checkDone : ''}`}>
            <span className={styles.checkIcon}>
              {hasTitle ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span className={styles.checkEmpty} />
              )}
            </span>
            Policy title defined
          </div>
          <div className={`${styles.checkItem} ${policy.description ? styles.checkDone : ''}`}>
            <span className={styles.checkIcon}>
              {policy.description ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span className={styles.checkEmpty} />
              )}
            </span>
            Description provided
          </div>
          <div className={`${styles.checkItem} ${hasParams ? styles.checkDone : ''}`}>
            <span className={styles.checkIcon}>
              {hasParams ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span className={styles.checkEmpty} />
              )}
            </span>
            Parameters configured
          </div>
          <div className={`${styles.checkItem} ${styles.checkDone}`}>
            <span className={styles.checkIcon}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            Time horizon selected
          </div>
        </div>
      </div>

      {policy.assumptions && (
        <div className={styles.assumptionsSection}>
          <h4 className={styles.previewLabel}>Assumptions</h4>
          <p className={styles.assumptionsText}>{policy.assumptions}</p>
        </div>
      )}
    </div>
  );
}

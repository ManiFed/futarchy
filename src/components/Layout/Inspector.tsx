import { useStore } from '../../store/useStore';
import { PolicyInspector } from '../Policy/PolicyInspector';
import { OutcomeInspector } from '../OutcomeMetric/OutcomeInspector';
import { MarketsInspector } from '../DecisionMarkets/MarketsInspector';
import styles from './Inspector.module.css';

export function Inspector() {
  const { inspectorOpen, inspectorContent, setInspector } = useStore();

  if (!inspectorOpen || !inspectorContent) return null;

  return (
    <aside className={styles.inspector}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {inspectorContent === 'policy' && 'Policy Preview'}
          {inspectorContent === 'outcome' && 'Metric Details'}
          {inspectorContent === 'markets' && 'Market Analysis'}
        </h3>
        <button className={styles.closeBtn} onClick={() => setInspector(null)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div className={styles.content}>
        {inspectorContent === 'policy' && <PolicyInspector />}
        {inspectorContent === 'outcome' && <OutcomeInspector />}
        {inspectorContent === 'markets' && <MarketsInspector />}
      </div>
    </aside>
  );
}

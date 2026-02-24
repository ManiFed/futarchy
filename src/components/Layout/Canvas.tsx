import { useStore } from '../../store/useStore';
import { PolicySection } from '../Policy/PolicySection';
import { OutcomeMetricSection } from '../OutcomeMetric/OutcomeMetricSection';
import { DecisionMarketsSection } from '../DecisionMarkets/DecisionMarketsSection';
import { ResultsSection } from '../Results/ResultsSection';
import styles from './Canvas.module.css';

export function Canvas() {
  const activeSection = useStore((s) => s.activeSection);

  return (
    <main className={styles.canvas}>
      <div className={styles.scrollArea}>
        <div className={styles.content}>
          {activeSection === 'policy' && <PolicySection />}
          {activeSection === 'outcome' && <OutcomeMetricSection />}
          {activeSection === 'markets' && <DecisionMarketsSection />}
          {activeSection === 'results' && <ResultsSection />}
        </div>
      </div>
    </main>
  );
}

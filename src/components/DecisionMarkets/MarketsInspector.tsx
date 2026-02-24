import { useStore } from '../../store/useStore';
import styles from './MarketsInspector.module.css';

export function MarketsInspector() {
  const { markets, outcome } = useStore();

  const totalLiquidity = markets.passMarket.initialLiquidity + markets.failMarket.initialLiquidity;
  const avgFee = (markets.passMarket.feePercent + markets.failMarket.feePercent) / 2;

  const policyEffect = outcome.expectedBaseline > 0
    ? (outcome.expectedWithPolicy - outcome.expectedBaseline) / outcome.expectedBaseline
    : 0;

  const passImplied = Math.min(0.95, Math.max(0.05, 0.5 + policyEffect * 0.4));
  const failImplied = Math.min(0.95, Math.max(0.05, 0.5 - policyEffect * 0.25));

  const manipulationCost = totalLiquidity * 0.1;

  return (
    <div className={styles.inspector}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Liquidity</span>
          <span className={`${styles.statValue} mono`}>${totalLiquidity.toLocaleString()}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Avg Fee</span>
          <span className={`${styles.statValue} mono`}>{avgFee.toFixed(1)}%</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Est. Manipulation Cost</span>
          <span className={`${styles.statValue} mono`}>${manipulationCost.toLocaleString()}</span>
        </div>
      </div>

      <div className={styles.comparison}>
        <h4 className={styles.label}>Market Comparison</h4>
        <div className={styles.comparisonBars}>
          <div className={styles.comparisonRow}>
            <span className={styles.comparisonLabel}>Pass Market</span>
            <div className={styles.barContainer}>
              <div
                className={styles.bar}
                style={{
                  width: `${passImplied * 100}%`,
                  background: 'var(--green-500)',
                }}
              />
            </div>
            <span className={`${styles.comparisonValue} mono`}>{(passImplied * 100).toFixed(1)}%</span>
          </div>
          <div className={styles.comparisonRow}>
            <span className={styles.comparisonLabel}>Fail Market</span>
            <div className={styles.barContainer}>
              <div
                className={styles.bar}
                style={{
                  width: `${failImplied * 100}%`,
                  background: 'var(--red-500)',
                }}
              />
            </div>
            <span className={`${styles.comparisonValue} mono`}>{(failImplied * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className={styles.info}>
        <h4 className={styles.label}>How It Works</h4>
        <p className={styles.infoText}>
          Two conditional prediction markets run simultaneously. The "Pass" market prices the expected outcome if the policy is adopted. The "Fail" market prices it if the policy is rejected.
        </p>
        <p className={styles.infoText}>
          If the Pass market price exceeds the Fail market price, the futarchy mechanism recommends adoption.
        </p>
      </div>
    </div>
  );
}

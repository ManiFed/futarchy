import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useStore } from '../../store/useStore';
import { Card, CardHeader, CardBody } from '../shared/Card';
import { Slider } from '../shared/Slider';
import styles from './DecisionMarketsSection.module.css';

function generateDepthData(liquidity: number, depth: number) {
  const points = 20;
  const data = [];
  for (let i = 0; i <= points; i++) {
    const price = 0.01 + (i / points) * 0.98;
    const mid = 0.5;
    const spread = (100 - depth) / 100;
    const bidDepth = liquidity * Math.max(0, 1 - Math.abs(price - mid + spread * 0.2) * 3) / 1000;
    const askDepth = liquidity * Math.max(0, 1 - Math.abs(price - mid - spread * 0.2) * 3) / 1000;
    data.push({
      price: price.toFixed(2),
      bid: Math.max(0, bidDepth),
      ask: Math.max(0, askDepth),
    });
  }
  return data;
}

export function DecisionMarketsSection() {
  const { markets, outcome, updatePassMarket, updateFailMarket, setInspector } = useStore();

  const policyEffect = outcome.expectedBaseline > 0
    ? (outcome.expectedWithPolicy - outcome.expectedBaseline) / outcome.expectedBaseline
    : 0;

  const passImplied = Math.min(0.95, Math.max(0.05, 0.5 + policyEffect * 0.4));
  const failImplied = Math.min(0.95, Math.max(0.05, 0.5 - policyEffect * 0.25));

  const passDepthData = useMemo(
    () => generateDepthData(markets.passMarket.initialLiquidity, markets.passMarket.liquidityDepth),
    [markets.passMarket.initialLiquidity, markets.passMarket.liquidityDepth]
  );

  const failDepthData = useMemo(
    () => generateDepthData(markets.failMarket.initialLiquidity, markets.failMarket.liquidityDepth),
    [markets.failMarket.initialLiquidity, markets.failMarket.liquidityDepth]
  );

  const spread = Math.abs(passImplied - failImplied);
  const favored = passImplied > failImplied ? 'pass' : passImplied < failImplied ? 'fail' : 'neutral';

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionNumber}>3</div>
        <div>
          <h2 className={styles.sectionTitle}>Decision Markets</h2>
          <p className={styles.sectionSubtitle}>
            Configure the conditional prediction markets for policy evaluation
          </p>
        </div>
      </div>

      <div className={styles.spreadIndicator} onClick={() => setInspector('markets')}>
        <div className={styles.spreadLabel}>Market Spread</div>
        <div className={`${styles.spreadValue} mono`}>
          <span className={styles.spreadDot} style={{
            background: favored === 'pass' ? 'var(--green-500)'
              : favored === 'fail' ? 'var(--red-500)'
              : 'var(--amber-500)'
          }} />
          {(spread * 100).toFixed(1)}%
          <span className={styles.spreadFavored}>
            {favored === 'pass' ? 'Favors Adoption' : favored === 'fail' ? 'Favors Rejection' : 'Neutral'}
          </span>
        </div>
      </div>

      <div className={styles.marketCards}>
        <Card>
          <CardHeader>
            <div className={styles.marketTitle}>
              <span className={styles.marketDot} style={{ background: 'var(--green-500)' }} />
              <h3 className={styles.cardTitle}>Outcome If Policy Passes</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className={styles.impliedPrice}>
              <span className={styles.impliedLabel}>Implied Probability</span>
              <span className={`${styles.impliedValue} mono`} style={{ color: 'var(--green-600)' }}>
                {(passImplied * 100).toFixed(1)}%
              </span>
            </div>

            <div className={styles.depthChart}>
              <span className={styles.chartLabel}>Depth Curve</span>
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={passDepthData} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
                  <XAxis dataKey="price" hide />
                  <YAxis hide />
                  <Area type="monotone" dataKey="bid" fill="#dcfce7" stroke="#22c55e" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="ask" fill="#fee2e2" stroke="#ef4444" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.sliderGroup}>
              <Slider
                label="Initial Liquidity"
                value={markets.passMarket.initialLiquidity}
                min={1000}
                max={500000}
                step={1000}
                unit="$"
                onChange={(v) => updatePassMarket({ initialLiquidity: v })}
                color="green"
              />
              <Slider
                label="Trading Fee"
                value={markets.passMarket.feePercent}
                min={0}
                max={10}
                step={0.1}
                unit="%"
                onChange={(v) => updatePassMarket({ feePercent: v })}
                color="green"
              />
              <Slider
                label="Liquidity Depth"
                value={markets.passMarket.liquidityDepth}
                min={10}
                max={100}
                step={1}
                unit=""
                onChange={(v) => updatePassMarket({ liquidityDepth: v })}
                color="green"
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className={styles.marketTitle}>
              <span className={styles.marketDot} style={{ background: 'var(--red-500)' }} />
              <h3 className={styles.cardTitle}>Outcome If Policy Fails</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className={styles.impliedPrice}>
              <span className={styles.impliedLabel}>Implied Probability</span>
              <span className={`${styles.impliedValue} mono`} style={{ color: 'var(--red-600)' }}>
                {(failImplied * 100).toFixed(1)}%
              </span>
            </div>

            <div className={styles.depthChart}>
              <span className={styles.chartLabel}>Depth Curve</span>
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={failDepthData} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
                  <XAxis dataKey="price" hide />
                  <YAxis hide />
                  <Area type="monotone" dataKey="bid" fill="#dcfce7" stroke="#22c55e" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="ask" fill="#fee2e2" stroke="#ef4444" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.sliderGroup}>
              <Slider
                label="Initial Liquidity"
                value={markets.failMarket.initialLiquidity}
                min={1000}
                max={500000}
                step={1000}
                unit="$"
                onChange={(v) => updateFailMarket({ initialLiquidity: v })}
                color="red"
              />
              <Slider
                label="Trading Fee"
                value={markets.failMarket.feePercent}
                min={0}
                max={10}
                step={0.1}
                unit="%"
                onChange={(v) => updateFailMarket({ feePercent: v })}
                color="red"
              />
              <Slider
                label="Liquidity Depth"
                value={markets.failMarket.liquidityDepth}
                min={10}
                max={100}
                step={1}
                unit=""
                onChange={(v) => updateFailMarket({ liquidityDepth: v })}
                color="red"
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

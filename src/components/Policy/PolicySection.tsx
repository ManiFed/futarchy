import { useStore } from '../../store/useStore';
import { Card, CardHeader, CardBody } from '../shared/Card';
import { Slider } from '../shared/Slider';
import type { TimeHorizon } from '../../types';
import styles from './PolicySection.module.css';

const timeOptions: { value: TimeHorizon; label: string }[] = [
  { value: '3m', label: '3 Months' },
  { value: '1y', label: '1 Year' },
  { value: '3y', label: '3 Years' },
  { value: 'custom', label: 'Custom' },
];

export function PolicySection() {
  const {
    policy,
    updatePolicy,
    addPolicyParameter,
    updatePolicyParameter,
    removePolicyParameter,
    setInspector,
  } = useStore();

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionNumber}>1</div>
        <div>
          <h2 className={styles.sectionTitle}>Policy Definition</h2>
          <p className={styles.sectionSubtitle}>
            Define the policy change being evaluated in this futarchy experiment
          </p>
        </div>
      </div>

      <Card onClick={() => setInspector('policy')}>
        <CardHeader>
          <h3 className={styles.cardTitle}>Policy Proposal</h3>
        </CardHeader>
        <CardBody>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              What policy change is being evaluated?
            </label>
            <input
              type="text"
              className={styles.titleInput}
              placeholder="e.g., Increase capital gains tax by 5%"
              value={policy.title}
              onChange={(e) => updatePolicy({ title: e.target.value })}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Description</label>
            <textarea
              className={styles.textarea}
              placeholder="Provide a detailed description of the policy proposal, its goals, and expected mechanism of action..."
              value={policy.description}
              onChange={(e) => updatePolicy({ description: e.target.value })}
              rows={4}
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          action={
            <button className={styles.addBtn} onClick={addPolicyParameter}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add Parameter
            </button>
          }
        >
          <h3 className={styles.cardTitle}>Policy Parameters</h3>
        </CardHeader>
        <CardBody>
          {policy.parameters.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No parameters defined. Add numeric inputs to specify the policy.</p>
            </div>
          ) : (
            <div className={styles.parameterList}>
              {policy.parameters.map((param) => (
                <div key={param.id} className={styles.parameterItem}>
                  <div className={styles.parameterHeader}>
                    <input
                      type="text"
                      className={styles.paramNameInput}
                      value={param.name}
                      onChange={(e) =>
                        updatePolicyParameter(param.id, { name: e.target.value })
                      }
                      placeholder="Parameter name"
                    />
                    <div className={styles.paramControls}>
                      <input
                        type="text"
                        className={styles.unitInput}
                        value={param.unit}
                        onChange={(e) =>
                          updatePolicyParameter(param.id, { unit: e.target.value })
                        }
                        placeholder="unit"
                      />
                      <button
                        className={styles.removeBtn}
                        onClick={() => removePolicyParameter(param.id)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <Slider
                    label=""
                    value={param.value}
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    unit={param.unit}
                    onChange={(value) =>
                      updatePolicyParameter(param.id, { value })
                    }
                  />
                  <div className={styles.boundsRow}>
                    <div className={styles.boundInput}>
                      <label>Min</label>
                      <input
                        type="number"
                        value={param.min}
                        onChange={(e) =>
                          updatePolicyParameter(param.id, {
                            min: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className={styles.boundInput}>
                      <label>Max</label>
                      <input
                        type="number"
                        value={param.max}
                        onChange={(e) =>
                          updatePolicyParameter(param.id, {
                            max: parseFloat(e.target.value) || 100,
                          })
                        }
                      />
                    </div>
                    <div className={styles.boundInput}>
                      <label>Step</label>
                      <input
                        type="number"
                        value={param.step}
                        onChange={(e) =>
                          updatePolicyParameter(param.id, {
                            step: parseFloat(e.target.value) || 1,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className={styles.cardTitle}>Time Horizon</h3>
        </CardHeader>
        <CardBody>
          <div className={styles.timeToggle}>
            {timeOptions.map((opt) => (
              <button
                key={opt.value}
                className={`${styles.timeBtn} ${
                  policy.timeHorizon === opt.value ? styles.timeBtnActive : ''
                }`}
                onClick={() => updatePolicy({ timeHorizon: opt.value })}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {policy.timeHorizon === 'custom' && (
            <div className={styles.customTime}>
              <label className={styles.fieldLabel}>Duration (months)</label>
              <input
                type="number"
                className={styles.numberInput}
                value={policy.customMonths}
                onChange={(e) =>
                  updatePolicy({ customMonths: parseInt(e.target.value) || 1 })
                }
                min={1}
                max={120}
              />
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className={styles.cardTitle}>Assumptions</h3>
        </CardHeader>
        <CardBody>
          <textarea
            className={styles.textarea}
            placeholder="Define baseline conditions and assumptions (e.g., current economic growth rate, existing policy framework, market conditions)..."
            value={policy.assumptions}
            onChange={(e) => updatePolicy({ assumptions: e.target.value })}
            rows={3}
          />
        </CardBody>
      </Card>
    </div>
  );
}

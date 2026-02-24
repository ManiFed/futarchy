import styles from './Slider.module.css';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
  color?: 'blue' | 'green' | 'red' | 'amber';
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
  color = 'blue',
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={styles.slider}>
      <div className={styles.labelRow}>
        <label className={styles.label}>{label}</label>
        <span className={`${styles.value} mono`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
          {unit && <span className={styles.unit}>{unit}</span>}
        </span>
      </div>
      <div className={styles.trackWrapper}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={`${styles.input} ${styles[color]}`}
          style={{
            background: `linear-gradient(to right, var(--${color}-500) 0%, var(--${color}-500) ${percentage}%, var(--border-light) ${percentage}%, var(--border-light) 100%)`,
          }}
        />
      </div>
      <div className={styles.bounds}>
        <span>{min.toLocaleString()}{unit}</span>
        <span>{max.toLocaleString()}{unit}</span>
      </div>
    </div>
  );
}

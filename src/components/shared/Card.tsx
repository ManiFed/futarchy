import type { ReactNode, CSSProperties } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

export function Card({ children, className = '', onClick, style }: CardProps) {
  return (
    <div
      className={`${styles.card} ${onClick ? styles.clickable : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  action?: ReactNode;
}

export function CardHeader({ children, action }: CardHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>{children}</div>
      {action && <div className={styles.headerAction}>{action}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.body} ${className}`}>{children}</div>;
}

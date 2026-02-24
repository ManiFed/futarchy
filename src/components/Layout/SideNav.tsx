import type { ReactNode } from 'react';
import { useStore } from '../../store/useStore';
import type { SectionId } from '../../types';
import styles from './SideNav.module.css';

const sections: { id: SectionId; label: string; number: number; icon: ReactNode }[] = [
  {
    id: 'policy',
    label: 'Policy',
    number: 1,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'outcome',
    label: 'Outcome Metric',
    number: 2,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'markets',
    label: 'Decision Markets',
    number: 3,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="16,7 22,7 22,13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'results',
    label: 'Results',
    number: 4,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
];

export function SideNav() {
  const { activeSection, setActiveSection, getSectionCompletion } = useStore();
  const completion = getSectionCompletion();

  return (
    <nav className={styles.sideNav}>
      <div className={styles.header}>
        <span className={styles.headerLabel}>Lab Sections</span>
      </div>
      <ul className={styles.navList}>
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const isComplete = completion[section.id];

          return (
            <li key={section.id}>
              <button
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className={`${styles.completionDot} ${isComplete ? styles.complete : ''}`}>
                  {isComplete ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span className={styles.number}>{section.number}</span>
                  )}
                </span>
                <span className={styles.icon}>{section.icon}</span>
                <span className={styles.label}>{section.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className={styles.footer}>
        <div className={styles.progress}>
          <div className={styles.progressLabel}>
            <span>Progress</span>
            <span>{Object.values(completion).filter(Boolean).length}/4</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${(Object.values(completion).filter(Boolean).length / 4) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

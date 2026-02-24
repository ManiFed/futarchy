import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import styles from './TopBar.module.css';

export function TopBar() {
  const { labName, setLabName, status, runSimulation, resetSimulation, isSimulating } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(labName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    const trimmed = editValue.trim();
    if (trimmed) {
      setLabName(trimmed);
    } else {
      setEditValue(labName);
    }
    setIsEditing(false);
  };

  const statusLabel = {
    draft: 'Draft',
    simulating: 'Simulating...',
    completed: 'Completed',
  }[status];

  const statusClass = {
    draft: styles.statusDraft,
    simulating: styles.statusSimulating,
    completed: styles.statusCompleted,
  }[status];

  return (
    <header className={styles.topBar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {isEditing ? (
          <input
            ref={inputRef}
            className={styles.nameInput}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
              if (e.key === 'Escape') {
                setEditValue(labName);
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <button
            className={styles.nameButton}
            onClick={() => {
              setEditValue(labName);
              setIsEditing(true);
            }}
          >
            {labName}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={styles.editIcon}>
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <span className={`${styles.status} ${statusClass}`}>
          {status === 'simulating' && <span className={styles.statusDot} />}
          {statusLabel}
        </span>
      </div>
      <div className={styles.right}>
        <button
          className={styles.btnSecondary}
          onClick={resetSimulation}
          disabled={isSimulating || !useStore.getState().simulation}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M1 4v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Reset
        </button>
        <button
          className={styles.btnPrimary}
          onClick={runSimulation}
          disabled={isSimulating}
        >
          {isSimulating ? (
            <>
              <span className={styles.spinner} />
              Simulating...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polygon points="5,3 19,12 5,21" fill="currentColor"/>
              </svg>
              Run Simulation
            </>
          )}
        </button>
      </div>
    </header>
  );
}

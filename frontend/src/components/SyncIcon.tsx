import React from 'react';
import styles from './SyncIcon.module.css'; // Add CSS styles for SyncIcon

interface SyncIconProps {
  success: boolean;
}

const SyncIcon: React.FC<SyncIconProps> = ({ success }) => {
  return (
    <div className={styles.syncIcon}>
      {success ? (
        <span className={styles.success}>✔ Saved</span>
      ) : (
        <div className={styles.spinner}></div>
      )}
    </div>
  );
};

export default SyncIcon;

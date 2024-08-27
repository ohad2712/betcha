import React, { useEffect, useState } from 'react';
import styles from './SyncIcon.module.css';

interface SyncIconProps {
  saving: boolean;
  success: boolean;
}

const SyncIcon: React.FC<SyncIconProps> = ({ saving, success }) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (success) {
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false); // Hide message after 1 second
      }, 2000); // Adjust delay as needed
    } else {
      setShowMessage(false);
    }
  }, [success]);

  return (
    <div className={styles.syncIcon}>
      {saving ? (
        <div className={styles.spinner}></div>
      ) : showMessage ? (
        <span className={styles.success}>✔ Saved</span>
      ) : null}
    </div>
  );
};


export default SyncIcon;

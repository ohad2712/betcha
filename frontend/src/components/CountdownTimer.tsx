import React, { useEffect, useState } from 'react';
import styles from './CountdownTimer.module.css'; // Import the CSS module

interface CountdownTimerProps {
  deadline: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState<number>(deadline.getTime() - new Date().getTime());

  useEffect(() => {
    const updateTime = () => {
      setTimeLeft(deadline.getTime() - new Date().getTime());
    };

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const formatTime = (time: number) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    const suffix = " until deadline";

    if (days > 1) return `${days} days ${suffix}`;
    if (days === 1) return `${days} day ${hours} hours ${suffix}`;
    if (hours > 0) return `${hours} hours ${minutes} minutes ${suffix}`;
    if (minutes > 0) return `${minutes} minutes ${seconds} seconds ${suffix}`;
    return `${seconds} seconds ${suffix}`;
  };

  return (
    <div className={styles.timer}>
      {timeLeft > 0 ? formatTime(timeLeft) : null}
    </div>
  );
};

export default CountdownTimer;

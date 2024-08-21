// src/components/UserInitials.tsx
import React from 'react';
import './UserInitials.css'; // Import the CSS file

interface UserInitialsProps {
  username: string;
  onOpenSettings: () => void;
}

const UserInitials: React.FC<UserInitialsProps> = ({ username, onOpenSettings }) => {
  const handleClick = () => {
    onOpenSettings();
  };

  const initials = username.charAt(0).toUpperCase();

  return (
    <div className="user-initials" onClick={handleClick}>
      {initials}
    </div>
  );
};

export default UserInitials;

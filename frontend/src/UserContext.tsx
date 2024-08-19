import React, { createContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
}

interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Create a context with default null value
export const UserContext = createContext<UserContextProps | null>(null);

// Define the props for the UserProvider component
interface UserProviderProps {
  children: ReactNode; // ReactNode includes anything that can be rendered
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

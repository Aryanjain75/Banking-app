// MyProvider.tsx
import React, { useState, ReactNode } from 'react';

// Define the context value type
interface MyContextType {
  value: string;
  setValue: (newValue: string) => void|undefined;
}

// Create the context with a default value of `undefined`
const MyContext = React.createContext<any>(undefined);

// Define the props for the provider component
interface MyProviderProps {
  children: ReactNode; // Ensure children is of type ReactNode
}

// Create the provider component
const MyProvider: React.FC<MyProviderProps> = ({ children }) => {
  const [value, setValue] = useState();

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyProvider, MyContext };


import React, { createContext } from 'react';
import { Presenter, presenterInstance } from '../presenter/Presenter';

export const PresenterContext = createContext<Presenter>(presenterInstance);

export const PresenterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PresenterContext.Provider value={presenterInstance}>
      {children}
    </PresenterContext.Provider>
  );
};

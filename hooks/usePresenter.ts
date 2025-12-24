
import { useContext } from 'react';
import { PresenterContext } from '../context/PresenterContext';

export const usePresenter = () => {
  return useContext(PresenterContext);
};

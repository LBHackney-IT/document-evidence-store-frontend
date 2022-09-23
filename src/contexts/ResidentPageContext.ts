import { createContext } from 'react';

export interface UserContextInterface {
  residentIdContext: string;
  teamIdContext: string;
}
export const ResidentPageContext = createContext<
  UserContextInterface | undefined
>(undefined);

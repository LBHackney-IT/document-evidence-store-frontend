import { createContext } from 'react';
import { User } from '../domain/user';

type UserContext = { user?: User };

export const UserContext = createContext<UserContext>({} as UserContext);

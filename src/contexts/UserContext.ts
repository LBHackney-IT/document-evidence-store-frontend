import { createContext } from 'react';
import { User } from 'src/helpers/auth';

type UserContext = { user?: User };

export const UserContext = createContext<UserContext>({} as UserContext);

import Cookie from 'universal-cookie';
import { IncomingMessage, ServerResponse } from 'http';
import jsonwebtoken from 'jsonwebtoken';
import authGroupsJson from '../../auth-groups.json';
import { EnvironmentKey } from '../../types/env';

const secret = process.env.HACKNEY_JWT_SECRET as string;
const cookieName = process.env.NEXT_PUBLIC_HACKNEY_COOKIE_NAME as string;
const baseUrl = process.env.NEXT_PUBLIC_APP_URL as string;
const environmentKey = process.env.NEXT_PUBLIC_REACT_APP_ENV as EnvironmentKey;
const authGroups = authGroupsJson[environmentKey];
const AUTH_WHITELIST = ['/login', '/access-denied'];

export type User = {
  groups: string[];
  name: string;
  email: string;
};

export const createLoginUrl = (redirect: string): string =>
  `https://auth.hackney.gov.uk/auth?redirect_uri=${baseUrl}${redirect}`;

export const pathIsWhitelisted = (path: string): boolean =>
  AUTH_WHITELIST.includes(path);

export const userIsInValidGroup = (user: User): boolean =>
  Object.values(authGroups).some((group) => user.groups.includes(group));

export const serverSideRedirect = (
  res: ServerResponse,
  location: string
): void => {
  res.writeHead(302, { Location: location });
  res.end();
};

// export const deleteSession = (res: ServerResponse): void => {
//   res.setHeader(
//     'Set-Cookie',
//     cookie.serialize(cookieName, '', {
//       maxAge: -1,
//       domain: '.hackney.gov.uk',
//     })
//   );
// };

export const authoriseUser = (req: IncomingMessage): User | undefined => {
  try {
    const cookies = new Cookie(req.headers.cookie ?? '');
    const token = cookies.get(cookieName);

    if (!token) return;

    const user = jsonwebtoken.verify(token, secret) as User | undefined;

    return user;
  } catch (err) {
    if (err instanceof jsonwebtoken.JsonWebTokenError) {
      return;
    }

    throw err;
  }
};

export const unsafeExtractUser = (): User | undefined => {
  const cookies = new Cookie();
  const token = cookies.get(cookieName);

  if (!token) return;

  const user = jsonwebtoken.decode(token) as User | undefined;

  return user;
};

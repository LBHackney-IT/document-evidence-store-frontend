import cookie from 'cookie';
import { IncomingMessage } from 'http';
import jsonwebtoken from 'jsonwebtoken';
import authGroupsJson from '../../auth-groups.json';
import { EnvironmentKey } from '../../types/env';

const secret = process.env.HACKNEY_JWT_SECRET as string;
const cookieName = process.env.HACKNEY_COOKIE_NAME as string;
const baseUrl = process.env.BASE_URL as string;
const environmentKey = process.env.REACT_APP_ENV as EnvironmentKey;
const authGroups = authGroupsJson[environmentKey];
const AUTH_WHITELIST = ['/', '/access-denied'];

export type JWTPayload = {
  groups: string[];
  name: string;
  email: string;
};

export type User = {
  isAuthorised: boolean;
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
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const token = cookies[cookieName];

    if (!token) {
      return;
    }

    const { groups = [], name, email } = jsonwebtoken.verify(
      token,
      secret
    ) as JWTPayload;

    return {
      isAuthorised: true,
      groups,
      name,
      email,
    };
  } catch (err) {
    if (err instanceof jsonwebtoken.JsonWebTokenError) {
      return;
    }

    console.error(err.message);
  }
};

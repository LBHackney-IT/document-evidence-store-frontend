import cookie from 'cookie';
import { IncomingMessage, ServerResponse } from 'http';
import jsonwebtoken from 'jsonwebtoken';
import AuthGroups from '../../auth-groups.json';

const secret = process.env.HACKNEY_JWT_SECRET as string;
const cookieName = process.env.HACKNEY_COOKIE_NAME as string;
const baseUrl = process.env.BASE_URL as string;
const env = process.env.REACT_APP_ENV as keyof typeof AuthGroups;
const authGroups = AuthGroups[env];

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

export const userIsInValidGroup = ({ groups = [] }: User): boolean =>
  Object.values(authGroups).some((group) => groups.includes(group));

export const deleteSession = (res: ServerResponse): void => {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize(cookieName, '', {
      maxAge: -1,
      domain: '.hackney.gov.uk',
    })
  );
};

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
    } else {
      console.log(err.message);
    }
  }
};

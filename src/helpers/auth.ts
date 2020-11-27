import cookie from 'cookie';
import { IncomingMessage, ServerResponse } from 'http';
import jsonwebtoken from 'jsonwebtoken';
import AuthGroups from '../../auth-groups.json';

const secret = process.env.HACKNEY_JWT_SECRET as string;
const cookieName = process.env.HACKNEY_COOKIE_NAME as string;
const env = process.env.REACT_APP_ENV as keyof typeof AuthGroups;
const authGroups = AuthGroups[env];

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

export const AUTH_WHITELIST = ['/login', '/access-denied'];

export const deleteSession = (res: ServerResponse) => {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize(cookieName, '', {
      maxAge: -1,
      domain: '.hackney.gov.uk',
    })
  );
};

export const authoriseUser = ({
  req,
  res,
}: {
  req: IncomingMessage;
  res: ServerResponse;
}): User | undefined => {
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

    const hasValidGroup = groups.some((group) =>
      Object.values(authGroups).includes(group)
    );

    if (!hasValidGroup) {
      return;
    }

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

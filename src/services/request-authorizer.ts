import Cookie from 'universal-cookie';
import * as jsonwebtoken from 'jsonwebtoken';
import AuthGroupsJson from '../../auth-groups.json';
import { EnvironmentKey } from '../../types/env';
import { User } from '../domain/user';

const authGroupsJson = AuthGroupsJson as {
  [key: string]: Record<string, string>;
};

const AUTH_WHITELIST = [
  '/login',
  '/access-denied',
  '/resident/[requestId]',
  '/resident/[requestId]/upload',
  '/resident/[requestId]/confirmation',
];

export interface RequestAuthorizerCommand {
  path: string;
  cookieHeader?: string;
  serverSide: boolean;
}

export type RequestAuthorizerResponse =
  | {
      success: true;
      user?: User;
    }
  | {
      success: false;
      redirect: string;
    };

export interface RequestAuthorizerDependencies {
  secret: string;
  cookieName: string;
  environmentKey: EnvironmentKey;
  authGroups: Record<string, string>;
  authWhitelist: string[];
}

const defaultDependencies = {
  secret: process.env.HACKNEY_JWT_SECRET as string,
  cookieName: process.env.RUNTIME_HACKNEY_COOKIE_NAME as string,
  environmentKey: process.env.RUNTIME_HOST_ENV as EnvironmentKey,
  authGroups: authGroupsJson[process.env.RUNTIME_HOST_ENV as EnvironmentKey],
  authWhitelist: AUTH_WHITELIST,
};

export class RequestAuthorizer {
  private secret: string;
  private cookieName: string;
  private environmentKey: string;
  private authGroups: Record<string, string>;
  private authWhitelist: string[];

  constructor(deps: Partial<RequestAuthorizerDependencies> = {}) {
    this.secret = deps.secret ?? defaultDependencies.secret;
    this.cookieName = deps.cookieName ?? defaultDependencies.cookieName;
    this.environmentKey =
      deps.environmentKey ?? defaultDependencies.environmentKey;
    this.authGroups = deps.authGroups ?? defaultDependencies.authGroups;
    this.authWhitelist =
      deps.authWhitelist ?? defaultDependencies.authWhitelist;
  }

  public execute(command: RequestAuthorizerCommand): RequestAuthorizerResponse {
    const secureEnvironment =
      command.serverSide && this.environmentKey !== 'dev';

    const user = this.authoriseUser(secureEnvironment, command.cookieHeader);

    if (this.pathIsWhitelisted(command.path)) return { success: true, user };

    if (!user) {
      const redirect = encodeURIComponent(command.path || '/');
      const url = `/login?redirect=${redirect}`;

      return { success: false, redirect: url };
    }

    if (!this.userIsInValidGroup(user)) {
      return { success: false, redirect: '/access-denied' };
    }

    return { success: true, user };
  }

  private pathIsWhitelisted(path: string): boolean {
    return this.authWhitelist.includes(path);
  }

  private userIsInValidGroup(user: User): boolean {
    return Object.values(this.authGroups).some((group) =>
      user.groups.includes(group)
    );
  }

  // private deleteSession(res: ServerResponse): void => {
  //   res.setHeader(
  //     'Set-Cookie',
  //     cookie.serialize(cookieName, '', {
  //       maxAge: -1,
  //       domain: '.hackney.gov.uk',
  //     })
  //   );
  // };

  private authoriseUser(
    verify = false,
    cookieHeader?: string
  ): User | undefined {
    try {
      const cookies = new Cookie(cookieHeader);
      const token = cookies.get(this.cookieName);

      if (!token) return;

      const user = (verify
        ? jsonwebtoken.verify(token, this.secret)
        : jsonwebtoken.decode(token)) as User | undefined;

      return user;
    } catch (err) {
      if (err instanceof jsonwebtoken.JsonWebTokenError) {
        return;
      }

      throw err;
    }
  }
}

import Cookie from 'universal-cookie';
import * as jsonwebtoken from 'jsonwebtoken';
import AuthGroupsJson from '../../auth-groups.json';
import { EnvironmentKey } from '../../types/env';
import { AuthenticationError } from '../../types/auth-errors';
import { User } from '../domain/user';

const authGroupsJson = AuthGroupsJson as {
  [key: string]: Record<string, string>;
};

const GLOB = '[^/]+';
const AUTH_WHITELIST = [
  '/login',
  '/access-denied',
  '/resident/*',
  '/resident/*/upload',
  '/resident/*/confirmation',
  '/evidence_requests/*',
  '/evidence_requests/*/document_submissions',
].map((str) => new RegExp(`^${str.replace('*', GLOB)}$`));

export interface RequestAuthorizerCommand {
  path: string;
  cookieHeader?: string;
}

export type RequestAuthorizerResponse =
  | {
      success: true;
      user?: User;
    }
  | {
      success: false;
      error: AuthenticationError;
    };

export interface RequestAuthorizerDependencies {
  secret: string;
  cookieName: string;
  environmentKey: EnvironmentKey;
  authGroups: Record<string, string>;
  authWhitelist: RegExp[];
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
  private authWhitelist: RegExp[];

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
    const user = this.authoriseUser(command.cookieHeader);

    if (this.pathIsWhitelisted(command.path)) return { success: true, user };

    if (!user) {
      return { success: false, error: AuthenticationError.InvalidToken };
    }

    if (!this.userIsInValidGroup(user)) {
      return {
        success: false,
        error: AuthenticationError.GoogleGroupNotRecognised,
      };
    }

    return { success: true, user };
  }

  private pathIsWhitelisted(path: string): boolean {
    const { pathname } = new URL(path, 'http://hackney.gov.uk');
    return this.authWhitelist.some((regex) => regex.test(pathname));
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

  private authoriseUser(cookieHeader?: string): User | undefined {
    const verify = this.environmentKey !== 'dev';

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

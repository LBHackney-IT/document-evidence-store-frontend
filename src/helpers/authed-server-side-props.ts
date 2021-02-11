import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { User } from 'src/domain/user';
import {
  RequestAuthorizer,
  RequestAuthorizerCommand,
} from 'src/services/request-authorizer';
import { AuthenticationError } from '../../types/auth-errors';

const authorizer = new RequestAuthorizer();

type AuthProps = { user?: User };
export type WithUser<PropsType = void> = PropsType & AuthProps;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function withAuth<PropsType extends { [key: string]: unknown }>(
  gssp?: GetServerSideProps<PropsType>
) {
  const authedGssp = async (ctx: GetServerSidePropsContext) => {
    const command: RequestAuthorizerCommand = {
      path: ctx.resolvedUrl,
      cookieHeader: ctx.req?.headers.cookie,
    };

    const authResult = authorizer.execute(command);

    if (authResult.success) {
      if (gssp === undefined) {
        return {
          props: ({ user: authResult.user } as unknown) as WithUser<PropsType>,
        };
      }

      const componentProps = await gssp(ctx);

      if (!('props' in componentProps)) return componentProps;
      return {
        props: { ...componentProps.props, user: authResult.user },
      };
    }

    let destination = '/access-denied';
    if (authResult.error == AuthenticationError.InvalidToken) {
      const encoded = encodeURIComponent(command.path || '/');
      destination = `/login?redirect=${encoded}`;
    }

    return { redirect: { destination, permanent: false } };
  };

  return authedGssp;
}

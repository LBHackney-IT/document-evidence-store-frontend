import { NextApiHandler } from 'next';
import { EvidenceApiGateway } from '../../../gateways/evidence-api';
import { Method } from 'axios';
import {
  RequestAuthorizer,
  RequestAuthorizerCommand,
} from '../../../services/request-authorizer';

const evidenceApiGateway = new EvidenceApiGateway();

const authorizer = new RequestAuthorizer();

const endpoint: NextApiHandler = async (req, res) => {
  const path = req.query.path as string[];
  const authorizeCommand: RequestAuthorizerCommand = {
    serverSide: true,
    cookieHeader: req.headers.cookie,
    path: path.join('/'),
  };

  const { success } = authorizer.execute(authorizeCommand);
  if (!success) return res.status(401).json({ error: 'Unauthorised' });

  try {
    const { status, data } = await evidenceApiGateway.request(
      path,
      req.method as Method,
      req.body
    );

    res.status(status).json(data);
  } catch (err) {
    console.log('Error: ' + JSON.stringify(err));
    res.status(500).json({ error: `Server error` });
  }
};

export default endpoint;

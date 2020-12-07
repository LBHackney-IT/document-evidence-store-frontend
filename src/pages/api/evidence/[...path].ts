import { NextApiHandler } from 'next';
import { authoriseUser } from '../../../helpers/auth';
import { EvidenceApiGateway } from '../../../gateways/evidence-api';
import { Method } from 'axios';

const evidenceApiGateway = new EvidenceApiGateway();

const endpoint: NextApiHandler = async (req, res) => {
  const user = authoriseUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorised' });

  const path = req.query.path as string[];

  try {
    const { status, data } = await evidenceApiGateway.request(
      path,
      req.method as Method,
      req.body
    );

    res.status(status).json(data);
  } catch (err) {
    console.log('Error: ' + err);
    res.status(500).json({ error: `Server error` });
  }
};

export default endpoint;

import { NextApiHandler } from 'next';
import { authoriseUser } from '../../../helpers/auth';

// GET document_types
// GET evidence_requests
// POST evidence_requests

const endpoint: NextApiHandler = (req, res) => {
  const user = authoriseUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const path = req.query.path as string[];

  // 1. get Platform API token for this path

  // 2. Forward request to platform API

  try {
    // call use case here
    res.status(200).json(null);
  } catch (err) {
    console.log('Error: ' + err);
    return res.status(400).json({ error: `Bad request` });
  }
};

export default endpoint;

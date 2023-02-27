import { NextApiHandler } from 'next';
import { EvidenceApiGateway } from '../../../gateways/evidence-api';

const evidenceApiGateway = new EvidenceApiGateway();

const endpoint: NextApiHandler = async (req, res) => {
  const query = req.query;

  const { currentPage, pageSize, team, state } = query;

  const path: string[] = query.path as string[];

  try {
    const data = await evidenceApiGateway.getDocumentSubmissionsForResident(
      req.headers.userEmail?.toString() ?? '',
      path[0].toString() ?? '',
      team?.toString() ?? '',
      currentPage?.toString() ?? '',
      pageSize?.toString() ?? '',
      state ? state.toString() : undefined
    );
    res.send(data);
  } catch (err) {
    console.log('Error: ' + err);
    res.status(500).json({ error: `Server error` });
  }
};

export default endpoint;

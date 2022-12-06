import { NextApiHandler } from 'next';
import { EvidenceApiGateway } from '../../../gateways/evidence-api';

const evidenceApiGateway = new EvidenceApiGateway();

const endpoint: NextApiHandler = async (req, res) => {
  const query = req.query;

  const { path, currentPage, pageSize, team, state } = query;

  try {
    const data = await evidenceApiGateway.getDocumentSubmissionsForResident(
      req.headers.userEmail?.toString() ?? '',
      path[0].toString(),
      team.toString(),
      state.toString(),
      currentPage.toString(),
      pageSize.toString()
    );
    res.send(data);
  } catch (err) {
    console.log('Error: ' + err);
    res.status(500).json({ error: `Server error` });
  }
};

export default endpoint;

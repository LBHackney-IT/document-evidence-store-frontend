import { NextApiHandler } from 'next';
import { EvidenceApiGateway } from '../../../gateways/evidence-api';

const evidenceApiGateway = new EvidenceApiGateway();

const endpoint: NextApiHandler = async (req, res) => {
  const query = req.query;
  const { path, currentPage, pageSize, team, state } = query;

  // Handle PATCH request for hiding document (visibility endpoint)
  if (
    req.method === 'PATCH' &&
    path &&
    path.length === 2 &&
    path[1] === 'visibility'
  ) {
    try {
      const documentId = path[0].toString();
      await evidenceApiGateway.hideDocumentSubmission(
        req.headers.useremail?.toString() ?? '',
        documentId
      );
      res.status(200).json({ success: true });
    } catch (err) {
      console.log('Error hiding document: ' + err);
      res.status(500).json({ error: `Server error` });
    }
    return;
  }

  // Handle GET request for fetching document submissions
  if (req.method === 'GET') {
    try {
      const data = await evidenceApiGateway.getDocumentSubmissionsForResident(
        req.headers.useremail?.toString() ?? '',
        path ? path[0].toString() : '',
        team ? team.toString() : '',
        currentPage ? currentPage.toString() : '',
        pageSize ? pageSize.toString() : '',
        state ? state.toString() : undefined
      );
      res.send(data);
    } catch (err) {
      console.log('Error: ' + err);
      res.status(500).json({ error: `Server error` });
    }
    return;
  }

  // Method not allowed
  res.status(405).json({ error: 'Method not allowed' });
};

export default endpoint;

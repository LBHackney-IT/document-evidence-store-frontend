import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import { NextApiHandler } from 'next';
import { EvidenceApiGateway } from '../../../gateways/evidence-api';

const evidenceApiGateway = new EvidenceApiGateway();

const endpoint: NextApiHandler = async (req, res) => {
  const query = req.query;

  const { path, currentPage, pageSize, team, state } = query;

  try {
    const data = await evidenceApiGateway.getDocumentSubmissionsForResident(
      req.headers.userEmail?.toString() ?? '',
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
};

export default wrapApiHandlerWithSentry(
  endpoint,
  'api/document_submissions/[...path]'
);

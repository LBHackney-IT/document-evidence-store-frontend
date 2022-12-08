import { NextApiHandler } from 'next';
import { EvidenceApiGateway } from '../../../gateways/evidence-api';

const evidenceApiGateway = new EvidenceApiGateway();

const endpoint: NextApiHandler = async (req, res) => {
  const body = req.body;

  const { name, email, phoneNumber } = body;

  try {
    const data = await evidenceApiGateway.createResident(
      name,
      req.headers.useremail?.toString() ?? '',
      email,
      phoneNumber
    );
    res.send(data);
  } catch (err) {
    console.log('Error: ' + err);
    res.status(500).json({ error: `Server error` });
  }
};

export default endpoint;

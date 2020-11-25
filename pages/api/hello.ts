import { NextApiHandler } from 'next';

const handler: NextApiHandler = (_req, res) => {
  res.statusCode = 200;
  res.json({ name: 'John Doe' });
};

export default handler;

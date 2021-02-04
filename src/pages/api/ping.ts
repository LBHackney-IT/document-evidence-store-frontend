import { NextApiHandler } from 'next';

const ping: NextApiHandler = (_, res) => res.json({ beep: 'boop' });

export default ping;

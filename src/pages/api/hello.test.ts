import { NextApiRequest, NextApiResponse } from 'next';
import Hello from './hello';

const res = ({
  json: jest.fn(),
} as unknown) as NextApiResponse;

describe('hello test', () => {
  it('sets the status code', () => {
    Hello({} as NextApiRequest, res);
    expect(res.json).toHaveBeenCalled();
  });
});

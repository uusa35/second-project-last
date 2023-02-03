// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('the req', req.headers.origin);
  const origin = await res.status(200).json({ data: req.headers.origin });
  return origin;
}

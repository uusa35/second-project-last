// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // req.body.token;
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'production',
      expires: new Date(0),
      // sameSite: `strict`,
      path: '/',
    })
  );
  res.status(200).json({ success: true });
}

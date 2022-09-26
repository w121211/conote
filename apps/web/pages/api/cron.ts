/**
 * Borrow code from https://vercel.com/docs/concepts/solutions/cron-jobs
 *
 * Testing:
 * curl --request POST --url 'http://localhost:3000/api/cron' --header 'Authorization: Bearer API_SECRET_KEY'
 */

import { NextApiRequest, NextApiResponse } from 'next'
import { noteDocMergeModel } from '../../lib/models/note-doc-merge.model'

/**
 * TODO:
 * - [] A better and safer secret verification strategy
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const { authorization } = req.headers

      if (authorization === `Bearer ${process.env.APP_API_SECRET}`) {
        // Authorize success, do the job.
        await noteDocMergeModel.mergeSchedule()

        res.status(200).json({ success: true })
      } else {
        res.status(401).json({ success: false })
      }
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ statusCode: 500, message: err.message })
      } else {
        res.status(500).json({ statusCode: 500 })
      }
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

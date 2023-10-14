import cors from 'cors'
import * as env from 'dotenv'
import express from 'express'
import { Scrapper } from './scrapper/scrapper.js'
import { PostData } from './utils/types.js'
import { ALL_SCRAPE_OPTIONS, dataToScrapeSet } from './utils/constants.js'

env.config()
const app = express()
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 5000

app.post('/api/scrape', async (req, res) => {
  const { dataPointsToScrape, linkToScrape }: PostData = req.body

  /**
   * Validate post data
   **/
  if (
    typeof linkToScrape !== 'string' ||
    (!Array.isArray(dataPointsToScrape) && dataPointsToScrape !== 'all')
  ) {
    return res.status(400).json({ error: 'Bad request' })
  }
  if (dataPointsToScrape !== 'all') {
    for (const item of dataPointsToScrape) {
      if (!dataToScrapeSet.has(item)) {
        return res.status(400).json({
          error: `'${item}' is not part of ${JSON.stringify(
            ALL_SCRAPE_OPTIONS,
          )}`,
        })
      }
    }
  }

  const scrapper = new Scrapper(dataPointsToScrape, linkToScrape)

  const scrappedData = await scrapper.startScrapper()
  console.log('This is scrappedData', scrappedData)

  res.status(200).json(scrappedData)
})

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`)
})

import * as env from 'dotenv'
import express from 'express'
import { Scrapper } from './scrapper/scrapper.js'
import { cardHtmlString } from './cardStringHtml.js'
import { sentimentDetector } from './sentiment/sentimentDetector.js'
import cors from 'cors'
import { PostData } from './utils/types.js'

env.config()
const app = express()
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 5000

app.post('/api/scrape', async (req, res) => {
  const body: PostData = req.body

  const scrapper = new Scrapper(
    body.dataPointsToScrape,
    sentimentDetector,
    body.linkToScrape,
  )

  const scrappedData = scrapper.startScrapper()
  console.log('This is scrappedData', scrappedData)

  res.status(200).json(scrappedData)
})

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`)
})

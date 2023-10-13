import cors from 'cors'
import * as env from 'dotenv'
import express from 'express'
import { Scrapper } from './scrapper/scrapper.js'
import { PostData } from './utils/types.js'

env.config()
const app = express()
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 5000

app.post('/api/scrape', async (req, res) => {
  const body: PostData = req.body

  const scrapper = new Scrapper(body.dataPointsToScrape, body.linkToScrape)

  const scrappedData = await scrapper.startScrapper()
  console.log('This is scrappedData', scrappedData)

  res.status(200).json(scrappedData)
})

// const scrapper = new Scrapper('all')
// const data = await scrapper.startScrapper()
// console.log('This is data', data)

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`)
})

import * as env from 'dotenv'
import express from 'express'
import { Scrapper } from './scrapper/scrapper.js'
import { cardHtmlString } from './cardStringHtml.js'
import { sentimentDetector } from './sentiment/sentimentDetector.js'

env.config()
const app = express()
const port = process.env.PORT || 5000

app.get('', async (req, res) => {
  const url = req.query.url
})

const scrapper = new Scrapper('all', sentimentDetector)

const myText = `This is text lifestylethe joys of gardeningdiscover the blissful moments in gardeninggardening is indeed a joyful and rewarding hobby. it is not just an activity but a form of art that brings happiness and a positive vibe to your surroundings. let's delve into the serene world of gardening and the plethora of benefits it brings along.the amazing benefits of gardeningpositive mood: surrounding yourself with beautiful flowers and plants instantly uplifts your mood. the vibrant colors and enchanting fragrances work wonders in driving away negative energies.health benefits: engaging in gardening promotes physical health as it involves various activities like digging, planting, and watering.connection with nature: gardening fosters a deep connection with nature, offering a sense of satisfaction and peace.tips for beginner gardenersif you are a newbie in the gardening world, here are some simple yet effective tips to get you started:start with easy-to-grow plants: opt for plants that are easy to grow and maintain. some great choices include marigolds, sunflowers, and tomatoes.proper watering: ensure your plants receive adequate water, but avoid overwatering to prevent root rot.pest control: learn about organic pest control methods to protect your plants from harmful pests.`

app.listen(port, async () => {})

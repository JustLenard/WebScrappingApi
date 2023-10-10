import express from 'express'
import * as cheerio from 'cheerio'
import puppeteer from 'puppeteer'
import * as env from 'dotenv'
import * as fs from 'fs'

env.config()
const app = express()

const port = process.env.PORT || 5000

class Scrapper {
  private readonly scrapeRoute = 'https://wsa-test.vercel.app'
  constructor() {}

  async scrapeMainPage() {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    // Navigate the page to a URL
    await page.goto(this.scrapeRoute, { waitUntil: 'domcontentloaded' })

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 })

    const imageElements = await page.$$('img') // Find all image elements on the page.

    const cardsHTML = []

    for (const imageElement of imageElements) {
      // Navigate up two levels to the parent of the parent of the image.
      const cardHandle = await imageElement.evaluateHandle((element) => {
        let card = element
        for (let i = 0; i < 2; i++) {
          card = card.parentElement
        }

        return card
      })

      // Get the HTML content of the card.
      const cardHTML = await page.evaluate((card) => card.outerHTML, cardHandle)

      cardsHTML.push(cardHTML)
    }

    // console.log('This is cardsHTML', cardsHTML)

    const data = cardsHTML.map((card) => this.scrapeCard(card))
    console.log('This is data', data)

    return cardsHTML
  }

  scrapeCard(card: string) {
    const $ = cheerio.load(card)

    // Get the image src
    const imageSrc = this.scrapeRoute + $('img').attr('src')

    // Get article link
    const articleHref = this.scrapeRoute + $('a').attr('href')

    const articleName = $('a').last().text()

    const shortDescription = $('div.group div').last().text()

    return {
      image: imageSrc,
      href: articleHref,
      title: articleName,
      short_description: shortDescription,
    }
  }
}

app.get('', async (req, res) => {
  const url = req.query.url
})

const scrapper = new Scrapper()
scrapper.scrapeMainPage()

app.listen(port, async () => {})

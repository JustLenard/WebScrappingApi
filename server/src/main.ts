import express from 'express'
import * as cheerio from 'cheerio'
import puppeteer from 'puppeteer'
import * as env from 'dotenv'
import * as fs from 'fs'
import { CardData } from './utils/types.js'

env.config()
const app = express()

const port = process.env.PORT || 5000

class Scrapper {
  browser: null | puppeteer.Browser
  private readonly scrapeRoute = 'https://wsa-test.vercel.app'
  constructor() {
    this.browser = null
  }

  async startScrapper() {
    this.browser = await puppeteer.launch({ headless: false })

    // const cardsHtml = await this.getCardsHTml()

    /**
     * Scrape data from the cards
     **/
    // const cardsData = cardsHtml.map((card) => this.scrapeCard(card))
    const article = await this.scrapeArticles(
      'https://wsa-test.vercel.app/blog/the-joys-of-gardening',
    )

    console.log('This is article', article)
  }

  private async getCardsHTml() {
    const page = await this.browser.newPage()

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

    return cardsHTML
  }

  private scrapeCard(card: string): CardData {
    const $ = cheerio.load(card)

    // Get the image src
    const imageSrc = this.scrapeRoute + $('img').attr('src')

    // Get article link
    const articleHref = this.scrapeRoute + $('a').attr('href')

    const articleName = $('a').last().text()

    const shortDescription = $('div.group div').last().text()

    // const article = this.scrapeArticles(articleHref)

    return {
      image: imageSrc,
      href: articleHref,
      title: articleName,
      short_description: shortDescription,
    }
  }

  async scrapeArticles(articleLink: string) {
    const page = await this.browser.newPage()

    // Navigate the page to a URL
    await page.goto(articleLink, { waitUntil: 'domcontentloaded' })
    await page.setViewport({ width: 1080, height: 1024 })

    const aTag = await page.$('a')

    const content = await aTag.evaluateHandle((element) => {
      let card = element
      for (let i = 0; i < 2; i++) {
        card = card.parentElement
      }

      return card
    })

    // Get the HTML content of the card.
    const contentHtml = await page.evaluate((card) => card.innerHTML, content)
    console.log('This is contentHtml', contentHtml)

    const $ = cheerio.load(contentHtml)
    const articleText = $('div:first').text()
    console.log('This is articleText', articleText)

    const strongTags = $('strong').length
    console.log('This is strongTags', strongTags)

    return {
      length: articleText.split(' ').length + strongTags,
    }
  }
}

app.get('', async (req, res) => {
  const url = req.query.url
})

const scrapper = new Scrapper()
scrapper.startScrapper()

app.listen(port, async () => {})

//186

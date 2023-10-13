import * as cheerio from 'cheerio'
import puppeteer from 'puppeteer'
import { CardData, DesiredData } from '../utils/types.js'
import { SentimentDetector } from '../sentiment/sentimentDetector.js'
import { SCRAPE_ROUTE, ALL_OPTIONS } from '../utils/constants.js'

export class Scrapper {
  private browser: null | puppeteer.Browser
  private desiredData: Set<DesiredData>
  private sentimentDetector: SentimentDetector
  private scrapeRoute: string

  constructor(
    desiredData: DesiredData[] | 'all',
    sentimentDetector: SentimentDetector,
    scrapeRoute = SCRAPE_ROUTE,
  ) {
    this.browser = null
    this.sentimentDetector = sentimentDetector
    this.desiredData =
      desiredData === 'all' ? new Set(ALL_OPTIONS) : new Set(desiredData)
    this.scrapeRoute = scrapeRoute
  }

  async startScrapper() {
    this.browser = await puppeteer.launch({ headless: false })

    const cardsHtml = await this.getCardsHTml()

    /**
     * Scrape data from the cards
     **/
    const scrapedData = cardsHtml.map((card) => this.scrapeCard(card))

    return scrapedData
  }

  private async getCardsHTml() {
    const page = await this.browser.newPage()
    await page.goto(this.scrapeRoute, { waitUntil: 'domcontentloaded' })
    await page.setViewport({ width: 1080, height: 1024 })

    const cardsContainer = await (
      await page.$('main > div > div > div:nth-child(2)')
    ).evaluate((handle) => handle.outerHTML)

    const $ = cheerio.load(cardsContainer)
    const res = $('div').first().children()

    const cardsHTML: string[] = []
    res.map((_, el) => cardsHTML.push($(el).html()))

    return cardsHTML
  }

  private async scrapeCard(card: string): Promise<CardData> {
    const $ = cheerio.load(card)

    const scrapedData: CardData = {}

    if (this.desiredData.has('title')) {
      scrapedData.title = $('a').last().text()
    }
    if (this.desiredData.has('image')) {
      scrapedData.image = this.scrapeRoute + $('img').first().attr('src')
    }
    if (this.desiredData.has('href')) {
      scrapedData.href = this.scrapeRoute + $('a').attr('href')
    }
    if (this.desiredData.has('short_description')) {
      scrapedData.short_description = $('div.group div').last().text()
    }
    if (this.desiredData.has('article_category')) {
      scrapedData.article_category = $('time').next().text()
    }
    if (this.desiredData.has('author_image')) {
      scrapedData.author_image = this.scrapeRoute + $('img').last().attr('src')
    }
    if (this.desiredData.has('author_name')) {
      scrapedData.author_name = $('img').next().find('div:first').text().trim()
    }

    if (this.desiredData.has('author_occupation')) {
      scrapedData.author_occupation = $('img')
        .next()
        .find('div:last')
        .text()
        .trim()
    }

    /**
     * Scrape article data
     **/
    if (this.desiredData.has('length') || this.desiredData.has('sentiment')) {
      const { length, sentiment } = await this.scrapeArticle(scrapedData.href)
      if (this.desiredData.has('length')) {
        scrapedData.length = length
      }
      if (this.desiredData.has('sentiment')) {
        scrapedData.sentiment = sentiment
      }
    }
    return scrapedData
  }

  async scrapeArticle(articleLink: string): Promise<Partial<CardData>> {
    const page = await this.browser.newPage()

    // Navigate the page to a URL
    await page.goto(articleLink, { waitUntil: 'domcontentloaded' })
    await page.setViewport({ width: 1080, height: 1024 })

    const aTag = await page.$('a')

    const articleElem = await aTag.evaluateHandle((aTagElem) => {
      let temp = aTagElem
      for (let i = 0; i < 2; i++) {
        temp = temp.parentElement
      }

      return temp
    })

    // Get the HTML content of the card.
    const articleHtml = await page.evaluate(
      (card) => card.innerHTML,
      articleElem,
    )

    const $ = cheerio.load(articleHtml)
    const articleText = $('div:first').text()

    const cleanedTextArray = this.cleanText(articleText).split(' ')

    const text = this.cleanText(articleText)

    const articleData: Partial<CardData> = {}

    if (this.desiredData.has('sentiment')) {
      articleData.sentiment =
        this.sentimentDetector.determineTextSentiment(cleanedTextArray)
    }
    if (this.desiredData.has('length')) {
      articleData.length = cleanedTextArray.length
    }

    return articleData
  }

  /**
   * Leave only alpha numberic, spaces and convert to lower case
   **/
  private cleanText(text: string) {
    return (
      text
        // .replaceAll(/[^a-zA-Z\s]+/g, ' ')
        // .replaceAll('  ', '')
        .toLowerCase()
    )
  }
}

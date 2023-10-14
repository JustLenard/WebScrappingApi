import * as cheerio from 'cheerio'
import puppeteer, { Browser } from 'puppeteer'
import {
  SentimentDetector,
  sentimentDetectorInstance,
} from '../sentiment/sentimentDetector.js'
import { ALL_OPTIONS, SCRAPE_ROUTE } from '../utils/constants.js'
import { CardData, DesiredData } from '../utils/types.js'
import { convert } from 'html-to-text'

export class Scrapper {
  private browser: null | Browser
  private desiredData: Set<DesiredData>
  private sentimentDetector: SentimentDetector
  private scrapeRoute: string

  constructor(
    desiredData: DesiredData[] | 'all',
    scrapeRoute = SCRAPE_ROUTE,
    sentimentDetector: SentimentDetector = sentimentDetectorInstance,
  ) {
    this.browser = null
    this.sentimentDetector = sentimentDetector
    this.desiredData =
      desiredData === 'all' ? new Set(ALL_OPTIONS) : new Set(desiredData)
    this.scrapeRoute = scrapeRoute
  }

  async startScrapper() {
    try {
      this.browser = await puppeteer.launch({ headless: false })
      const cardsHtml = await this.getCardsHTml()

      /**
       * Scrape data from the cards
       **/
      const scrapedData = await Promise.all(
        cardsHtml.map((card) => this.scrapeCard(card)),
      )

      this.browser.close()
      return scrapedData
    } catch (err) {
      console.error('An error occurred during scraping:', err)
      return 'Something went wrong. Please try again latter'
    }
  }

  /**
   * Get the HTML of the cards
   **/
  private async getCardsHTml() {
    const page = await this.browser.newPage()
    console.log('This is scrapeRoute', this.scrapeRoute)

    await page.goto(this.scrapeRoute, { waitUntil: 'domcontentloaded' })

    console.log('navigated')

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

  /**
   * Scrape card data
   **/
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
    if (this.desiredData.has('time')) {
      scrapedData.time = $('time').text()
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

  /**
   * Scrape article data
   **/
  async scrapeArticle(articleLink: string): Promise<Partial<CardData>> {
    // console.log('Scrapping article')
    const page = await this.browser.newPage()
    await page.goto(articleLink, { waitUntil: 'domcontentloaded' })
    await page.setViewport({ width: 1080, height: 1024 })

    const pageHtml = await page.content()

    const $ = cheerio.load(pageHtml)

    const articleHtml = $('a').parent().siblings().html()

    const articleText = this.htmlToClenedText(articleHtml)

    const cleanedTextArray = this.htmlToClenedText(articleText).split(' ')

    const articleData: Partial<CardData> = {}

    if (this.desiredData.has('sentiment')) {
      articleData.sentiment =
        this.sentimentDetector.determineTextSentiment(cleanedTextArray)
    }
    if (this.desiredData.has('length')) {
      articleData.length = cleanedTextArray.length
    }

    console.log('This is articleData', articleData)
    return articleData
  }

  /**
   * Format the string. Leave only alpha numberic characters, apostrophes(') and spaces. Convert to lower case
   **/
  private htmlToClenedText(htmlString: string) {
    return convert(htmlString, {
      wordwrap: false,
    })
      .replaceAll('\n', ' ')
      .replaceAll(' * ', '')
      .replaceAll('  ', ' ')
      .replaceAll(/[^a-zA-Z\s']+/g, '')
      .toLowerCase()
  }
}

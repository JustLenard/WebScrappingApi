import * as cheerio from 'cheerio'
import { convert } from 'html-to-text'
import puppeteer, { Browser } from 'puppeteer'
import {
  SentimentDetector,
  sentimentDetectorInstance,
} from '../sentiment/sentimentDetector.js'
import { SCRAPE_ROUTE, dataToScrapeSet } from '../utils/constants.js'
import { CardData, DesiredData } from '../utils/types.js'

export class Scrapper {
  private browser: null | Browser
  private dataToScrape: Set<DesiredData>
  private sentimentDetector: SentimentDetector
  private scrapeRoute: string

  constructor(
    dataToScrape: DesiredData[] | 'all',
    scrapeRoute = SCRAPE_ROUTE,
    sentimentDetector: SentimentDetector = sentimentDetectorInstance,
  ) {
    this.browser = null
    this.sentimentDetector = sentimentDetector
    this.dataToScrape =
      dataToScrape === 'all' ? dataToScrapeSet : new Set(dataToScrape)
    this.scrapeRoute = scrapeRoute
  }

  async startScrapper() {
    try {
      this.browser = await puppeteer.launch({ headless: true })
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

  /**
   * Scrape card data
   **/
  private async scrapeCard(card: string): Promise<CardData> {
    const $ = cheerio.load(card)

    const scrapedData: CardData = {}

    if (this.dataToScrape.has('title')) {
      scrapedData.title = $('a').last().text()
    }
    if (this.dataToScrape.has('image')) {
      scrapedData.image = this.scrapeRoute + $('img').first().attr('src')
    }
    if (this.dataToScrape.has('short_description')) {
      scrapedData.short_description = $('a').last().parent().next().text()
    }
    if (this.dataToScrape.has('time')) {
      scrapedData.time = $('time').text()
    }
    if (this.dataToScrape.has('article_category')) {
      scrapedData.article_category = $('time').next().text()
    }
    if (this.dataToScrape.has('author_image')) {
      scrapedData.author_image = this.scrapeRoute + $('img').last().attr('src')
    }
    if (this.dataToScrape.has('author_name')) {
      scrapedData.author_name = $('img').next().find('div:first').text().trim()
    }

    if (this.dataToScrape.has('author_occupation')) {
      scrapedData.author_occupation = $('img')
        .next()
        .find('div:last')
        .text()
        .trim()
    }

    /**
     * We need to always scrape the href of the article
     * in case we need to scrape data from the article
     **/
    const href = this.scrapeRoute + $('a').attr('href')
    if (this.dataToScrape.has('href')) {
      scrapedData.href = href
    }

    /**
     * Scrape article data
     **/
    if (this.dataToScrape.has('length') || this.dataToScrape.has('sentiment')) {
      const { length, sentiment } = await this.scrapeArticle(href)
      if (this.dataToScrape.has('length')) {
        scrapedData.length = length
      }
      if (this.dataToScrape.has('sentiment')) {
        scrapedData.sentiment = sentiment
      }
    }
    return scrapedData
  }

  /**
   * Scrape article data
   **/
  private async scrapeArticle(articleLink: string): Promise<Partial<CardData>> {
    const page = await this.browser.newPage()
    await page.goto(articleLink, { waitUntil: 'domcontentloaded' })
    await page.setViewport({ width: 1080, height: 1024 })

    const pageHtml = await page.content()

    const $ = cheerio.load(pageHtml)

    const articleHtml = $('a').parent().siblings().html()

    const articleText = this.htmlToClenedText(articleHtml)

    const cleanedTextArray = articleText.split(' ')

    const articleData: Partial<CardData> = {}

    if (this.dataToScrape.has('sentiment')) {
      articleData.sentiment =
        this.sentimentDetector.determineTextSentiment(cleanedTextArray)
    }
    if (this.dataToScrape.has('length')) {
      articleData.length = cleanedTextArray.length
    }

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
      .replace(/\s\s+/g, ' ')
      .trim()
      .toLowerCase()
  }
}

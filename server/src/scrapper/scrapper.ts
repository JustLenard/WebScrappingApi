import * as cheerio from 'cheerio'
import puppeteer from 'puppeteer'
import { CardData, DesiredData } from '../utils/types.js'

export class Scrapper {
  browser: null | puppeteer.Browser
  desiredData: DesiredData[]

  private readonly scrapeRoute = 'https://wsa-test.vercel.app'
  constructor(desiredData: DesiredData[]) {
    this.browser = null
    this.desiredData = desiredData
  }

  async startScrapper() {
    this.browser = await puppeteer.launch({ headless: false })

    const cardsHtml = await this.getCardsHTml()

    /**
     * Scrape data from the cards
     **/
    const cardsData = cardsHtml.map((card) => this.scrapeCard(card))
    // const article = await this.scrapeArticles(
    //   'https://wsa-test.vercel.app/blog/the-joys-of-gardening',
    // )

    // console.log('This is article', article)
  }

  private async getCardsHTml() {
    const page = await this.browser.newPage()
    // Navigate the page to a URL
    await page.goto(this.scrapeRoute, { waitUntil: 'domcontentloaded' })
    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 })

    const mainStuff = await (
      await page.$('main > div > div > div:nth-child(2)')
    ).evaluate((handle) => handle.outerHTML)

    const $ = cheerio.load(mainStuff)

    const res = $('div').first().children()

    const cardsHTML: string[] = []
    res.map((i, el) => cardsHTML.push($(el).html()))

    return cardsHTML
  }

  scrapeCard(card: string): CardData {
    const $ = cheerio.load(card)

    const scrapedData = {}

    // Get the image src
    const imageSrc = this.scrapeRoute + $('img').first().attr('src')

    console.log('This is img', $('img').length)

    // Get article link
    const articleHref = this.scrapeRoute + $('a').attr('href')

    const articleName = $('a').last().text()

    const shortDescription = $('div.group div').last().text()

    const time = $('time').text()

    const article_category = $('time').next().text()

    const author_image = this.scrapeRoute + $('img').last().attr('src')

    console.log('This is author_image', author_image === imageSrc)

    const author_name = $('img').next().find('div:first').text().trim()
    const category = $('img').next().find('div:last').text().trim()

    console.log('This is category', category)
    console.log('This is author_name', author_name)

    return {
      image: imageSrc,
      href: articleHref,
      title: articleName,
      short_description: shortDescription,
      time,
      article_category,
      author_image,
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

    const cleanedTextArray = this.cleanText(articleText).split(' ')

    const text = this.cleanText(articleText)

    return {
      length: cleanedTextArray.length,
    }
  }

  /**
   * Leave only alpha numberic, spaces and convert to lower case
   **/
  cleanText(text: string) {
    return (
      text
        // .replaceAll(/[^a-zA-Z\s]+/g, ' ')
        // .replaceAll('  ', '')
        .toLowerCase()
    )
  }
}

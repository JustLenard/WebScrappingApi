import { DesiredData } from './types.js'

export const SCRAPE_ROUTE = 'https://wsa-test.vercel.app'
export const ALL_SCRAPE_OPTIONS: DesiredData[] = [
  'title',
  'image',
  'href',
  'short_description',
  'time',
  'length',
  'article_category',
  'sentiment',
  'author_image',
  'author_name',
  'author_occupation',
]

export const dataToScrapeSet = new Set(ALL_SCRAPE_OPTIONS)

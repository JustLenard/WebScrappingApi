export type DesiredData =
  | 'title'
  | 'image'
  | 'href'
  | 'short_description'
  | 'time'
  | 'length'
  | 'article_category'
  | 'sentiment'
  | 'author_image'
  | 'author_name'
  | 'author_occupation'

export type CardData = {
  title?: string
  image?: string
  href?: string
  short_description?: string
  time?: string
  length?: number
  article_category?: string
  sentiment?: Sentiment
  author_image?: string
  author_name?: string
  author_occupation?: string
}

export type Sentiment = 'positive' | 'neutral' | 'negative'

export type PostData = {
  linkToScrape: string
  dataPointsToScrape: DesiredData[]
}

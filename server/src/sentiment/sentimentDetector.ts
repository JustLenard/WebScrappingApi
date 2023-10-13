import { Sentiment } from '../utils/types.js'
import { wordsScores } from './wordsScore.js'

/**
 * Singleton class to handle sentiment detection of articles
 **/
export class SentimentDetector {
  valueMapping: Map<string, number>

  private static instance: SentimentDetector | null = null

  constructor() {
    if (SentimentDetector.instance === null) {
      this.valueMapping = new Map(Object.entries(wordsScores))
      SentimentDetector.instance = this
    }
    return SentimentDetector.instance
  }

  determineTextSentiment(text: string[]): Sentiment {
    /**
     * Get the score of the text
     **/
    const score = text.reduce((acc: number, red: string) => {
      const wordScore = this.getWordScore(red)
      acc += wordScore
      return acc
    }, 0)

    /**
     * The score needs to be more than 10% of the text's length to be classified as either negative or positive
     **/
    const neutralScoreBreakpoint = Math.floor(text.length * 0.1)

    if (score > neutralScoreBreakpoint) return 'positive'
    if (score < neutralScoreBreakpoint) return 'negative'
    return 'neutral'
  }

  getWordScore(word: string): number {
    return this.valueMapping.has(word) ? this.valueMapping.get(word) : 0
  }
}

export const sentimentDetectorInstance = new SentimentDetector()

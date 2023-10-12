import { Sentiment } from '../utils/types.js'
import { wordsScores } from './wordsScore.js'

export class SentimentDetector {
  valueMapping: Map<string, number>

  constructor() {
    this.valueMapping = new Map(Object.entries(wordsScores))
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
     * The score needs to be more than 5% of the text's length to be classified as either negative or positive
     **/
    const neutralScoreBreakpoint = Math.floor(text.length * 0.05)

    if (score > neutralScoreBreakpoint) return 'positive'
    if (score < neutralScoreBreakpoint) return 'negative'
    return 'neutral'
  }

  getWordScore(word: string): number {
    return this.valueMapping.has(word) ? this.valueMapping.get(word) : 0
  }
}

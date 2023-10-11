import { Sentiment } from '../utils/types.js'
// import wordsScores from './wordsScore.json' assert { type: 'json' }

const wordsScores = require('./wordsScore.json')

export class SentimentDetector {
  valueMapping: Map<string, number>

  constructor() {
    this.valueMapping = new Map(Object.entries(wordsScores))
  }

  determineTextSentiment(text: string[]): Sentiment {
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
    if (score < neutralScoreBreakpoint) return 'positive'
    return 'neutral'
  }

  getWordScore(word: string) {
    return this.valueMapping.has(word) ? this.valueMapping.get(word) : 0
  }
}

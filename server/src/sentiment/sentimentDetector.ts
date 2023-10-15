import { Sentiment } from '../utils/types.js'
import { negatorsSet } from './negators.js'
import { wordsScores } from './wordsScore.js'

/**
 * Singleton class to handle sentiment detection of articles
 **/
export class SentimentDetector {
  wordsValueMapping: Map<string, number>

  private static instance: SentimentDetector | null = null
  private negatorsSet = negatorsSet

  constructor() {
    if (SentimentDetector.instance === null) {
      this.wordsValueMapping = new Map(Object.entries(wordsScores))
      SentimentDetector.instance = this
    }
    return SentimentDetector.instance
  }

  determineTextSentiment(text: string[]): Sentiment {
    /**
     * Get the score of the text
     **/
    const score = text.reduce((acc: number, red: string, index: number) => {
      // Get the point value of the word
      let wordScore = this.getWordScore(red)

      /**
       * If previous word is a negator, aka: "not", "can't", negate the current point value of the word
       *  "beautiful"  => 3 points
       *  "You are beautiful" => 0 + 0 + 3  => 3 points
       *  "You are not beautiful" => 0 + 0 + 0 + 3 * (-1)  => -3 points
       **/
      if (index && this.negatorsSet.has(text[index - 1])) {
        wordScore = -wordScore
      }

      acc += wordScore
      return acc
    }, 0)

    /**
     * The score needs to be more than 10% of the text's length to be classified as either negative or positive
     **/
    const neutralScoreBreakpoint = Math.floor(text.length * 0.1)

    if (score > neutralScoreBreakpoint) return 'positive'
    if (score < -neutralScoreBreakpoint) return 'negative'
    return 'neutral'
  }

  /**
   * Get the point value of the word
   **/
  getWordScore(word: string): number {
    return this.wordsValueMapping.has(word)
      ? this.wordsValueMapping.get(word)
      : 0
  }
}

export const sentimentDetectorInstance = new SentimentDetector()

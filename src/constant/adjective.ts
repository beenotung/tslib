// Word list adapted from Docker's names-generator (moby/moby, internal/namesgenerator/names-generator.go)
// https://github.com/moby/moby/blob/master/internal/namesgenerator/names-generator.go
// Each word is tagged with sentiment, category, and intensity for flexible filtering.

export type AdjectiveSentiment = 'positive' | 'negative' | 'neutral'
export type AdjectiveCategory =
  | 'personality'
  | 'emotion'
  | 'appearance'
  | 'state'
  | 'intellect'
export type AdjectiveIntensity = 'mild' | 'strong'

export type AdjectiveTag =
  | AdjectiveSentiment
  | AdjectiveCategory
  | AdjectiveIntensity

export interface Adjective {
  word: string
  tags: AdjectiveTag[]
}

export const adjectives: Adjective[] = [
  { word: 'admiring', tags: ['positive', 'personality', 'mild'] },
  { word: 'adoring', tags: ['positive', 'emotion', 'strong'] },
  { word: 'affectionate', tags: ['positive', 'emotion', 'mild'] },
  { word: 'agitated', tags: ['negative', 'emotion', 'strong'] },
  { word: 'amazing', tags: ['positive', 'emotion', 'strong'] },
  { word: 'angry', tags: ['negative', 'emotion', 'strong'] },
  { word: 'awesome', tags: ['positive', 'emotion', 'strong'] },
  { word: 'beautiful', tags: ['positive', 'appearance', 'strong'] },
  { word: 'blissful', tags: ['positive', 'emotion', 'strong'] },
  { word: 'blue', tags: ['neutral', 'appearance', 'emotion', 'mild'] },
  { word: 'bold', tags: ['positive', 'personality', 'strong'] },
  { word: 'boring', tags: ['negative', 'personality', 'mild'] },
  { word: 'brave', tags: ['positive', 'personality', 'strong'] },
  { word: 'bright', tags: ['positive', 'intellect', 'mild'] },
  { word: 'busy', tags: ['neutral', 'state', 'mild'] },
  { word: 'calm', tags: ['positive', 'personality', 'mild'] },
  { word: 'charming', tags: ['positive', 'personality', 'mild'] },
  { word: 'cheerful', tags: ['positive', 'emotion', 'mild'] },
  { word: 'clever', tags: ['positive', 'intellect', 'mild'] },
  { word: 'compassionate', tags: ['positive', 'personality', 'mild'] },
  { word: 'competent', tags: ['positive', 'intellect', 'mild'] },
  { word: 'condescending', tags: ['negative', 'personality', 'strong'] },
  { word: 'confident', tags: ['positive', 'personality', 'mild'] },
  { word: 'cool', tags: ['positive', 'personality', 'mild'] },
  { word: 'cranky', tags: ['negative', 'emotion', 'mild'] },
  { word: 'crazy', tags: ['negative', 'personality', 'state', 'strong'] },
  { word: 'dazzling', tags: ['positive', 'appearance', 'strong'] },
  { word: 'determined', tags: ['positive', 'personality', 'strong'] },
  { word: 'distracted', tags: ['negative', 'state', 'mild'] },
  { word: 'dreamy', tags: ['positive', 'personality', 'mild'] },
  { word: 'eager', tags: ['positive', 'emotion', 'mild'] },
  { word: 'ecstatic', tags: ['positive', 'emotion', 'strong'] },
  { word: 'elated', tags: ['positive', 'emotion', 'strong'] },
  { word: 'elastic', tags: ['neutral', 'appearance', 'mild'] },
  { word: 'elegant', tags: ['positive', 'appearance', 'mild'] },
  { word: 'eloquent', tags: ['positive', 'intellect', 'mild'] },
  { word: 'epic', tags: ['positive', 'emotion', 'strong'] },
  { word: 'exciting', tags: ['positive', 'emotion', 'strong'] },
  { word: 'fervent', tags: ['positive', 'emotion', 'strong'] },
  { word: 'festive', tags: ['positive', 'emotion', 'mild'] },
  {
    word: 'flamboyant',
    tags: ['positive', 'personality', 'appearance', 'strong'],
  },
  { word: 'focused', tags: ['positive', 'personality', 'mild'] },
  { word: 'friendly', tags: ['positive', 'personality', 'mild'] },
  { word: 'frosty', tags: ['negative', 'personality', 'mild'] },
  { word: 'funny', tags: ['positive', 'personality', 'mild'] },
  { word: 'gallant', tags: ['positive', 'personality', 'strong'] },
  { word: 'gifted', tags: ['positive', 'intellect', 'strong'] },
  { word: 'gloomy', tags: ['negative', 'emotion', 'strong'] },
  { word: 'goofy', tags: ['neutral', 'personality', 'mild'] },
  { word: 'gracious', tags: ['positive', 'personality', 'mild'] },
  { word: 'great', tags: ['positive', 'emotion', 'strong'] },
  { word: 'happy', tags: ['positive', 'emotion', 'mild'] },
  { word: 'hardcore', tags: ['positive', 'personality', 'strong'] },
  { word: 'harsh', tags: ['negative', 'personality', 'strong'] },
  { word: 'heuristic', tags: ['neutral', 'intellect', 'mild'] },
  { word: 'hopeful', tags: ['positive', 'emotion', 'mild'] },
  { word: 'hungry', tags: ['neutral', 'state', 'mild'] },
  { word: 'infallible', tags: ['positive', 'intellect', 'strong'] },
  { word: 'inspiring', tags: ['positive', 'emotion', 'strong'] },
  { word: 'intelligent', tags: ['positive', 'intellect', 'mild'] },
  { word: 'interesting', tags: ['neutral', 'intellect', 'mild'] },
  { word: 'jolly', tags: ['positive', 'emotion', 'mild'] },
  { word: 'jovial', tags: ['positive', 'emotion', 'mild'] },
  { word: 'keen', tags: ['positive', 'emotion', 'mild'] },
  { word: 'kind', tags: ['positive', 'personality', 'mild'] },
  { word: 'laughing', tags: ['neutral', 'state', 'mild'] },
  { word: 'loving', tags: ['positive', 'emotion', 'strong'] },
  { word: 'lucid', tags: ['positive', 'intellect', 'mild'] },
  { word: 'magical', tags: ['positive', 'emotion', 'strong'] },
  { word: 'modest', tags: ['positive', 'personality', 'mild'] },
  { word: 'musing', tags: ['neutral', 'state', 'mild'] },
  { word: 'mystifying', tags: ['neutral', 'intellect', 'mild'] },
  { word: 'naughty', tags: ['negative', 'personality', 'mild'] },
  { word: 'nervous', tags: ['negative', 'emotion', 'mild'] },
  { word: 'nice', tags: ['positive', 'personality', 'mild'] },
  { word: 'nifty', tags: ['positive', 'intellect', 'mild'] },
  { word: 'nostalgic', tags: ['neutral', 'emotion', 'mild'] },
  { word: 'objective', tags: ['neutral', 'intellect', 'mild'] },
  { word: 'optimistic', tags: ['positive', 'emotion', 'mild'] },
  { word: 'peaceful', tags: ['positive', 'emotion', 'mild'] },
  { word: 'pedantic', tags: ['negative', 'personality', 'mild'] },
  { word: 'pensive', tags: ['neutral', 'state', 'mild'] },
  { word: 'practical', tags: ['positive', 'intellect', 'mild'] },
  { word: 'priceless', tags: ['positive', 'emotion', 'strong'] },
  { word: 'quiet', tags: ['neutral', 'personality', 'mild'] },
  { word: 'quirky', tags: ['positive', 'personality', 'mild'] },
  { word: 'quizzical', tags: ['neutral', 'personality', 'mild'] },
  { word: 'recursing', tags: ['neutral', 'intellect', 'mild'] },
  { word: 'relaxed', tags: ['positive', 'state', 'mild'] },
  { word: 'reverent', tags: ['positive', 'personality', 'mild'] },
  { word: 'romantic', tags: ['positive', 'emotion', 'mild'] },
  { word: 'round', tags: ['neutral', 'appearance', 'mild'] },
  { word: 'sad', tags: ['negative', 'emotion', 'strong'] },
  { word: 'serene', tags: ['positive', 'emotion', 'mild'] },
  { word: 'sharp', tags: ['positive', 'intellect', 'strong'] },
  { word: 'silly', tags: ['negative', 'personality', 'mild'] },
  { word: 'sleepy', tags: ['neutral', 'state', 'mild'] },
  { word: 'stoic', tags: ['neutral', 'personality', 'mild'] },
  { word: 'strange', tags: ['neutral', 'personality', 'mild'] },
  { word: 'stupefied', tags: ['negative', 'state', 'strong'] },
  { word: 'suspicious', tags: ['negative', 'personality', 'mild'] },
  { word: 'sweet', tags: ['positive', 'personality', 'mild'] },
  { word: 'tender', tags: ['positive', 'emotion', 'mild'] },
  { word: 'thirsty', tags: ['neutral', 'state', 'mild'] },
  { word: 'trusting', tags: ['positive', 'personality', 'mild'] },
  { word: 'unruffled', tags: ['positive', 'personality', 'mild'] },
  { word: 'upbeat', tags: ['positive', 'emotion', 'mild'] },
  { word: 'vibrant', tags: ['positive', 'appearance', 'strong'] },
  { word: 'vigilant', tags: ['positive', 'personality', 'mild'] },
  { word: 'vigorous', tags: ['positive', 'state', 'strong'] },
  { word: 'wizardly', tags: ['positive', 'intellect', 'strong'] },
  { word: 'wonderful', tags: ['positive', 'emotion', 'strong'] },
  { word: 'xenodochial', tags: ['positive', 'personality', 'mild'] },
  { word: 'youthful', tags: ['positive', 'appearance', 'mild'] },
  { word: 'zealous', tags: ['positive', 'emotion', 'strong'] },
  { word: 'zen', tags: ['positive', 'personality', 'mild'] },
]

export type AdjectiveFilterMode = 'and' | 'or'

export function filterAdjectives(args: {
  tags: AdjectiveTag[]
  mode?: AdjectiveFilterMode
  not?: boolean
}): Adjective[] {
  const { tags, mode = 'and', not = false } = args
  const match_mode =
    mode === 'and'
      ? (a: Adjective) => tags.every(tag => a.tags.includes(tag))
      : (a: Adjective) => tags.some(tag => a.tags.includes(tag))
  const match_not = not ? (a: Adjective) => !match_mode(a) : match_mode
  return adjectives.filter(a => match_not(a))
}

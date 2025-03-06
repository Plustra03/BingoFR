export type GameState = 'new' | 'running' | 'paused' | 'finished'
export type GameLetter = 'B' | 'I' | 'N' | 'G' | 'O'
export type GameNumber = { letter: GameLetter; value: number; marked: boolean }

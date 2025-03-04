import { type GameLetter, type GameNumber } from '../Game'

export const createGameNumbers = (): GameNumber[] => {
    const letters: GameLetter[] = ['B', 'I', 'N', 'G', 'O']
    const numbers: GameNumber[] = []

    letters.forEach((letter, index) => {
        const start = index * 15 + 1
        const end = start + 14
        for (let i = start; i <= end; i++) {
            numbers.push({ value: i, letter, marked: false })
        }
    })

    return numbers
}

export const createPlayerNumbers = (): GameNumber[] => {
    const letters: GameLetter[] = ['B', 'I', 'N', 'G', 'O']
    const participantNumbers: GameNumber[] = []
    const numbersPerLetter = 5

    letters.forEach((letter, index) => {
        const start = index * 15 + 1
        const end = start + 14
        const range = Array.from({ length: end - start + 1 }, (_, i) => start + i)
        const selectedNumbers = range.sort(() => 0.5 - Math.random()).slice(0, numbersPerLetter)

        selectedNumbers.forEach((value) => {
            participantNumbers.push({ letter, value, marked: false })
        })
    })

    return participantNumbers
}

export const pickRandomNumber = (numbers: GameNumber[]): number => {
    const unmarkedIndices = numbers.map((number, index) => (number.marked ? -1 : index)).filter((index) => index !== -1)
    if (unmarkedIndices.length === 0) {
        throw new Error('No unmarked numbers available')
    }

    const randomIndex = Math.floor(Math.random() * unmarkedIndices.length)
    return unmarkedIndices[randomIndex]
}

export const randomReactionDelay = (): number => {
    const min = 0.5 * 1000
    const max = 2 * 1000
    return Math.random() * (max - min) + min
}

export const reproduceSound = (sound: HTMLAudioElement): void => {
    sound.currentTime = 0
    sound.play()
}

export const isEveryNumberMarked = (numbers: GameNumber[]): boolean => {
    return numbers.every((number) => number.marked)
}

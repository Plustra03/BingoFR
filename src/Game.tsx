import { useEffect, useRef, useState, type FunctionComponent, type Dispatch, type SetStateAction } from 'react'
import { useInterval } from './hooks/useInterval'
import Card from './components/Card'
import Header from './components/Header'
import Button from './components/Button'
import Action from './components/Action'
import WinSound from './sounds/success.mp3'
import LoseSound from './sounds/failure.mp3'
import AlertSound from './sounds/alert.mp3'
import MarkSound from './sounds/mark.mp3'
import PlayIcon from './icons/play.svg'
import PauseIcon from './icons/pause.svg'
import ResumeIcon from './icons/resume.svg'
import ResetIcon from './icons/reset.svg'

import {
    createGameNumbers,
    createPlayerNumbers,
    pickRandomNumber,
    randomReactionDelay,
    isEveryNumberMarked,
    reproduceSound,
} from './utils/commons'

export type GameState = 'new' | 'running' | 'paused' | 'finished'
export type GameLetter = 'B' | 'I' | 'N' | 'G' | 'O'
export type GameNumber = { letter: GameLetter; value: number; marked: boolean }

const Game: FunctionComponent = () => {
    const [state, setState] = useState<GameState>('new')
    const [numberAnnounced, setNumberAnnounced] = useState<GameNumber | undefined>()
    const [gameNumbers, setGameNumbers] = useState<GameNumber[]>(createGameNumbers())
    const [playerNumbers, setPlayerNumbers] = useState<GameNumber[]>(createPlayerNumbers())
    const [enemyRedNumbers, setEnemyRedNumbers] = useState<GameNumber[]>(createPlayerNumbers())
    const [enemyGreenNumbers, setEnemyGreenNumbers] = useState<GameNumber[]>(createPlayerNumbers())
    const [enemyOrangeNumbers, setEnemyOrangeNumbers] = useState<GameNumber[]>(createPlayerNumbers())
    const [enemyPurpleNumbers, setEnemyPurpleNumbers] = useState<GameNumber[]>(createPlayerNumbers())
    const enemiesTimeoutsRef = useRef<number[]>([])
    const winSoundRef = useRef<HTMLAudioElement>(new Audio(WinSound))
    const loseSoundRef = useRef<HTMLAudioElement>(new Audio(LoseSound))
    const alertSoundRef = useRef<HTMLAudioElement>(new Audio(AlertSound))
    const markSoundRef = useRef<HTMLAudioElement>(new Audio(MarkSound))

    // Load sounds
    useEffect(() => {
        winSoundRef.current.load()
        loseSoundRef.current.load()
        alertSoundRef.current.load()
        markSoundRef.current.load()
        winSoundRef.current.volume = 0.5
        loseSoundRef.current.volume = 0.5
        alertSoundRef.current.volume = 0.5
        markSoundRef.current.volume = 0.5
    }, [])

    // Announce number every 5 seconds
    useInterval(() => {
        announceNumber()
    }, [5000, state === 'running'])

    const startGame = (): void => {
        if (state !== 'new') throw new Error('Cannot start the game if it is already started')
        announceNumber()
        setState('running')
    }

    const pauseGame = (): void => {
        if (state !== 'running') throw new Error('Cannot pause the game if it is not running')
        setState('paused')
    }

    const resumeGame = (): void => {
        if (state !== 'paused') throw new Error('Cannot resume the game if it is not paused')
        setState('running')
    }

    const winGame = (): void => {
        if (state === 'new') throw new Error('Cannot win the game if it has not been started')
        if (state === 'finished') throw new Error('Cannot win the game if it is already finished')
        reproduceSound(winSoundRef.current)
        finishGame()
    }

    const loseGame = (): void => {
        if (state === 'new') throw new Error('Cannot lose the game if it has not been started')
        if (state === 'finished') throw new Error('Cannot lose the game if it is already finished')
        reproduceSound(loseSoundRef.current)
        finishGame()
    }

    const finishGame = (): void => {
        if (state === 'new') throw new Error('Cannot finish the game if it has not been started')
        if (state === 'finished') throw new Error('Cannot finish the game if it is already finished')
        clearEnemiesTimeouts()
        setState('finished')
    }

    const restartGame = (): void => {
        clearEnemiesTimeouts()
        setNumberAnnounced(undefined)
        setGameNumbers(createGameNumbers())
        setPlayerNumbers(createPlayerNumbers())
        setEnemyRedNumbers(createPlayerNumbers())
        setEnemyGreenNumbers(createPlayerNumbers())
        setEnemyOrangeNumbers(createPlayerNumbers())
        setEnemyPurpleNumbers(createPlayerNumbers())
        setState('running')
    }

    const announceNumber = (): void => {
        reproduceSound(alertSoundRef.current)
        const index = pickRandomNumber(gameNumbers)

        const newGameNumbers = [...gameNumbers]
        newGameNumbers[index].marked = true
        setGameNumbers(newGameNumbers)

        const number = newGameNumbers[index]
        setNumberAnnounced(number)
        makeEnemiesReact(number)
    }

    const makeEnemiesReact = (numberAnnounced: GameNumber): void => {
        const red = setTimeout(() => markEnemyNumbers(numberAnnounced, setEnemyRedNumbers), randomReactionDelay())
        const green = setTimeout(() => markEnemyNumbers(numberAnnounced, setEnemyGreenNumbers), randomReactionDelay())
        const orange = setTimeout(() => markEnemyNumbers(numberAnnounced, setEnemyOrangeNumbers), randomReactionDelay())
        const purple = setTimeout(() => markEnemyNumbers(numberAnnounced, setEnemyPurpleNumbers), randomReactionDelay())

        enemiesTimeoutsRef.current = [...enemiesTimeoutsRef.current, red, green, orange, purple]
    }

    const markEnemyNumbers = (numberAnnounced: GameNumber, setter: Dispatch<SetStateAction<GameNumber[]>>): void => {
        setter((prev) => {
            if (state === 'finished') return prev
            const newNumbers = prev.map((n) => (n.value === numberAnnounced.value ? { ...n, marked: true } : n))
            if (isEveryNumberMarked(newNumbers)) loseGame()
            return newNumbers
        })
    }

    const clearEnemiesTimeouts = (): void => {
        enemiesTimeoutsRef.current.forEach((timeout) => {
            clearTimeout(timeout)
        })

        enemiesTimeoutsRef.current = []
    }

    const togglePlayerNumber = (number: GameNumber): void => {
        reproduceSound(markSoundRef.current)
        setPlayerNumbers((prev) => prev.map((n) => (n.value === number.value ? { ...n, marked: number.marked } : n)))
    }

    const bingo = () => {
        if (playerNumbers.every((pn) => gameNumbers.filter((gn) => gn.marked).includes(pn))) {
            winGame()
        } else {
            loseGame()
        }
    }

    return (
        <div className="w-screen h-screen grid place-items-center">
            <div className="w-fit h-fit flex gap-20">
                <div className="grid grid-rows-2 grid-cols-2 gap-10">
                    <Card color="red" squares={enemyRedNumbers} mini />
                    <Card color="green" squares={enemyGreenNumbers} mini />
                    <Card color="orange" squares={enemyOrangeNumbers} mini />
                    <Card color="purple" squares={enemyPurpleNumbers} mini />
                </div>
                <div className="flex flex-col gap-10">
                    <Header>{numberAnnounced}</Header>
                    <div className="flex gap-10">
                        <Card
                            color="blue"
                            squares={playerNumbers}
                            onToggleSquare={state !== 'new' && state !== 'finished' ? togglePlayerNumber : undefined}
                        />
                        <div className="flex flex-col gap-5 justify-between">
                            <div className="flex flex-col gap-5 justify-between">
                                <Action icon={PlayIcon} enable={state === 'new'} onTrigger={startGame}>
                                    Start
                                </Action>
                                <Action icon={PauseIcon} enable={state === 'running'} onTrigger={pauseGame}>
                                    Pause
                                </Action>
                                <Action icon={ResumeIcon} enable={state === 'paused'} onTrigger={resumeGame}>
                                    Resume
                                </Action>
                                <Action icon={ResetIcon} enable={state !== 'new'} onTrigger={restartGame}>
                                    Restart
                                </Action>
                            </div>
                            <Button enabled={state === 'running' && isEveryNumberMarked(playerNumbers)} onClick={bingo}>
                                BINGO!
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game

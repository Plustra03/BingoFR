import { useRef, useState, type FunctionComponent, type Dispatch, type SetStateAction } from 'react'
import { type GameState, type GameNumber } from '../types'
import { useInterval, useSound } from '../hooks'
import { PlayIcon, PauseIcon, ResumeIcon, ResetIcon } from '../icons'
import { SuccessSound, FailureSound, AlertSound, MarkSound } from '../sounds'
import { newGameNumbers, newCardNumbers, chooseNumber, randomReactionDelay, isEveryNumberMarked } from '../utils'
import Card from '../components/Card'
import Header from '../components/Header'
import Button from '../components/Button'
import Action from '../components/Action'

const Game: FunctionComponent = () => {
    const [state, setState] = useState<GameState>('new')
    const [numberAnnounced, setNumberAnnounced] = useState<GameNumber | undefined>()
    const [gameNumbers, setGameNumbers] = useState<GameNumber[]>(newGameNumbers())
    const [playerNumbers, setPlayerNumbers] = useState<GameNumber[]>(newCardNumbers())
    const [enemyRedNumbers, setEnemyRedNumbers] = useState<GameNumber[]>(newCardNumbers())
    const [enemyGreenNumbers, setEnemyGreenNumbers] = useState<GameNumber[]>(newCardNumbers())
    const [enemyOrangeNumbers, setEnemyOrangeNumbers] = useState<GameNumber[]>(newCardNumbers())
    const [enemyPurpleNumbers, setEnemyPurpleNumbers] = useState<GameNumber[]>(newCardNumbers())
    const playSuccessSound = useSound(SuccessSound, 0.5)
    const playFailureSound = useSound(FailureSound, 0.5)
    const playAlertSound = useSound(AlertSound, 0.5)
    const playMarkSound = useSound(MarkSound, 0.5)
    const enemiesTimeoutsRef = useRef<number[]>([])

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
        playSuccessSound()
        finishGame()
    }

    const loseGame = (): void => {
        if (state === 'new') throw new Error('Cannot lose the game if it has not been started')
        if (state === 'finished') throw new Error('Cannot lose the game if it is already finished')
        playFailureSound()
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
        setGameNumbers(newGameNumbers())
        setPlayerNumbers(newCardNumbers())
        setEnemyRedNumbers(newCardNumbers())
        setEnemyGreenNumbers(newCardNumbers())
        setEnemyOrangeNumbers(newCardNumbers())
        setEnemyPurpleNumbers(newCardNumbers())
        setState('running')
    }

    const announceNumber = (): void => {
        playAlertSound()
        const index = chooseNumber(gameNumbers)

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
        playMarkSound()
        setPlayerNumbers((prev) => prev.map((n) => (n.value === number.value ? { ...n, marked: number.marked } : n)))
    }

    const bingo = () => {
        const markedGameNumbers = gameNumbers.filter((gn) => gn.marked).map((gn) => gn.value)
        if (playerNumbers.every((pn) => markedGameNumbers.includes(pn.value))) {
            winGame()
        } else {
            loseGame()
        }
    }

    return (
        <div className="w-screen h-screen grid place-items-center">
            <div className="w-fit h-fit flex gap-7">
                <div className="grid grid-rows-2 grid-cols-2 gap-7">
                    <Card color="red" squares={enemyRedNumbers} mini />
                    <Card color="green" squares={enemyGreenNumbers} mini />
                    <Card color="orange" squares={enemyOrangeNumbers} mini />
                    <Card color="purple" squares={enemyPurpleNumbers} mini />
                </div>
                <div className="flex flex-col gap-7">
                    <Header>{numberAnnounced}</Header>
                    <div className="flex gap-7">
                        <Card
                            color="blue"
                            squares={playerNumbers}
                            onToggleSquare={state !== 'new' && state !== 'finished' ? togglePlayerNumber : undefined}
                        />
                        <div className="flex flex-col gap-5 justify-between">
                            <div className="flex flex-col gap-5">
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

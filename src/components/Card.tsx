import { type FunctionComponent } from 'react'
import { type GameNumber } from '../Game'
import clsx from 'clsx'
import Square from './Square'

type CardProps = {
    squares: GameNumber[]
    color: 'blue' | 'red' | 'green' | 'orange' | 'purple'
    mini?: boolean
    onToggleSquare?: (square: GameNumber) => void
}

const Card: FunctionComponent<CardProps> = (props) => {
    return (
        <div className={clsx('w-fit h-fit overflow-hidden select-none', props.mini ? 'rounded-lg' : 'rounded-xl')}>
            <div
                className={clsx(
                    'grid grid-rows-1 grid-cols-5 font-bold text-white',
                    props.mini ? 'p-3 gap-3 text-xl' : 'p-6 gap-6 text-3xl',
                    {
                        'bg-blue-400': props.color === 'blue',
                        'bg-red-400': props.color === 'red',
                        'bg-green-400': props.color === 'green',
                        'bg-orange-400': props.color === 'orange',
                        'bg-purple-400': props.color === 'purple',
                    }
                )}
            >
                <span className={clsx('aspect-square grid place-items-center', props.mini ? 'w-10' : 'w-14')}>B</span>
                <span className={clsx('aspect-square grid place-items-center', props.mini ? 'w-10' : 'w-14')}>I</span>
                <span className={clsx('aspect-square grid place-items-center', props.mini ? 'w-10' : 'w-14')}>N</span>
                <span className={clsx('aspect-square grid place-items-center', props.mini ? 'w-10' : 'w-14')}>G</span>
                <span className={clsx('aspect-square grid place-items-center', props.mini ? 'w-10' : 'w-14')}>O</span>
            </div>
            <div
                className={clsx(
                    'grid grid-rows-5 grid-cols-5 grid-flow-col bg-gray-100',
                    props.mini ? 'p-3 gap-3' : 'p-6 gap-6'
                )}
            >
                {props.squares.map((square) => (
                    <Square
                        key={`${props.color}:${square.letter}:${square.value}`}
                        color={props.color}
                        mini={props.mini}
                        marked={square.marked}
                        onToggle={
                            props.onToggleSquare
                                ? () => props.onToggleSquare!({ ...square, marked: !square.marked })
                                : undefined
                        }
                    >
                        {square.value}
                    </Square>
                ))}
            </div>
        </div>
    )
}

export default Card

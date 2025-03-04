import { type FunctionComponent } from 'react'
import clsx from 'clsx'

type SquareProps = {
    children: number
    color: 'blue' | 'red' | 'green' | 'orange' | 'purple'
    marked?: boolean
    mini?: boolean
    onToggle?: () => void
}

const Square: FunctionComponent<SquareProps> = (props) => {
    return (
        <button
            type="button"
            onClick={props.onToggle}
            className={clsx(
                'aspect-square grid place-items-center rounded-full font-semibold select-none',
                props.mini ? 'w-10 text-sm' : 'w-14 text-lg',
                props.onToggle && 'hover:cursor-pointer',
                props.marked ? 'text-white' : 'bg-white text-black',
                props.marked && {
                    'bg-blue-400 text-white': props.color === 'blue',
                    'bg-red-400 text-white': props.color === 'red',
                    'bg-green-400 text-white': props.color === 'green',
                    'bg-orange-400 text-white': props.color === 'orange',
                    'bg-purple-400 text-white': props.color === 'purple',
                }
            )}
        >
            {props.children}
        </button>
    )
}

export default Square

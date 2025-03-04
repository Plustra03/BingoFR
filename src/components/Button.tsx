import { type FunctionComponent } from 'react'
import clsx from 'clsx'

type ButtonProps = {
    children: string
    enabled?: boolean
    onClick: () => void
}

const Button: FunctionComponent<ButtonProps> = (props) => {
    return (
        <button
            type="button"
            onClick={props.enabled ? props.onClick : undefined}
            className={clsx(
                'w-52 aspect-square rounded-full text-3xl font-bold transition',
                props.enabled
                    ? 'bg-blue-400 text-white hover:cursor-pointer active:translate-y-1'
                    : 'bg-gray-100 text-gray-300 hover:cursor-not-allowed'
            )}
        >
            {props.children}
        </button>
    )
}

export default Button

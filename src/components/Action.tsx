import { type FunctionComponent } from 'react'
import clsx from 'clsx'

type ActionProps = {
    enable: boolean
    icon: string
    children: string
    onTrigger: () => void
}

const Action: FunctionComponent<ActionProps> = (props) => {
    return (
        <button
            type="button"
            onClick={props.enable ? props.onTrigger : undefined}
            className={clsx(
                'flex gap-3 place-items-center select-none',
                props.enable ? 'hover:cursor-pointer' : 'opacity-30 hover:cursor-not-allowed'
            )}
        >
            <img src={props.icon} className="h-5 aspect-square" />
            <span className="text-2xl font-semibold">{props.children}</span>
        </button>
    )
}

export default Action

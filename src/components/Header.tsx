import { type FunctionComponent } from 'react'
import { type GameNumber } from '../types'

type HeaderProps = {
    children: GameNumber | undefined
}

const Header: FunctionComponent<HeaderProps> = (props) => {
    return (
        <div className="h-full grid place-items-center rounded-xl border-4 border-dotted border-gray-300">
            {props.children && (
                <span className="text-7xl font-semibold font-sans">
                    {props.children.letter} : {props.children.value}
                </span>
            )}
        </div>
    )
}

export default Header

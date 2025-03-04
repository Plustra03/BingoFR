import { type FunctionComponent } from 'react'
import { type GameNumber } from '../Game'

type HeaderProps = {
    children: GameNumber | undefined
}

const Header: FunctionComponent<HeaderProps> = (props) => {
    return (
        <div className="h-full grid place-items-center rounded-2xl border-4 border-dotted border-gray-300">
            {props.children && (
                <span className="text-7xl font-bold font-sans">
                    {props.children.letter} {props.children.value}
                </span>
            )}
        </div>
    )
}

export default Header

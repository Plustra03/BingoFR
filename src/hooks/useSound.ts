import { useEffect, useRef } from 'react'

export const useSound = (src: string, volume: number) => {
    const soundRef = useRef<HTMLAudioElement>(new Audio(src))

    useEffect(() => {
        soundRef.current.load()
        soundRef.current.volume = volume
    }, [])

    const play = (): void => {
        soundRef.current.currentTime = 0
        soundRef.current.play()
    }

    return play
}

import { useEffect, useRef } from 'react'

type IntervalCallback = () => void
type IntervalProps = [number, boolean]

export const useInterval = (callback: IntervalCallback, props: IntervalProps) => {
    const savedCallback = useRef<IntervalCallback | undefined>(undefined)
    const intervalId = useRef<number | undefined>(undefined)

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval.
    useEffect(() => {
        const tick = (): void => {
            if (savedCallback.current !== undefined) {
                savedCallback.current()
            }
        }

        if (props[1] && intervalId.current === undefined) {
            intervalId.current = setInterval(tick, props[0])
        }

        return () => {
            if (intervalId.current !== undefined) {
                clearInterval(intervalId.current)
                intervalId.current = undefined
            }
        }
    }, [props[1]])

    // Update interval time if it changes
    useEffect(() => {
        if (intervalId.current !== undefined) {
            clearInterval(intervalId.current)
            intervalId.current = setInterval(() => {
                if (savedCallback.current !== undefined) {
                    savedCallback.current()
                }
            }, props[0])
        }
    }, [props[0]])
}

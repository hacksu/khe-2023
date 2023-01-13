import { createContext, useContext, useMemo } from 'react';
import zustand from 'zustand';


type Counter = {
    count: number;
    increment(): void;
}

const createCounter = () => zustand<Counter>(set => ({
    count: 0,
    increment() {
        set(state => ({ count: state.count + 1 }))
    }
}))

export const CounterContext = createContext(createCounter());


function OuterComponent() {
    const counter = useMemo(createCounter, []);
    const count = counter(o => o.count);

    return <CounterContext.Provider value={counter}>
        <div>
            <div>
                count: {count}
            </div>
            <InnerComponent />
        </div>
    </CounterContext.Provider>
}


function InnerComponent() {
    const counter = useContext(CounterContext);
    const increment = counter(o => o.increment);

    return <div>
        <button onClick={increment}>+1</button>
    </div>
}


export default function TestPage() {
    return <>
        <OuterComponent />
        <OuterComponent />
    </>
}
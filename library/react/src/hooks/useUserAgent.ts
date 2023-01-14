import { createContext, useContext, useMemo } from 'react';
import { UAParser, IResult } from 'ua-parser-js';

const UserAgentContext = createContext<{ current: IResult | null }>({ current: null })

export function useUserAgent(header?: string) {
    const ctx = useContext(UserAgentContext);
    return useMemo(() => {
        if (header) {
            ctx.current = new UAParser(header).getResult();
        }
        return ctx.current;
    }, [header]);
}
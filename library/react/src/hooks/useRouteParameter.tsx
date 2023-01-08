import zustand, { StoreApi, UseBoundStore } from 'zustand';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef } from 'react';


type RouteParameter<T> = {
    name: string,
    value?: T,
}

type RouteParameterStore = {
    params: Map<string, RouteParameter<any>>,
    add: (param: UseBoundStore<StoreApi<RouteParameter<any>>>) => void,
}

const store = zustand<RouteParameterStore>(set => ({
    params: new Map(),
    add(param) {
        set(prev => ({
            params: new Map(prev.params).set(param.getState().name, param),
        }))
    },
}))


export function createRouteParameter<T, N extends string>(config: {
    name: N,
    type: (...args: any[]) => T,
}) {
    type P = RouteParameter<T> & { name: N };
    type Internals = {
        render?: () => JSX.Element,
    }

    if (store.getState().params.has(config.name)) {
        return store.getState().params.get(config.name) as unknown as UseBoundStore<StoreApi<P>>;
    }

    const param = zustand<P & Internals>(set => ({
        name: config.name,
    }))

    function Render() {
        const router = useRouter();
        const value = param(o => o.value);
        const qvalue = useMemo(() => {
            let v = router?.query?.[config.name] as T | undefined;
            if (v !== undefined && 'type' in config) {
                v = config.type(v as any) as T;
            }
            return v;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [router.query?.[config.name]]);
        const prev = useRef({ value, qvalue });
        const first = useRef(true);
        useEffect(() => {
            if (qvalue !== value) {
                const p = prev.current;
                if (first.current || qvalue !== p.qvalue) {
                    first.current = false;
                    // console.log(`qvalue.${config.name}`, 'changed', [p.qvalue, qvalue]);
                    param.setState({ value: qvalue })
                }
                if (value !== p.value) {
                    // console.log(`value.${config.name}`, 'changed', [p.value, value]);
                    const query = { ...router.query, [config.name]: value };
                    if (value === null || value === undefined) {
                        delete query[config.name];
                    }
                    router.push({ query } as any);
                }
            }
            prev.current = { value, qvalue };
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [qvalue, value])
        return <></>;
    }

    param.setState({ render: Render })
    store.getState().add(param as any);

    return param;
}


export function RouteParameters() {
    const params = store(o => o.params);
    const renders = useMemo(() => {
        return Array.from(params.values()).map(o => (o as any).getState()).filter(o => (o as any).render).map(o => {
            // eslint-disable-next-line react/display-name
            return [o.name, () => {
                const Render = (o as any).render;
                return <span hidden data-route-param={o.name}>
                    {Render && <Render />}
                </span>
            }];
        }) as [string, () => JSX.Element][];
    }, [params]);
    return <span hidden>
        {renders.map(([name, Render]) => <Render key={name} />)}
    </span>
}




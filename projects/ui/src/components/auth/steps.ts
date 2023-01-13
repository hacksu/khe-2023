import { NextRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FieldPath } from 'react-hook-form';


type StepPaths<T extends object> = FieldPath<T> | null;

export function useSteps<C extends {
    steps: object,
    router?: NextRouter
}>(config: C) {
    const [step, _setStep] = useState<StepPaths<C['steps']>>(null);
    const depth = step === null ? 0 : step.split('.').length;

    const history = useMemo(() => {
        const arr = new Array<StepPaths<C['steps']>>();
        return arr;
    }, []);

    const _step = step;
    const [previous, setPrevious] = useState<typeof step>(step);
    const setStep = (step: StepPaths<C['steps']>) => {
        setPrevious(_step);
        history.push(step);
        _setStep(step);
    }

    const back = () => {
        const current = step;
        if (current) {
            const computed = current.split('.').slice(0, -1).join('.');
            if (computed && computed.length > 0) {
                return setStep(computed as any);
            } else {
                return setStep(null);
            }
        }
    }

    const first = useRef(true);
    useEffect(() => {
        if (config.router && config.router.isReady) {
            const rstep: any = config.router.query?.s === undefined ? null : config.router.query?.s;
            if (first.current) {
                setTimeout(() => {
                    first.current = false;
                }, 100)
                setStep(rstep);
                if (rstep) {
                    setPrevious(rstep.split('.').slice(0, -1).join('.') || null);
                }
            } else {
                if (rstep != step) {
                    // console.log('diff step', { step, rstep });
                    setStep(rstep);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config?.router?.query]);

    useEffect(() => {
        if (config.router && config.router.isReady && !first.current) {
            const query = config.router.query;
            const before = JSON.stringify(query);
            if (step === null) {
                delete query?.s;
            } else {
                query.s = step;
            }
            if (JSON.stringify(query) !== before) {
                config.router.push({
                    query,
                })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);

    return {
        step,
        setStep,
        back,
        depth,
        previous,
    }
}


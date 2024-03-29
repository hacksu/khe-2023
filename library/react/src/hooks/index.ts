import { useMediaQuery } from './useMediaQuery';
import { useUserAgent } from './useUserAgent';
import { useProps } from './useProps';
import { useForm } from './useForm';

/** @export 'hooks' */

export {
    useForm,
    useProps,
    useUserAgent,
    useMediaQuery,
}

export * from './useRouteParameter';

export type { UseProps } from './useProps';

export function mappedActions<Actions extends Record<string, (...args: any[]) => any>>(actions: Actions) {
    return function <
        Key extends keyof Actions,
        Action extends ((...args: any[]) => any) = Actions[Key]
    >(action: Key, ...args: Parameters<Action>): ReturnType<Action> {
        return actions[action](...args);
    }
}
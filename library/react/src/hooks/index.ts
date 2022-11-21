import { useMediaQuery } from './useMediaQuery';
import { useForm } from './useForm';

/** @export 'hooks' */

export {
    useForm,
    useMediaQuery
}


export function mappedActions<Actions extends Record<string, (...args: any[]) => any>>(actions: Actions) {
    return function <
        Key extends keyof Actions,
        Action extends ((...args: any[]) => any) = Actions[Key]
    >(action: Key, ...args: Parameters<Action>): ReturnType<Action> {
        return actions[action](...args);
    }
}
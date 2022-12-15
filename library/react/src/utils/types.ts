
/** @export 'utils/types' */

export type withClasses<Names extends string> = {
    classes?: {
        [P in Names]?: string
    }
};

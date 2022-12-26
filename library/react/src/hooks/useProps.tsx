import { HTMLProps } from 'react';
import { Box, BoxProps, extractSystemStyles } from '@mantine/core';
import {
    MantineStyleSystemProps,
    MantineTheme,
    Sx,
    useCss,
    useMantineTheme,
} from '@mantine/styles';
import { getSystemStyles } from '@mantine/core';

function extractSx(sx: Sx, theme: MantineTheme) {
    return typeof sx === 'function' ? sx(theme) : sx;
}

function useSx(sx: Sx | Sx[], systemProps: MantineStyleSystemProps, className: string) {
    const theme = useMantineTheme();
    const { css, cx } = useCss();

    if (Array.isArray(sx)) {
        return cx(
            className,
            css(getSystemStyles(systemProps, theme)),
            sx.map((partial) => css(extractSx(partial, theme)))
        );
    }

    return cx(className, css(extractSx(sx, theme)), css(getSystemStyles(systemProps, theme)));
}

type IntegratedProps = Omit<BoxProps, 'className' | 'classNames'> & {

}



export type UseProps = Partial<IntegratedProps>;

export function useProps<
    T extends object = HTMLProps<HTMLElement>,
    P extends object = Partial<IntegratedProps> & Partial<Omit<T, keyof IntegratedProps>>,
>(
    input: T & Partial<Omit<IntegratedProps, keyof T>>,
    props?: P
): T & Partial<Omit<P, keyof T>> {
    const _input = input as any;
    const _props = props as any;

    let className = _input?.className;
    let style = _input?.style;
    let rest = _input;

    if (props) {
        // Compute mantine styles
        const { systemStyles, rest: _rest } = extractSystemStyles(Object.assign({
            ..._props,
            ..._input,
            className: undefined,
            style: undefined,
            sx: undefined,
        }));

        // Merge classes
        // eslint-disable-next-line react-hooks/rules-of-hooks
        className = useSx([_input?.sx || {}, _props?.sx || {}].filter(o => o), systemStyles, [
            _props?.className,
            _input.className,
        ].filter(o => o)
            .map(o => typeof o != 'string' && Array.isArray(o)
                ? o.join(' ')
                : o
            ).join(' ')
        );

        // Merge styles
        style = Object.assign(_input?.style || {}, _props?.style || {});

        rest = _rest;
    }

    // Ensure className property is a string
    if (className && typeof className != 'string' && Array.isArray(className)) {
        className = className.join(' ');
    }

    return {
        ...rest,
        className,
        style,
    }
}


// function wat(props: UseProps) {
//     const stuff = useProps(props, {
//         classNames: {
//             hello: true,
//         }
//     })
// }

// type ConditionalProps<
//     T = Partial<HTMLProps<HTMLElement>>,
//     I extends Partial<T> = any,
//     P extends Partial<I & IntegratedProps> = Partial<IntegratedProps>
// > = {
//         input: T & I,
//         props: P,
//         return: T & I,
//     }

type ConditionalProps<
    T extends object = never,
    I extends object = never,
    P extends object = never,
> = {
    types: {
        t: T,
        i: I & (T extends object ? Partial<T> : {}),
        // p: P & Partial<I> & (T extends object ? Partial<T> : {}),
        p: Partial<I> & (T extends object ? Partial<T> : {}) & P,
        // r: (I & (T extends object ? Partial<T> : {})) & (P & Partial<I> & (T extends object ? Partial<T> : {})) & T & I,
        r: I & P,
        // o: ConditionalProps<{}, I, P>['types']['p']
        // o: keyof (I & P) extends never ? 'oof' : keyof (T & I & P)

        // r: I & P,
    },
    input: I,
}



type a = ConditionalProps<never, { hi: string }, { disabled: true }>


// @ts-ignore
function testy<T = {}, I = {}, P = {}>(input: I & ConditionalProps<T, I, P>['types']['i'] & { [key: string]: any }, props?: P & ConditionalProps<T, I, P>['types']['p'] & { [key: string]: any }): ConditionalProps<T, I, P>['types']['r'] {
    return {} as any;
}

// @ts-ignore
function testy2<T extends object, I extends Partial<T> & { [key: string]: any } = any, P extends ConditionalProps<T, I, any>['types']['p'] = any>(input: I, props?: P): ConditionalProps<T, I, P> {
    return {} as any;
}

// @ts-ignore
function testy3<T = HTMLProps<HTMLElement> & UseProps, I = {}, P = {}>(input: I & ConditionalProps<T, I, P>['types']['i'] & { [key: string]: any }, props?: P & ConditionalProps<T, I, P>['types']['p'] & { [key: string]: any }): (
    // @ts-ignore
    keyof ConditionalProps<T, I, P>['types']['r'] extends never ? (
            // @ts-ignore
            ConditionalProps<T, I, P>['types']['t'] & { [key: string]: any }
    // @ts-ignore
    ) : ConditionalProps<T, I, P>['types']['r']
) {
    return {} as any;
}

const ___a = testy3({ hi: 'there' })
const ___b = testy3({ hi: 'there' }, { woah: 5 })
const ___c = testy3<BoxProps>({ hi: 'there' }, { woah: 5 })




function bruh<
    T extends { [key: string]: any } & Partial<IntegratedProps>,
    I extends T & { [key: string]: any } & Partial<IntegratedProps> = T,
    P extends Partial<I> = Partial<I>,
>(
    input: I,
    props?: P
): T & P {
    // @ts-ignore
    return { ...input, ...(props || {}) }
}


// bruh({ hi: 5 }, {
//     disabled: true,
// })

// bruh<{ woah: string }>({ hi: 5 }, {
//     // disabled: true,
//     woah: 'yeee'
// })

// type a = ConditionalProps['props']
// type b = ConditionalProps<BoxProps>['input']

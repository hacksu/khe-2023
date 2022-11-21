import { FieldPath, FieldValues, RegisterOptions, UseFormProps, UseFormReturn, useForm as _useForm } from 'react-hook-form';
import { InputSharedProps, InputWrapperBaseProps } from '@mantine/core';
import { useCallback, useRef } from 'react';
import get from 'lodash/get';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

/** @export 'hooks/useForm' */

type InputProps = InputSharedProps & InputWrapperBaseProps & Omit<React.ComponentPropsWithoutRef<'input'>, 'size'>;

type WithFormConfig = {
    /** Props passed to any registered fields */
    inputProps?: InputProps;

}

type WithRegisterOptions<TFieldValues extends FieldValues = any> = {
    label?: string
    placeholder?: string
    disabled?: string
    readonly?: boolean
}

export function useWithForm<
    TFieldValues extends FieldValues,
    TContext extends any,
    Config extends WithFormConfig
>(form: UseFormReturn<TFieldValues, TContext>, config?: Config) {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const $form = useRef(form);
    $form.current = form;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const register = useCallback(function <
        TFieldName extends FieldPath<TFieldValues>
    >(name: TFieldName, options?: RegisterOptions<TFieldValues, TFieldName> & WithRegisterOptions<TFieldValues>) {
        const result = $form.current.register(name, options);
        const props: InputProps = {
            error: get($form.current.formState.errors, name)?.message as any,
            ...config?.inputProps,
        };

        if (options?.label) props.label = options.label;
        if (options?.placeholder) props.placeholder = options.placeholder;
        if (options?.readonly) props.readOnly = options.readonly;

        return Object.assign(result, props as Record<string, any>);
    }, [config]);

    return {
        form,
        register,
    }
}

export function useForm<
    TFieldValues extends z.infer<TSchema>,
    TContext extends any,
    TSchema extends z.AnyZodObject
>(props: UseFormProps<TFieldValues, TContext> & WithFormConfig & {
    schema?: TSchema,
}) {
    if (props.schema) {
        props.resolver = zodResolver(props.schema);
    }
    
    const form = _useForm(props) as UseFormReturn<TFieldValues, TContext>;

    return useWithForm<TFieldValues, TContext, any>(form, props);
}

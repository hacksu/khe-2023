import { useForm as rhfUseForm, FieldValues, UseFormProps, Path } from 'react-hook-form';

export const useForm = <TFieldValues extends FieldValues, TContext=any> (
    props?: UseFormProps<TFieldValues, TContext>
) => {
    const base = rhfUseForm<TFieldValues, TContext>(props);
    return {
        ...base,
        getInputProps: (fieldName: Path<TFieldValues>) => ({
            ...base.register(fieldName),
            error: base.formState.errors[fieldName]?.message}
        )
    }
};

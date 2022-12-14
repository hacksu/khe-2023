import { ticketData } from '@kenthackenough/server/data/tickets';
import { Box, Button, Divider, Flex, Text, Textarea, TextInput } from '@mantine/core';
import { api } from '../../utils/trpc';
import { IconCheck, IconX } from '@tabler/icons'
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from '@kenthackenough/react/hooks';
import { z } from 'zod';
import { useTheme } from '../../utils/mantine';


type withClasses<Names extends string> = {
    classes?: {
        [P in Names]?: string
    }
};

/** @export 'tickets/contact' */

const formSchema = ticketData.pick({
    name: true,
    email: true,
    subject: true,
    message: true,
});


export type ContactUsProps =
    & withClasses<'container' | 'input' | 'submit'>;



export function ContactUs(props: ContactUsProps) {
    // useTheme();
    const { classes } = props;
    const { form, register } = useForm({
        schema: formSchema,
        reValidateMode: "onChange",
        delayError: 2000,
        inputProps: {
            className: classes?.input,
        },
        // defaultValues: {
        //     email: 'a@a.com',
        //     name: '[name]',
        //     subject: '[subject]',
        //     message: '[message goes here]',
        // }
    });

    const [state, setState] = useState<'loading' | 'success' | 'error' | null>(null);
    const mutation = api.tickets.create.useMutation({
        onError() {
            setState('error');
        },
        onSuccess() {
            /** Artificial delay to make loading seem better */
            setTimeout(() => {
                setState('success')
            }, 500);
        },
        onMutate() {
            setState('loading');
        }
    });

    const createTicket = mutation.mutate;
    const isLoading = state === 'loading';
    const isSuccess = state === 'success';
    const isDisabled = state === 'loading' || state === 'success';
    const isError = state === 'error';

    const onSubmit = data => {
        console.log('submit', data);
        if (!isDisabled) {
            createTicket(data);
        }
    }

    return <form onSubmit={form.handleSubmit(onSubmit)} className={classes?.container}>
        
        <TextInput {...register('email', {
            label: 'Email',
            placeholder: 'Where should we contact you?',
            readonly: isDisabled,
        })} />

        <TextInput {...register('name', {
            label: 'Name',
            placeholder: 'What is your name?',
            readonly: isDisabled,
        })} />

        <TextInput {...register('subject', {
            label: 'Subject',
            placeholder: 'What do you need to talk to us about?',
            readonly: isDisabled,
        })} />

        <Textarea autosize minRows={4} {...register('message', {
            label: 'Message',
            placeholder: 'Give us all the details!',
            readonly: isDisabled,
        })} />

        <Flex mt='sm' direction='column' align='center' gap='xs'>

            <Button type='submit' className={classes?.submit}
                loading={isLoading} disabled={isDisabled}
                leftIcon={isSuccess ? <IconCheck /> : null}>
                {isSuccess ? 'Message Sent' : 'Submit'}
            </Button>

            {isError && <Text c="red">
                {mutation.error?.message || `An error occured!`}
            </Text>}

        </Flex>

    </form>
}


/**
 * 
 * ticket+1284388@staff.khe.io
 * 
 */


function FormComponent(props) {
    const { classes } = props;
    const { form, register } = useForm({
        schema: formSchema,
        reValidateMode: "onChange",
        delayError: 2000,
        inputProps: {
            className: classes?.input,
        },
    });

    const onSubmit = data => { /* ... */ }
    const isDisabled = false;

    return <form onSubmit={form.handleSubmit(onSubmit)} className={classes?.container}>
        <TextInput {...register('email', {
            label: 'Email',
            placeholder: 'Where should we contact you?',
            readonly: isDisabled,
        })} />

        <TextInput {...register('name', {
            label: 'Name',
            placeholder: 'What is your name?',
            readonly: isDisabled,
        })} />

    </form>
}
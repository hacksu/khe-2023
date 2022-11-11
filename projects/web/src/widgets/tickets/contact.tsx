import { ticketData } from '@kenthackenough/server/data/tickets';
import { useForm, zodResolver } from '@mantine/form';
import { Box, Button, Text, Textarea, TextInput } from '@mantine/core';
import { api } from '../../utils/trpc';
import { IconCheck, IconX } from '@tabler/icons'
import { useState } from 'react';
import { z } from 'zod';

type withClasses<Names extends string> = {
    classes?: {
        [P in Names]?: string
    }
};

/** @export 'tickets/contact' */

const formSchema = ticketData.strip().pick({
    name: true,
    email: true,
    subject: true,
    message: true,
});


export type ContactUsProps =
    & withClasses<'container' | 'input' | 'submit'>;

export function ContactUs(props: ContactUsProps) {
    const { classes } = props;
    const form = useForm({
        validate: zodResolver(formSchema),
        validateInputOnBlur: true,
        initialValues: {
            'email': 'a@a.com',
            name: '[name]',
            subject: '[subject]',
            message: '[message goes here]',
        }
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

    console.log(mutation);

    return <form onSubmit={form.onSubmit(onSubmit)} className={classes?.container}>
        <TextInput label='Email' placeholder='Email'
            className={classes?.input} readOnly={isDisabled} {...form.getInputProps('email')} />

        <TextInput label='Name' placeholder='Name'
            className={classes?.input} readOnly={isDisabled} {...form.getInputProps('name')} />

        <TextInput label='Subject' placeholder='Subject'
            className={classes?.input} readOnly={isDisabled} {...form.getInputProps('subject')} />

        <Textarea label='Message' placeholder='Message' autosize minRows={4}
            className={classes?.input} readOnly={isDisabled} {...form.getInputProps('message')} />

        <Box mt="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '1em' }}>
            <Button type='submit' className={classes?.submit}
                loading={isLoading} disabled={isDisabled}
                leftIcon={isSuccess ? <IconCheck /> : null}>
                Submit
            </Button>

            {isSuccess ? (
                <Text c="green">
                    Message sent!
                </Text>
            ) : ((isError) ? (
                <Text c="red">
                    {mutation.error?.message || `An error occured!`}
                </Text>
            ) : null)}
        </Box>

        
        
    </form>
}


/**
 * 
 * ticket+1284388@staff.khe.io
 * 
 */
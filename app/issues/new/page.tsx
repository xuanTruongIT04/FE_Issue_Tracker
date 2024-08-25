'use client';

import { Button, Callout, Text, TextField } from '@radix-ui/themes';
import React, { useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { validationSchema } from '@/app/validationSchema';
import { z } from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage';

type IssueForm = z.infer<typeof validationSchema>;

// interface IssueForm {
//     title: string;
//     description: string;
// }

const NewIssuePage = () => {
    const router = useRouter();
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isDirty, isValid },
    } = useForm<IssueForm>({
        resolver: zodResolver(validationSchema),
    });
    const [error, setError] = useState('');

    return (
        <div className="max-w-xl ">
            {error && (
                <Callout.Root color="red" className="max-w-xl ">
                    <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
            )}
            <form
                className="space-y-3"
                onSubmit={handleSubmit(async (data) => {
                    try {
                        await axios.post('/api/issues', data);
                        router.push('/issues/');
                    } catch (error) {
                        setError('An unexpected error occurred.');
                    }
                })}
            >
                <TextField.Root placeholder="Title" {...register('title')} />
                <ErrorMessage>{errors.title?.message}</ErrorMessage>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <SimpleMDE placeholder="Description" {...field} />
                    )}
                />
                <ErrorMessage>{errors.description?.message}</ErrorMessage>

                <Button>Submit New Issue</Button>
            </form>
        </div>
    );
};

export default NewIssuePage;

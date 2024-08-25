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
import { z}  from 'zod';

type IssueForm = z.infer<typeof validationSchema>

// interface IssueForm {
//     title: string;
//     description: string;
// }

const NewIssuePage = () => {
    const router = useRouter();
    const { register, control, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<IssueForm>({
        resolver: zodResolver(validationSchema)
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
                {errors.title && <Text color="red" as="p">{errors.title.message}</Text>}
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <SimpleMDE placeholder="Description" {...field} />
                    )}
                />
                {errors.description && <Text color="red" as="p">{errors.description.message}</Text>}

                <Button>Submit New Issue</Button>
            </form>
        </div>
    );
};

export default NewIssuePage;

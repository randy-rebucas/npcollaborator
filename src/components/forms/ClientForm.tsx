'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { IUser } from '@/models/User';
import { toast } from 'sonner';

const profileSchema = z.object({
    username: z.string()
        .min(2, 'Username must be at least 2 characters')
        .max(50, 'Username is too long')
        .refine(async (username) => {
            const response = await fetch(`/api/user/validate?username=${encodeURIComponent(username)}`);
            return response.ok;
        }, "This username is already taken"),
    email: z.string()
        .email('Invalid email address')
        .refine(async (email) => {
            const response = await fetch(`/api/user/validate?email=${encodeURIComponent(email)}`);
            return response.ok;
        }, "This email is already registered"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ClientForm({ user }: { user: IUser }) {
    console.log(user);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: user.username,
            email: user.primaryEmail
        }
    });


    const onSubmit = async (data: ProfileFormData) => {
        try {

            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    // Handle validation conflicts
                    const fieldErrors = responseData.errors;
                    Object.keys(fieldErrors).forEach((field) => {
                        setError(field as keyof ProfileFormData, {
                            message: fieldErrors[field]
                        });
                    });
                    return;
                }
                toast.error(responseData.message || 'Failed to update user');
            }

            toast.success('User updated successfully!');

        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : 'Failed to update user');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Display Name */}
            <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Display Name
                </label>
                <input
                    {...register('username')}
                    type="text"
                    id="username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
                {errors.username && (
                    <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
            </div>

            {/* Save Changes */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
        </form>
    )
}
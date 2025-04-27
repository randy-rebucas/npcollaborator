'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { IUser } from '@/models/User';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
    practiceType: z.array(z.string()).min(1, 'Select at least one practice type'),
    primaryStateOfPractice: z.string().min(1, 'Primary state of practice is required'),
    professionalDesignation: z.string().min(1, 'Professional designation is required'),
    startDate: z.enum(['less than 1 week', '1-2 weeks', '3-4 weeks', '1-2 months', '2+ months'], {
        required_error: 'Please select a start date',
    }),
    npi: z.string().regex(/^\d{10}$/, 'NPI must be a 10-digit number'),
    controlledSubstances: z.enum(['yes', 'no'], {
        required_error: 'Please select yes or no',
    }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

const calculateStartDate = (period: string): Date => {
    const now = new Date();
    switch (period) {
        case 'less than 1 week':
            return new Date(now.setDate(now.getDate() - 3)); // Assuming middle of the week
        case '1-2 weeks':
            return new Date(now.setDate(now.getDate() - 10)); // Assuming middle of the range
        case '3-4 weeks':
            return new Date(now.setDate(now.getDate() - 24)); // Assuming middle of the range
        case '1-2 months':
            return new Date(now.setMonth(now.getMonth() - 1, 15)); // Assuming middle of the range
        case '2+ months':
            return new Date(now.setMonth(now.getMonth() - 2)); // Minimum of 2 months
        default:
            return new Date();
    }
};

export default function ProfileForm({ user }: { user: IUser }) {
    console.log(user);
    const [practiceTypes, setPracticeTypes] = useState<string[]>([]);
    const [states, setStates] = useState<string[]>([]);
    const designations = [
        'Nurse Practitioner',
        'Physician Associate',
        'Clinical Nurse Specialist',
        'Certified Registered Nurse Anesthetist',
        'Certified Nurse Midwife',
        'Psychiatric Mental Health Nurse Practitioner',
        'Other'
    ];
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            description: user.customData?.backgroundCertification?.description, 
            firstName: user.profile?.givenName,
            lastName: user.profile?.familyName,
            practiceType: user.customData?.practiceTypes || [],
            primaryStateOfPractice: user.customData?.licenseAndCertification?.medicalLicenseStates?.[0]?.state || '',
            professionalDesignation: user.customData?.backgroundCertification?.boardCertification || '',
            // startDate: user.customData?.startDate || '',
            npi: user.customData?.npiNumber || '',
            controlledSubstances: (user.customData?.controlledSubstances as 'yes' | 'no') || undefined
        }
    });
    //[less than 1 week, 1-2 weeks, 3-4 weeks, 1-2 months, 2+ months]
    useEffect(() => {
        const fetchPracticeTypes = async () => {
            const response = await fetch('/api/practicetypes');
            const data = await response.json();
            setPracticeTypes(data);
        };
        fetchPracticeTypes();
    }, []);

    useEffect(() => {
        const fetchStates = async () => {
            const response = await fetch('/api/admin/miscellaneous/license-states');
            const data = await response.json();
            setStates(data.map((state: { state: string }) => state.state));
        };
        fetchStates();
    }, []);

    const onSubmit = async (data: ProfileFormData) => {
        try {
            const formDataWithDate = {
                ...data,
                startDate: calculateStartDate(data.startDate).toISOString(),
            };

            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataWithDate),
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
                toast.error(responseData.message || 'Failed to update profile');
            }

            toast.success('Profile updated successfully!');

        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : 'Failed to update profile');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* First Name */}
            <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                </label>
                <input
                    {...register('firstName')}
                    id="firstName"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
                {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                </label>
                <input
                    {...register('lastName')}
                    id="lastName"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
                {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    {...register('description')}
                    id="description"
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-y"
                />
                {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
            </div>

            {/* Practice Type */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Practice Type
                </label>
                <div className="space-y-2">
                    {practiceTypes.map((type) => (
                        <div key={type} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`practiceType-${type}`}
                                value={type}
                                {...register('practiceType')}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor={`practiceType-${type}`}
                                className="ml-2 block text-sm text-gray-700"
                            >
                                {type}
                            </label>
                        </div>
                    ))}
                </div>
                {errors.practiceType && (
                    <p className="text-red-500 text-sm mt-1">{errors.practiceType.message}</p>
                )}
            </div>

            {/* Primary State of Practice */}
            <div className="space-y-2">
                <label htmlFor="primaryStateOfPractice" className="block text-sm font-medium text-gray-700">
                    Primary State of Practice
                </label>
                <select
                    {...register('primaryStateOfPractice')}
                    id="primaryStateOfPractice"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                    <option value="">Select a state...</option>
                    {states.map((state) => (
                        <option key={state} value={state}>
                            {state}
                        </option>
                    ))}
                </select>
                {errors.primaryStateOfPractice && (
                    <p className="text-red-500 text-sm mt-1">{errors.primaryStateOfPractice.message}</p>
                )}
            </div>

            {/* Professional Designation */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Professional Designation
                </label>
                <div className="space-y-2">
                    {designations.map((designation) => (
                        <div key={designation} className="flex items-center">
                            <input
                                type="radio"
                                id={`professionalDesignation-${designation}`}
                                value={designation}
                                {...register('professionalDesignation')}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label
                                htmlFor={`professionalDesignation-${designation}`}
                                className="ml-2 block text-sm text-gray-700"
                            >
                                {designation}
                            </label>
                        </div>
                    ))}
                </div>
                {errors.professionalDesignation && (
                    <p className="text-red-500 text-sm mt-1">{errors.professionalDesignation.message}</p>
                )}
            </div>

            {/* Start Date */}
            <div className="space-y-2">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                </label>
                <select
                    {...register('startDate')}
                    id="startDate"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                    <option value="">Select a start date...</option>
                    <option value="less than 1 week">Less than 1 week</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="3-4 weeks">3-4 weeks</option>
                    <option value="1-2 months">1-2 months</option>
                    <option value="2+ months">2+ months</option>
                </select>
                {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                )}
            </div>

            {/* NPI */}
            <div className="space-y-2">
                <label htmlFor="npi" className="block text-sm font-medium text-gray-700">
                    National Provider ID (NPI)
                </label>
                <input
                    {...register('npi')}
                    id="npi"
                    type="text"
                    placeholder="10-digit number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
                {errors.npi && (
                    <p className="text-red-500 text-sm mt-1">{errors.npi.message}</p>
                )}
            </div>

            {/* Controlled Substances */}
            <div className="space-y-2">
                <label htmlFor="controlledSubstances" className="block text-sm font-medium text-gray-700">
                    Controlled Substances
                </label>
                <select
                    {...register('controlledSubstances')}
                    id="controlledSubstances"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                    <option value="">Select an option...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
                {errors.controlledSubstances && (
                    <p className="text-red-500 text-sm mt-1">{errors.controlledSubstances.message}</p>
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
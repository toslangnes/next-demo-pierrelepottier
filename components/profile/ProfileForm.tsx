'use client';

import {useState, useTransition} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {toast} from 'sonner';
import {updateProfile} from '@/lib/actions/user.actions';
import {updateProfileSchema} from '@/lib/types/user.types';
import {z} from 'zod';
import {User} from '@/lib/types/user.types';
import {AlertCircle, User as UserIcon, Mail, KeyRound} from 'lucide-react';

type ProfileFormProps = {
    user: User;
};

export function ProfileForm({user}: ProfileFormProps) {
    const [isPending, startTransition] = useTransition();
    const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: user.name || '',
            email: user.email,
        },
    });

    async function onSubmit(data: z.infer<typeof updateProfileSchema>) {
        startTransition(async () => {
            try {
                const form = new FormData();

                if (data.name) form.append('name', data.name);
                if (data.email) form.append('email', data.email);
                if (data.currentPassword) form.append('currentPassword', data.currentPassword);
                if (data.newPassword) form.append('newPassword', data.newPassword);
                if (data.confirmPassword) form.append('confirmPassword', data.confirmPassword);

                const result = await updateProfile(null, form);

                if (result.success) {
                    const updatedFields = [];
                    if (data.name) updatedFields.push('nom');
                    if (data.email) updatedFields.push('email');
                    if (data.currentPassword) updatedFields.push('mot de passe');

                    const fieldMessage = updatedFields.length > 0
                        ? `Votre ${updatedFields.join(' et ')} ${updatedFields.length > 1 ? 'ont été mis à jour' : 'a été mis à jour'}`
                        : 'Profil mis à jour avec succès';

                    let icon;
                    if (data.currentPassword) {
                        icon = <KeyRound className="h-5 w-5 text-green-500"/>;
                    } else if (data.email) {
                        icon = <Mail className="h-5 w-5 text-green-500"/>;
                    } else {
                        icon = <UserIcon className="h-5 w-5 text-green-500"/>;
                    }

                    toast.success(fieldMessage, {
                        icon,
                        description: "Vos modifications ont été enregistrées avec succès.",
                        duration: 4000,
                        className: "border-l-4 border-green-500"
                    });

                    if (data.currentPassword) {
                        reset({
                            name: data.name,
                            email: data.email,
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                        });
                    }
                } else {
                    toast.error(result.message, {
                        icon: <AlertCircle className="h-5 w-5 text-red-500"/>,
                        description: "Veuillez vérifier vos informations et réessayer.",
                        duration: 5000,
                        className: "border-l-4 border-red-500"
                    });
                }
            } catch (err) {
                toast.error((err as Error).message, {
                    icon: <AlertCircle className="h-5 w-5 text-red-500"/>,
                    description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
                    duration: 5000,
                    className: "border-l-4 border-red-500"
                });
            }
        });
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Profile Settings</CardTitle>
                <CardDescription>
                    Update your personal information and password
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex border-b mb-4">
                    <button
                        className={`px-4 py-2 font-medium ${
                            activeTab === 'info' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'
                        }`}
                        onClick={() => setActiveTab('info')}
                    >
                        Personal Information
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${
                            activeTab === 'password' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'
                        }`}
                        onClick={() => setActiveTab('password')}
                    >
                        Change Password
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {activeTab === 'info' && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    {...register('name')}
                                    placeholder="Your name"
                                    disabled={isPending}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    placeholder="Your email"
                                    disabled={isPending}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === 'password' && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    {...register('currentPassword')}
                                    placeholder="Your current password"
                                    disabled={isPending}
                                />
                                {errors.currentPassword && (
                                    <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    {...register('newPassword')}
                                    placeholder="Your new password"
                                    disabled={isPending}
                                />
                                {errors.newPassword && (
                                    <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    {...register('confirmPassword')}
                                    placeholder="Confirm your new password"
                                    disabled={isPending}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        </>
                    )}

                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
                <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(user.updatedAt).toLocaleDateString()}
                </p>
            </CardFooter>
        </Card>
    );
}

// app/register/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { theme, setTheme } = useTheme();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            toast('Registration Successful', {
                description:
                    'This is a demo. In a real app, you would be registered now.',
            });
        }, 1500);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Create an account
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your details to create your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="terms" required />
                            <Label
                                htmlFor="terms"
                                className="text-sm"
                            >
                                I agree to the{' '}
                                <Link
                                    href="/terms"
                                    className="text-primary hover:underline"
                                >
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link
                                    href="/privacy"
                                    className="text-primary hover:underline"
                                >
                                    Privacy Policy
                                </Link>
                            </Label>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                    <span>Creating account...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    <span>Register</span>
                                </div>
                            )}
                        </Button>
                        <div className="text-center text-sm">
                            Already have an account?{' '}
                            <Link
                                href="/auth/login"
                                className="text-primary hover:underline"
                            >
                                Login
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

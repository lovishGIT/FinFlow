'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';

const VerifyTokenPage = () => {
    const router = useRouter();
    const params = useParams();
    const token = Array.isArray(params.token)
        ? params.token.join('/')
        : params.token || '';
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const verifyToken = async () => {
            if (!token) {
                setError(true);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `/api/auth/verify/${token}`
                );

                if (!response.ok) {
                    throw new Error('Failed to verify token');
                }

                const data = await response.json();
                if (response.status == 200) {
                    toast.success(data.message || 'Token Verified');
                    if (isMounted) router.push('/auth/login');
                } else {
                    throw new Error('Invalid Token Found');
                }
            } catch (error: any) {
                if (isMounted) {
                    toast.error(
                        error.message || 'Invalid Token Found'
                    );
                    setError(true);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        verifyToken();

        return () => {
            isMounted = false;
        };
    }, [token, router]);

    return (
        <div className="flex items-center justify-center h-screen">
            {loading ? (
                <h1 className="text-xl font-semibold">Loading...</h1>
            ) : error ? (
                <h1 className="text-xl font-semibold text-red-500">
                    Wrong URL for verification
                </h1>
            ) : null}
        </div>
    );
};

export default VerifyTokenPage;

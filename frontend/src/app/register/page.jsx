'use client'
import { registerAction } from '../../lib/actions';
import { useState, useTransition } from 'react';
import Link from 'next/link';

export default function Register() {
    const [error, setError] = useState(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData) => {
        setError(null);
        startTransition(async () => {
            const res = await registerAction(formData);
            if (res?.error) setError(res.error);
        });
    };

    return (
        <div className="flex justify-center items-center mt-10 mb-10">
            <div className="card w-full max-w-md bg-base-200 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl font-bold mb-4">Register</h2>
                    {error && <div className="alert alert-error text-sm py-2">{error}</div>}
                    
                    <form action={handleSubmit}>
                        <div className="form-control w-full">
                            <label className="label"><span className="label-text font-semibold">Nama Lengkap</span></label>
                            <input type="text" name="name" placeholder="John Doe" required className="input input-bordered w-full" />
                        </div>
                        <div className="form-control w-full mt-4">
                            <label className="label"><span className="label-text font-semibold">Email</span></label>
                            <input type="email" name="email" placeholder="email@contoh.com" required className="input input-bordered w-full" />
                        </div>
                        <div className="form-control w-full mt-4">
                            <label className="label"><span className="label-text font-semibold">Password</span></label>
                            <input type="password" name="password" placeholder="Minimal 8 karakter" minLength="8" required className="input input-bordered w-full" />
                        </div>
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
                                {isPending ? <span className="loading loading-spinner"></span> : 'Sign Up'}
                            </button>
                        </div>
                    </form>

                    <div className="divider">ATAU</div>
                    <p className="text-center text-sm">
                        Sudah punya akun? <Link href="/login" className="link link-primary font-semibold">Login di sini</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

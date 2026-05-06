'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// --- AUTH ACTIONS ---
export async function loginAction(formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
        const cookieStore = await cookies();
        cookieStore.set('token', data.token, { httpOnly: true, secure: false, path: '/' });
        cookieStore.set('user_id', data.user.id.toString(), { path: '/' });
        cookieStore.set('user_name', data.user.name, { path: '/' });
        redirect('/dashboard');
    }

    return { error: data.message || 'Login gagal' };
}

export async function registerAction(formData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
        const cookieStore = await cookies();
        cookieStore.set('token', data.token, { httpOnly: true, secure: false, path: '/' });
        cookieStore.set('user_id', data.user.id.toString(), { path: '/' });
        cookieStore.set('user_name', data.user.name, { path: '/' });
        redirect('/dashboard');
    }

    return { error: data.message || 'Register gagal' };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (token) {
        await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
    }

    cookieStore.delete('token');
    cookieStore.delete('user_id');
    cookieStore.delete('user_name');
    redirect('/login');
}

// --- POST ACTIONS ---
export async function deletePostAction(id) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const res = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });

    if (res.ok) {
        redirect('/dashboard');
    }
}

export async function updatePostAction(id, formData) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const title = formData.get('title');
    const content = formData.get('content');

    const res = await fetch(`${API_URL}/posts/${id}`, {
        method: 'PUT', 
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ title, content })
    });

    if (res.ok) {
        redirect('/dashboard');
    }
    
    const data = await res.json();
    return { error: data.message || 'Gagal update post' };
}

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { deletePostAction } from '../../lib/actions';
import Link from 'next/link';

export default async function Dashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const userId = cookieStore.get('user_id')?.value;

    if (!token) redirect('/login');

    let myPosts = [];
    let hasError = false;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?page=1`, { 
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
            cache: 'no-store'
        });
        
        if (!res.ok) {
            hasError = true;
        } else {
            const postsData = await res.json();
            // Filter data post sesuai userId
            myPosts = (postsData.data || []).filter(p => p.user_id.toString() === userId);
        }
    } catch (error) {
        hasError = true;
    }

    if (hasError) {
        return <div className="alert alert-error max-w-4xl mx-auto mt-10 shadow-lg">Terjadi kesalahan pada Dashboard. Gagal mengambil data.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 py-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-extrabold">Dashboard Pengelola</h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Create Post  */}
                <div className="lg:col-span-1">
                    <div className="card bg-base-100 shadow-xl border border-base-200 sticky top-10">
                        <div className="card-body">
                            <h2 className="card-title text-xl mb-4">Tulis Postingan Baru</h2>
                            <form action={async (formData) => {
                                'use server';
                                const title = formData.get('title');
                                const content = formData.get('content');
                                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
                                    method: 'POST',
                                    headers: { 
                                        'Content-Type': 'application/json', 
                                        'Accept': 'application/json',
                                        'Authorization': `Bearer ${token}` 
                                    },
                                    body: JSON.stringify({ title, content })
                                });
                                redirect('/dashboard');
                            }}>
                                <div className="form-control w-full mb-4">
                                    <label className="label"><span className="label-text font-semibold">Judul</span></label>
                                    <input type="text" name="title" placeholder="Judul menarik..." className="input input-bordered w-full" required />
                                </div>
                                <div className="form-control w-full mb-6">
                                    <label className="label"><span className="label-text font-semibold">Konten</span></label>
                                    <textarea name="content" className="textarea textarea-bordered w-full" placeholder="Ketik apa yang Anda pikirkan..." rows="6" required></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary w-full">Publikasikan</button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* List My Posts  */}
                <div className="lg:col-span-2">
                    <div className="bg-base-100 rounded-3xl shadow-xl border border-base-200 p-6">
                        <h2 className="text-2xl font-bold mb-6 border-b pb-4">Riwayat Postingan Saya</h2>
                        <div className="space-y-4">
                            {myPosts.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    <p>Anda belum memiliki postingan.</p>
                                </div>
                            ) : (
                                myPosts.map(post => (
                                    <div key={post.id} className="card bg-base-200 hover:bg-base-300 transition-colors shadow-sm">
                                        <div className="card-body flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 gap-4">
                                            <div className="flex-1 w-full">
                                                <h3 className="font-bold text-lg leading-tight mb-1">{post.title}</h3>
                                                <p className="text-sm text-gray-500 line-clamp-1">{post.content}</p>
                                            </div>
                                            <div className="flex gap-2 w-full sm:w-auto justify-end">
                                                <Link href={`/dashboard/edit/${post.id}`} className="btn btn-sm btn-info text-white">Edit</Link>
                                                
                                                {/* Tombol Delete */}
                                                <form action={async () => {
                                                    'use server';
                                                    await deletePostAction(post.id);
                                                }}>
                                                    <button type="submit" className="btn btn-sm btn-error text-white">Hapus</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

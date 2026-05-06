import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function Home({ searchParams }) {
    const params = await searchParams; 
    const page = params?.page || 1;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    let posts = [];
    let meta = {};
    let isUnauthorized = false;
    let hasError = false;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?page=${page}`, {
            headers: {
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            cache: 'no-store'
        });
        
        if (res.status === 401) {
            isUnauthorized = true;
        } else if (!res.ok) {
            hasError = true;
        } else {
            const postsData = await res.json();
            posts = postsData.data || [];
            meta = postsData.meta || postsData; 
        }
    } catch (error) {
        hasError = true;
    }


    if (isUnauthorized) {
        return (
            <div className="hero bg-base-200 rounded-3xl mt-10 py-20 px-4">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Selamat Datang!</h1>
                        <p className="py-6">Aplikasi ini bersifat privat. Sesuai dengan aturan teknis, Anda diwajibkan untuk masuk (login) agar dapat membaca, menulis, dan mengelola postingan.</p>
                        <Link href="/login" className="btn btn-primary shadow-lg">Login Sekarang</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (hasError) {
        return <div className="alert alert-error max-w-4xl mx-auto mt-10 shadow-lg">Gagal terhubung ke API. Pastikan server Backend berjalan.</div>;
    }

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold mb-4">Eksplorasi Postingan</h1>
                <p className="text-gray-500">Baca pemikiran dan tulisan terbaru dari komunitas kami.</p>
            </div>

            {posts.length === 0 ? (
                <div className="alert alert-info shadow-lg">Belum ada post yang dibuat.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map(post => {
                        const date = new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                        return (
                            <div key={post.id} className="card bg-base-100 shadow-xl hover:-translate-y-2 transition-transform duration-300 border border-base-200">
                                <div className="card-body">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="badge badge-primary badge-outline text-xs">{post.user?.name}</div>
                                        <span className="text-xs text-gray-400">{date}</span>
                                    </div>
                                    <h2 className="card-title text-xl mb-2 line-clamp-2">{post.title}</h2>
                                    <p className="text-gray-600 line-clamp-3 mb-4">{post.content}</p>
                                    <div className="card-actions justify-end mt-auto">
                                        <Link href={`/post/${post.id}`} className="btn btn-primary btn-sm">Baca Selengkapnya</Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {meta.last_page > 1 && (
                <div className="join mt-12 flex justify-center">
                    <Link href={`/?page=${meta.current_page - 1}`} className={`join-item btn ${meta.current_page === 1 ? 'btn-disabled' : ''}`}>«</Link>
                    <button className="join-item btn">Halaman {meta.current_page} dari {meta.last_page}</button>
                    <Link href={`/?page=${meta.current_page + 1}`} className={`join-item btn ${meta.current_page === meta.last_page ? 'btn-disabled' : ''}`}>»</Link>
                </div>
            )}
        </div>
    );
}

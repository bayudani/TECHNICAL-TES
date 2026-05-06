import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function PostDetail({ params }) {
    const { id } = await params;
    
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) redirect('/login');

    // Fetch Detail Post
    const resDetail = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
    });

    if (!resDetail.ok) {
        return <div className="alert alert-error max-w-4xl mx-auto mt-10">Post tidak ditemukan.</div>;
    }

    const detailData = await resDetail.json();
    const post = detailData.data || detailData; 
    const date = new Date(post.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    // Fetch Post Lainnya (Ambil page 1)
    const resOther = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?page=1`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
    });
    const otherData = await resOther.json();
    const otherPosts = (otherData.data || []).filter(p => p.id.toString() !== id).slice(0, 3);

    return (
        <div className="max-w-4xl mx-auto py-8">
            <Link href="/" className="btn btn-ghost mb-6">← Kembali ke Beranda</Link>

            {/* Bagian Detail Post */}
            <article className="prose lg:prose-xl max-w-none bg-base-100 p-8 rounded-3xl shadow-lg border border-base-200">
                <h1 className="text-4xl font-extrabold mb-4 leading-tight">{post.title}</h1>
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-base-200">
                    <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-12 h-12 flex items-center justify-center">
                            <span>{post.user?.name?.charAt(0).toUpperCase()}</span>
                        </div>
                    </div>
                    <div>
                        <p className="font-bold m-0">{post.user?.name}</p>
                        <p className="text-sm text-gray-500 m-0">{date}</p>
                    </div>
                </div>
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </div>
            </article>

            {/* Bagian Postingan Lainnya */}
            <div className="mt-16">
                <h3 className="text-2xl font-bold mb-6">Baca Juga</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {otherPosts.map(other => (
                        <Link href={`/post/${other.id}`} key={other.id} className="card bg-base-200 shadow-md hover:bg-base-300 transition-colors">
                            <div className="card-body p-6">
                                <h4 className="card-title text-lg line-clamp-2">{other.title}</h4>
                                <p className="text-sm text-gray-500 mt-2">Oleh: {other.user?.name}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

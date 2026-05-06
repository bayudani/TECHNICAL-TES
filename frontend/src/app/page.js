import Link from 'next/link';

export default async function Home({ searchParams }) {
    const params = await searchParams; 
    const page = params?.page || 1;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?page=${page}`, {
        cache: 'no-store' 
    });
    
    const postsData = await res.json();
    const posts = postsData.data || [];
    const meta = postsData.meta || postsData;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Semua Postingan</h1>

            <div className="space-y-4">
                {posts.length === 0 ? (
                    <div className="alert alert-info">Belum ada post yang dibuat.</div>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="card bg-base-200 shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title">{post.title}</h2>
                                <p className="text-sm text-gray-500">Ditulis oleh: {post.user?.name}</p>
                                <p className="mt-2">{post.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {meta.last_page > 1 && (
                <div className="join mt-8 flex justify-center">
                    <Link 
                        href={`/?page=${meta.current_page - 1}`} 
                        className={`join-item btn ${meta.current_page === 1 ? 'btn-disabled' : ''}`}
                    >
                        «
                    </Link>
                    <button className="join-item btn">Halaman {meta.current_page}</button>
                    <Link 
                        href={`/?page=${meta.current_page + 1}`} 
                        className={`join-item btn ${meta.current_page === meta.last_page ? 'btn-disabled' : ''}`}
                    >
                        »
                    </Link>
                </div>
            )}
        </div>
    );
}

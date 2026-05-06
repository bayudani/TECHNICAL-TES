import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { updatePostAction } from '../../../../lib/actions';

export default async function EditPost({ params }) {
    const { id } = await params;
    
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) redirect('/login');

    //  data post yang mau di-edit
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
    });

    if (!res.ok) {
        return <div className="alert alert-error max-w-4xl mx-auto mt-10">Data tidak ditemukan.</div>;
    }

    const detailData = await res.json();
    const post = detailData.data || detailData;

    const handleUpdate = async (formData) => {
        'use server';
        await updatePostAction(id, formData);
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            <Link href="/dashboard" className="btn btn-ghost mb-6">← Batal Edit</Link>
            
            <div className="card bg-base-100 shadow-xl border border-base-200">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold mb-6 border-b pb-4">Edit Postingan</h2>
                    
                    <form action={handleUpdate}>
                        <div className="form-control w-full mb-4">
                            <label className="label"><span className="label-text font-semibold">Judul</span></label>
                            <input 
                                type="text" 
                                name="title" 
                                defaultValue={post.title} 
                                className="input input-bordered w-full" 
                                required 
                            />
                        </div>
                        <div className="form-control w-full mb-6">
                            <label className="label"><span className="label-text font-semibold">Konten</span></label>
                            <textarea 
                                name="content" 
                                defaultValue={post.content}
                                className="textarea textarea-bordered w-full" 
                                rows="8" 
                                required
                            ></textarea>
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" className="btn btn-primary flex-1">Simpan Perubahan</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

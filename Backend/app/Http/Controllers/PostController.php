<?php
namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function index()
    {
        // Menampilkan post beserta data pembuatnya, pagination server-side (10 per halaman)
        $posts = Post::with('user:id,name')->latest()->paginate(10);
        return response()->json($posts, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post = $request->user()->posts()->create($validated);

        return response()->json([
            'message' => 'Post berhasil dibuat',
            'data' => $post
        ], 201);
    }

    public function show($id)
    {
        $post = Post::with('user:id,name')->find($id);

        if (!$post) {
            return response()->json(['message' => 'Post tidak ditemukan'], 404);
        }

        return response()->json($post, 200);
    }

    public function update(Request $request, $id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post tidak ditemukan'], 404);
        }

        //Hanya pemilik post yang bisa edit
        if ($post->user_id !== Auth::id()) {
            return response()->json(['message' => 'Anda tidak memiliki akses untuk mengedit post ini'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
        ]);

        $post->update($validated);

        return response()->json([
            'message' => 'Post berhasil diperbarui',
            'data' => $post
        ], 200);
    }

    public function destroy($id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post tidak ditemukan'], 404);
        }

        // Hanya pemilik post yang bisa hapus
        if ($post->user_id !== Auth::id()) {
            return response()->json(['message' => 'Anda tidak memiliki akses untuk menghapus post ini'], 403);
        }

        $post->delete();

        return response()->json([
            'message' => 'Post berhasil dihapus'
        ], 200);
    }
}

# Fullstack Application - PT Garuda Cyber Indonesia Technical Test

Aplikasi fullstack ini dibangun menggunakan Laravel (Backend REST API) dan Next.js 16 (Frontend). Aplikasi ini memenuhi persyaratan CRUD Post management dan Authentication.

## Tech Stack

* **Backend:** Laravel  13.x, Sanctum (Token Auth), MySQL
* **Frontend:** Next.js 16+ (App Router, JavaScript), Tailwind CSS, DaisyUI

## Prasyarat

* PHP >= 8.3 & Composer
* Node.js >= 20.9 (Sesuai syarat Next.js 16)
* MySQL / PostgreSQL

## Cara Menjalankan Aplikasi

### 1. Setup Backend (Laravel)

1. Masuk ke direktori backend: `cd Backend`
2. Install dependency: `composer install`
3. Copy file env: `cp .env.example .env`
4. Sesuaikan kredensial database di `.env`
5. Generate app key: `php artisan key:generate`
6. Jalankan migrasi: `php artisan migrate`
7. Jalankan server: `php artisan serve` (API akan berjalan di http://localhost:8000)

### 2. Setup Frontend (Next.js 16)

1. Masuk ke direktori frontend: `cd frontend`
2. Install dependency: `npm install`
3. Sesuaikan URL API di environment variables (buat file `.env.local` dan isi dengan `NEXT_PUBLIC_API_URL=http://localhost:8000/api`)
4. Jalankan server dev: `npm run dev`
5. Buka di browser: `http://localhost:3000`

### Menjalankan dengan Docker Compose (Bonus)

Jika Anda memiliki Docker terinstal, Anda dapat menjalankan seluruh stack beserta databasenya cukup dengan perintah:

```
docker compose up -d --build
```
Jalankan command berikut untuk memasukkan data seeder
```
docker compose exec backend php artisan migrate:fresh --seed
```

*(Catatan: pastikan port 3000, 8000, dan 3306 tidak terpakai oleh aplikasi lokal lainnya)*

## Keputusan Teknis

* **Struktur Monorepo:** Proyek dipisah secara rapi dalam folder `Backend` dan `frontend` di dalam satu repository sesuai dengan instruksi yang diberikan.
* **Autentikasi:** Menggunakan Laravel Sanctum dengan  *token-based authentication* . Di sisi frontend Next.js 16, token disimpan di dalam secure HTTP-only *Cookies* untuk mempermudah akses oleh React Server Components (RSC) dan Server Actions.
* **Keamanan Endpoint (Otorisasi):** Endpoint Edit dan Delete pada backend dilindungi dengan pengecekan kepemilikan `user_id`. Pengguna hanya dapat memodifikasi data miliknya sendiri, jika tidak akan ditolak dengan HTTP 403 Forbidden.
* **Pagination:** Menggunakan default server-side pagination dari Laravel yang terintegrasi dengan parameter URL (`?page=`) di Next.js untuk navigasi halaman yang efisien.
* **Error Handling API:** Frontend dilengkapi dengan mekanisme *try-catch* dan validasi respons non-JSON untuk mencegah aplikasi *crash* apabila server Laravel mengalami gangguan internal.

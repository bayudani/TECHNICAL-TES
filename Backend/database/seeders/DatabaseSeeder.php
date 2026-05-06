<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Bro Bayu',
            'email' => 'tes@gmail.com',
            'password' => bcrypt('password'), 
        ]);

        User::factory(4)->create();

        Post::factory(30)->create();
    }
}

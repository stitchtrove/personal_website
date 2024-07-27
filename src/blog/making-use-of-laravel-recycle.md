---
topics: ["Real code", "Laravel"]
publishedOn: 2024-07-03
title: Making use of Laravel Recycle
---

I was watching Laravel API Master Class on laracasts and Jeremy McPeak used a function called recycle when creating database seeders and I realised how inefficient my previous seeders have been! Why did I not know about this function?!

## What is the recycle function?

[From the docs](https://laravel.com/docs/11.x/eloquent-factories#recycling-an-existing-model-for-relationships): If you have models that share a common relationship with another model, you may use the recycle method to ensure a single instance of the related model is recycled for all of the relationships created by the factory. ... You may find the recycle method particularly useful if you have models belonging to a common user or team.

## How to use the recycle function

You may, like me, have been doing something similar to the below, creating a bunch of users and then looping though those created users to create blog posts belonging to a user. 

```php
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = User::factory(10)->create();

        foreach($users as $user){
            Post::factory()->count(3)->make([
                'user_id' => $user->id,
            ]);
        }

    }
```

With recycle, you can now do this

```php
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = User::factory(10)->create();

        Post::factory(100)->recycle($users)->create();

    }
```

The Post::factory command is recycling through the created $users and assigning a random user_id to the created posts. 

What I was doing before in 6 lines of code I can now do in just 2! 

Another example for a blog with posts and comments belonging to users:

```php

    $users = User::factory(10)->create();

    $posts = Post::factory(200)
            ->recycle($users)
            ->create();

    Comment::factory(100)
            ->recycle($users)
            ->recycle($posts)
            ->create();

```
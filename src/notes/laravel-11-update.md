---
topics: ["Laravel", "Problem solving"]
publishedOn: 2024-05-07
title: Laravel 11 password_reset_tokens table doesn't exist
---


>I created a new laravel 11 project but used an old database from a laravel 9 installation. This assumes that the database already contains a password_resets table.

When trying to reset the user password and getting an error that the password_reset_tokens table doesn't exist, you can go to the config/auth.php file and find the settings for password resets. 

You can either change the name of the table here or you can set it in the .env file (the better option).
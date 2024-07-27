---
topics: ["Laravel", "Filament"]
publishedOn: 2024-06-01
title: "Path cannot be empty in Laravel Filament"
---


>Fresh install of Filament v3 on Laravel 11 and when trying to upload through a standard image field the upload always with the error "Path cannot be empty".

Go to php.ini file, uncomment upload_tmp_dir and set the value C:/laragon/tmp

upload_tmp_dir = C:/laragon/tmp

This only works for Laragon on Windows. 


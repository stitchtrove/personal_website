---
topics: ["Real code", "Personal project", "Eleventy", "Work in progress"]
publishedOn: 2024-03-17
title: Is building an Eleventy CMS in Laravel possible?
---

So a couple of weeks back I rebuilt this website using Eleventy, I'm happy with the outcome but less happy with having to write blog posts through VSCode. 

There are a couple of CMS options but I didn't want an online service, I want to maintain ownership of my data so I decided to try and create a bespoke CMS within a weekend of hacking. 

This is VERY proof-of-concept and the code quality is pretty shocking but it does what it's meant to - provide a cms for my content and build my static site for me. 

## Here's what I accomplished over the last 48 hours:

- Installed Laravel 11. 
- Created a "site import" using Dropzone.js, so I can drag my src folder containing all my existing content and laravel will loop through all my markdown files and create database entries for each one. 
- Created an index page that lists all my collections and the posts inside.
- Create an edit page that opens my post data within a wysiwyg editor (I went for Toast UI, will explain why later).
- Save the updated wysiwyg content in the database.
- Created a custom command that loops through all database entries and outputs a bunch of markdown files within my Eleventy installation.
- Added to the command the ability to run eleventy build.

Overall, it works and proves the idea is possible. 

## Issues and workarounds

Three big issues with this project. 

1) The wysiwyg editor, I knew which one I wanted to use but it just didn't support markdown well enough. 

    When you google markdown editors there are plenty who say it works, but I struggled with six different editors before I finally had success with Toast. 

    It doesn't look the best but it functions which is key for a proof-of-concept. 

2) The location of Eleventy and the ability to commit and push, in order to publish my site with as little manual work as possible. 

    Due to my own git setup I cannot do a git push from the command line where I run php artisan, it has to be done manually from elsewhere - this is my own fault.

    I can solve this by either moving my eleventy installation into my Laravel project or sorting out the git configs on my PC (sounds easy but it's anything but).

3) I misunderstood how Eleventy data files worked. 

    I was under the assumption I could export all my laravel content through an api route and with eleventy create a data file to generate the site from. Wrong. Eleventy can't do that. 

    I then tried creating a posts.json file using laravel and then running eleventy build, now this did work but it didn't allow me the custom functionality that I currently have running with date formattings and layouts. 

    So that had to go too. 

## Whats next?

Most importantly I need to refactor.

The code works but it's not something I'd want anyone to see. 

Once things are tidier I can focus on getting things looking better, maybe add some styling. 

Finally I can then look at extending the functionality with:

- Image management
- Only regenerate changed files
- Collection creation
- Custom YAML
- Autodeploying to netlify

I don't have a name for my new CMS project yet but it'll need one soon. 
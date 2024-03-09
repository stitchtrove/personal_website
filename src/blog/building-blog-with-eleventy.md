---
topics: ["Real code", "Eleventy", "Tutorials"]
publishedOn: 2024-03-10
title: Rebuilding my blog with Eleventy from scratch
---

Over Christmas 2023 I took a weekend to rebuild my website using Eleventy so that I could publish blog posts and keep weeknotes. 

I used a template called [Eleventy Notes](https://github.com/rothsandro/eleventy-notes) but after a couple of months I wasn't happy with it, it didn't reflect me and the blog post organisation was too complex. 

So I rebuilt from scratch, here's how:

Install Eleventy in an empty folder
```php
mkdir my_blog
npm init -y
npm install @11ty/eleventy
```
As I was building from scratch this time I could choose my own folder structure
```
my_blog <!-- root -->
    _includes
    _layouts
    src <-- contains all content -->
        blog
        notes
        pages
    assets <!-- contains all css/js -->
```
To get things running create the config file *.eleventy.js* in the root of the folder, this is where we can customise how eleventy works.

```php
module.exports = function(eleventyConfig){
    eleventyConfig.addPassthroughCopy("./assets/css");
    eleventyConfig.addWatchTarget("./assets/css/style.css");
    return {
        dir: {
            layouts: "_layouts",
            output: "_site"
        },
    }
};
```
The only things of note here are css configs. I've configured Eleventy to copy the contents of the *./assets/css* directory directly to the output directory during the build process, this is because no processing is needed for standard .css files.

I also added the *addWatchTarget* line which means Eleventy will refresh my browser when I make any changes to my css file - love an autoreload!

I then run the command *npx @11ty/eleventy --serve --watch* to build and watch my files as I work. 

## Collections

In Eleventy, collections are used as a way to organize and group content, I have three types: single pages, blog posts, notes. 

The single pages will include my <a href="/now">now page</a> and the listing pages (<a href="/blog">/blog</a> and <a href="/notes">/notes</a>).

To set this up I create my src/pages directory with a *pages.json* file which tells eleventy how to process these pages. 

```php
{
    "permalink": "/{{ page.fileSlug }}/",
    "tags": "pages",
    "layout": "base"
}
```

The key here is the permalink value which sets a nice clean url for all pages generated. 

I copy the same settings for each of my content directories (blog, notes) and only change the tags and layout as appropriate. 

When working with collections you need to set it up in the *.eleventy.js* config file. 

```php
module.exports = function(eleventyConfig){
    eleventyConfig.addCollection("pages", function(collection) {
        return collection.getFilteredByGlob("src/pages/*.md");
    });
    ...
}
```

This is the basic code for a collection, however when it comes to posts and notes I want things to be ordered by publish date (new - old) so this requires a little more config. 

I am using *publishedOn* within my post meta data to set the date.
```
publishedOn: 2024-02-24
```

```php
module.exports = function(eleventyConfig){
    ...
    eleventyConfig.addCollection("posts", function(collection) {
        return collection.getFilteredByGlob("src/blog/*.md").sort((a, b) => {
            const dateA = a.data.publishedOn;
            const dateB = b.data.publishedOn;
            // sort new - old
            return dateB - dateA;
        });
    });
    ...
}
```

## Publishing on Netlify

I host this site using Netlify (for now) so after pushing my new site to [github](https://github.com/stitchtrove/personal_website) I head over to Netlify to set up the build process. 

Once on Netlify I go to *Site configuration -> Build & deploy -> Build settings* and set the following:


```php
Base directory : /
Build command : npm install && npx @11ty/eleventy
Publish directory : _site
```

Now, each time I push a site update to github it will auto-update my live site through Netlify. 
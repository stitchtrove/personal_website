const { DateTime } = require("luxon");

module.exports = function(eleventyConfig){
    eleventyConfig.addCollection("posts", function(collection) {
        return collection.getFilteredByGlob("src/blog/*.md").sort((a, b) => {
            const dateA = a.data.publishedOn;
            const dateB = b.data.publishedOn;
            // sort new - old
            return dateB - dateA;
        });
    });
    eleventyConfig.addCollection("notes", function(collection) {
        return collection.getFilteredByGlob("src/notes/*.md").sort((a, b) => {
            const dateA = a.data.publishedOn;
            const dateB = b.data.publishedOn;
            // sort new - old
            return dateB - dateA;
        });
    });
    eleventyConfig.addCollection("pages", function(collection) {
        return collection.getFilteredByGlob("src/pages/*.md");
    });
    eleventyConfig.addFilter("readableDate", dateObj => {
        return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
    });
    eleventyConfig.addPassthroughCopy("./assets/css");
    eleventyConfig.addWatchTarget("./assets/css/style.css");
    return {
        dir: {
            layouts: "_layouts",
            output: "_site"
        },
    }
};
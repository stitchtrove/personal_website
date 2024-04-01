---
topics: ["JavaScript"]
publishedOn: 2024-03-23
title: String to Boolean values in JS
---


>Recently I had a string variable but needed to detect if it was present or not for a function that required a boolean. <br/>


The !! operator can be applied to a string to determine a boolean where an empty string would return false, and a non-empty string would return true.


```js

// Example string value
var stringValue = "";

// Convert to boolean using double negation operator
var booleanValue = !!stringValue;

// Output the result
console.log(booleanValue); // Output: false

// Example string value
var stringValue = "example";

// Convert to boolean using double negation operator
var booleanValue = !!stringValue;

// Output the result
console.log(booleanValue); // Output: true
```
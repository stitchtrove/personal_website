---
topics: ["Laravel", "Databases"]
publishedOn: 2024-04-01
title: Pivot tables and belongsToMany in Laravel
---

>Because I can never remember how pivot tables work with a many-to-many relationship. 

Using Blog Posts and Tags as an example:


Models:

```php
Post

Tags
```

Tables:

```php
Post

Tags

Post_Tag
```


In the Post_Tag migration

```php
$table->id();
$table->foreignIdFor(Post::class, ‘optional_column_name’)->constrained()->cascadeOnDelete();
$table->foreignIdFor(Tag::class);
```

Then in the Post model

```php
Public function tags() {
	return $this->belongsToMany(Tag::class);
}
```

Or if you need to specify the column name for the pivot

```php
Public function tags() {
	return $this->belongsToMany(Tag::class, foreignPivotKey: “unusual_column_name_for_post_id”);
}
```


Then in the Tag model

```php
Public function posts() {
	return $this->belongsToMany(Post::class);
}
```

Or

```php
Public function posts() {
	return $this->belongsToMany(Post::class, relatedPivotKey: “unusual_column_name_for_post_id”);
}
```
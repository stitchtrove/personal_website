---
sort: 1
tags: ["Real code", "Laravel", "Filament", "Quick Tips"]
publishedOn: 2024-02-29
---

By default, Filament is run at the route of domain.com/admin.

If you're simply creating an admin panel, this will work for you, but if your whole app is based around Filament you may want to customise this url. 

It's actually quite straightforward, in our case we will be running the admin panel as our homepage so the route will be /.

First go to your routes/web.php file and remove (or comment out) the existing '/' route. 

```php
// Route::get('/', function () {
//     return view('welcome');
// });
```

Next find your Filament config file.

In most instances your config file will be *app/Providers/Filament/AdminPanelProvider.php*.

If you created a unique panel name using *php artisan make:filament-panel [panel-name]* then your config file will be *app/Providers/Filament/[panel-name]PanelProvider.php*.

Find the path method and set the url you want it to be. 

```php
public function panel(Panel $panel): Panel
{
    return $panel
        // sets the filament route to default /
        ->path('');
}
```

or to have a custom route

```php
public function panel(Panel $panel): Panel
{
    return $panel
        // sets the filament route to /custom-route
        ->path('/custom-route');
}
```
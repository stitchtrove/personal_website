---
topics: ["Laravel", "API"]
publishedOn: 2024-07-01
title: Rough notes for API creation in Laravel
---


>Notes I made taking a course that will eventually be refactored into a nice blog post



Versioning is super important and should be done regardless of expectations. 

app\Http\Controllers\Api\V1\ should be the location for controllers

app\Http\Requests\Api\V1\ should be the location for requests

Create a nice api trait for how you want to return data

```php
namespace App\Traits;

trait ApiResponses
{

    protected function ok($message)
    {
        return $this->success($message, 200);
    }

    protected function success($message, $statusCode = 200)
    {
        return response()->json([
            'message' => $message,
            'status' => $statusCode
        ], $statusCode);
    }
}
```

You can have multiple route files eg, routes/api.php for basic things that won't ever change and don't need versioning (auth) and routes/api_v1.php for versioned data accessing routes but then you also need register your new routes file
```php
->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        then: function ($router) {
            Route::prefix('api/v1')
                ->middleware('api')
                ->name('api.v1.')
                ->group(base_path('routes/api_v1.php'));
        }
    )
```

use apiResource for routes that don't use create etc Route::apiResource('tickets', TicketController::class);


---
topics: ["Real code", "Personal project", "Laravel", "Filament"]
publishedOn: 2024-10-20
title: Using the excellent tinify-php in a Filament Laravel application
---

> After running Google lighthouse on one of my sites I found a lot of images were oversized and needed a way to resize and compress on upload. I found that tinypng.com has an api which works with all file types and is free for 500 images a month. 


First get an API key from https://tinypng.com/developers and then install the package via composer:

```php
composer require tinify/tinify
```

Then in the Filament model resource make sure we have a file upload field and use Filaments built in features for forcing a resize on upload. 

```php
Forms\Components\FileUpload::make('photo')
    ->image()
    ->imageEditor()
    ->imageResizeMode('contain')
    ->imageResizeTargetWidth('550')
```

Then in our create and edit resource pages we have a function which handles the upload to tinify:

```php
    // Before we save and create the record we want to change the form data
    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data = $this->transformImages($data);
        return $data;
    }

    protected function transformImages(array $data): array
    {
        $localFilepath = storage_path('app/public/' . $data['photo']); // Local path to the uploaded image

        try {
            // Set the Tinify API Key from environment variable
            \Tinify\setKey(env('TINIFY_API_KEY'));

            // Optimize the image with Tinify
            $source = \Tinify\fromFile($localFilepath);

            // Get the file extension and generate the new file name
            $ext = pathinfo($localFilepath, PATHINFO_EXTENSION);
            $fileName = Str::slug($data['name'], '-') . '-by-' . Str::slug($data['artist']) . '.' . $ext;

            // Save the optimized image temporarily to a local file
            $tinifiedLocalFile = storage_path('app/public/' . $fileName); // Temporary location for the Tinified image
            $source->toFile($tinifiedLocalFile);

            // Store the tinified image into DigitalOcean Spaces using the 'do' disk
            $filePathInDO = Storage::disk('do')->putFileAs('stitchalongs', new \Illuminate\Http\File($tinifiedLocalFile), $fileName, 'public');

            // Remove the temporary tinified file after upload
            if (file_exists($tinifiedLocalFile)) {
                unlink($tinifiedLocalFile);
            }

            // Update the 'photo' field in the $data array to point to the new location in DigitalOcean Spaces
            $data['photo'] = $filePathInDO;
        } catch (\Tinify\AccountException $e) {
            // Handle the error if the API key is invalid or account limit is reached
            Notification::make()
                ->title('Account Error')
                ->body($e->getMessage())
                ->danger()
                ->send();
        } catch (\Tinify\ClientException $e) {
            // Handle the error if there's a problem with the source image or request options
            Notification::make()
                ->title('Client Error')
                ->body($e->getMessage())
                ->danger()
                ->send();
        } catch (\Tinify\ServerException $e) {
            // Handle the error if Tinify API has server-side issues
            Notification::make()
                ->title('Server Error')
                ->body($e->getMessage())
                ->danger()
                ->send();
        } catch (\Tinify\ConnectionException $e) {
            // Handle network connection errors
            Notification::make()
                ->title('Connection Error')
                ->body($e->getMessage())
                ->danger()
                ->send();
        } catch (\Exception $e) {
            // Handle any other errors
            Notification::make()
                ->title('Unexpected Error')
                ->body($e->getMessage())
                ->danger()
                ->send();
        }

        // Always return the data array, even if an error occurred
        return $data;
    }
```
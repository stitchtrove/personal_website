---
sort: 2
tags: ["Real code", "Laravel", "Livewire", "Stitchtrove"]
publishedOn: 2023-12-21
---


## Context

<a href="https://stitchtrove.com" target="_blank">Stitchtrove</a> has a project management system where you can create records of your cross stitch projects and track progress. Progress is tracked in the form of a single photo uploaded against the `Project` model.

## Solution

The website uses the following models: `Project` and `ProjectUpdate`.

The purpose behind using two models was to future-proof against the requirements of multiple project updates with multiple images per project.

Assigning an image directly to a Project would not work for 'progress tracking' so the `ProjectUpdate` was created.

For image handling I am using <a href="https://spatie.be/docs/laravel-medialibrary/v10/introduction" target="_blank">Spatie's Media Library v10</a> (note that this was my 3rd attempt at getting this plugin working, it fought hard every step of the way) and <a href="https://pqina.nl/filepond/" target="_blank">FilePond</a>. 

App\Models\Project.php
```
public function projectUpdate()
{
    return $this->hasMany(ProjectUpdate::class)->orderBy('created_at', 'desc');
}

public function getLatestUpdate()
{
    return $this->projectUpdate()->orderBy('created_at', 'desc')->first();
}

```
App\Models\ProjectUpdate.php
```
public function project()
{
    return $this->belongsTo(Project::class);
}

public function registerMediaCollections(): void
{
    $this->addMediaCollection('project_updates');
}

public function registerMediaConversions(Media $media = null): void
{
    $this
        ->addMediaConversion('preview')
        ->fit(Manipulations::FIT_CROP, 300, 300)
        ->nonQueued();
}

```

The image upload template is not all that exciting but will include it here for code completion. 

What happens with FilePond is that the image is uploaded to the server *BEFORE* the form is submitted so the whole component essentially requires two POST urls, one for the image and one for the rest of the form data that gets sent on form submit (notes of progress, date/time, percentage etc). 

```
<x-app-layout>
    @push('styles')
    <link rel="stylesheet" href="https://unpkg.com/filepond/dist/filepond.min.css">
    <link rel="stylesheet" href="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css">
    @endpush
    <div>
        <h2>Updating progress photo for {{$project->name}} by {{$project->artist}}</h2>
        <form action="/crop-image-upload" method="POST" enctype="multipart/form-data" id="image-upload">
            @csrf
            <input type="hidden" name="project_id" value="{{$project->id}}" />
            <input required type="file" name="filepond" id="filepond" data-max-file-size="6MB" data-max-files="1" />
            <div>
                <button id="submitButton" type="submit">Update progress</button>
            </div>
        </form>
    </div>
    @push('scripts')
    <script src="https://unpkg.com/filepond-plugin-file-encode/dist/filepond-plugin-file-encode.min.js"></script>
    <script src="https://unpkg.com/filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.min.js"></script>
    <script src="https://unpkg.com/filepond-plugin-image-exif-orientation/dist/filepond-plugin-image-exif-orientation.min.js"></script>
    <script src="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.js"></script>
    <script src="https://unpkg.com/filepond/dist/filepond.min.js"></script>
    <script type="text/javascript">
        FilePond.registerPlugin(

            // encodes the file as base64 data
            FilePondPluginFileEncode,

            // validates the size of the file
            FilePondPluginFileValidateSize,

            // corrects mobile image orientation
            FilePondPluginImageExifOrientation,

            // previews dropped images
            FilePondPluginImagePreview
        );

        // Select the file input and use create() to turn it into a pond
        const csrfToken = document.head.querySelector('meta[name="csrf-token"]').content;

        const inputElement = document.querySelector('#filepond');
        const pond = FilePond.create(inputElement, {
            acceptedFileTypes: ['image/*'],
            server: {
                process: '/crop-image-upload/{{$project->uuid}}',
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                }
            },
            onprocessfiles: (files) => {
                // Files have been successfully processed (uploaded)
                // Show the button or perform any other action
                document.getElementById('submitButton').style.display = 'block';
            }
        });
        // Get the form element
        var form = document.getElementById('image-upload');

        // Add a submit event listener to the form
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            window.location.href = '/process-image-upload/{{$project->uuid}}';
        });
    </script>
    @endpush
</x-app-layout>
```

Then in my projects controller we handle the image upload and the update creation (sorry, no strict crud here!).

```
public function uploadCropImage(Request $request, $project)
    {
        $project = Project::where('uuid', $project)->first();
        $new_project_update = ProjectUpdate::create(['project_id' => $project->id]);
        if ($request->hasFile('filepond')) {
            try {
                $new_project_update
                    ->addMediaFromRequest('filepond')
                    ->toMediaCollection('project_updates');
                return response()->json(['success' => 'Success']);
            } catch (\Exception $e) {
                return response()->json(['fail' => $e]);
            }
        }
    }
    
public function process_project_image($project)
    {
        $project = Project::where('uuid', $project)->firstOrFail();
        $project->touch();
        $existing_entries = ProjectUpdate::where('_project_id', $project->id)->count();
        if ($existing_entries !== 1) {
            $old_update = ProjectUpdate::where('project_id', $project->id)->oldest()->first();
            $old_update->delete();
        }
        return redirect('/my-stash')->with('success', 'Your project project has been updated');
    }
```

The interesting code here is the final function. 

We *touch* the project record in order to update the `updated_at` timestamp so that we can order projects by `updated_at` and the most recently worked on project appears first in the listing. 

We are currently only allowing one update at a time per project (this will likely change in the future) so we see if there are any existing project updates, if yes we delete the record and the image associated with it. 
---
sort: 1
tags: ["Real code", "Laravel", "Livewire"]
publishedOn: 2023-12-30
---

## Context

<a href="https://stitchtrove.com" target="_blank">Stitchtrove</a> has a project management system where you can create records of your cross stitch projects and track progress etc. For this we have a pattern artist field. When creating multiple project records for the same artist it can be repetitive so I wanted the field to autocomplete with a list of regular artists when the user begins to type. 

## Solution

First I created a migration that will hold only artist names, this is just a proof of concept so a simple seeder inside the migration is enough.


```
public function up()
    {
        Schema::create('knowledge_artists', function (Blueprint $table) {
            $table->id();
            $table->string('artist');
        });

        $artists = ['Cross Stitch Vienna', 'Durene Jones', 'Infinity Bear Designs', 'Lord Libidan', 'Monsterous Designs', 'Night Spirit Studio', 'Owl Forest', 'Pibble Patterns', 'Stitchbucket', 'Stitched Cat', 'Tangled Threads and Things', 'The Retro Stitcher', 'Tiny Modernist', 'WitchyStitcher', 'Lola Crow Cross Stitch', 'Circle Cross Cross Stitch'];

        foreach ($artists as $artist) {
            DB::table('knowledge_artists')->insert(
                ['artist' => $artist]
            );
        }
    }

```

In the Livewire template we create our text field and dropdown. 

```
<form wire:submit.prevent="submit" class="uk-form-stacked" x-data='{
        artistSelected(e) {
            let value = e.target.value
            let id = document.body.querySelector("datalist [value=\""+value+"\"]").dataset.value
        }
    }'>
    <div class="uk-margin-bottom">
        <label class="" for="Artist">Artist</label>
        <input type="text" list="artistOptions" wire:model="artist" placeholder="Artist" class="uk-input" x-on:change.debounce.500ms="artistSelected($event)">

        <datalist id="artistOptions">
            @foreach($searchResults as $result)
                <option wire:key="{{ $result->artist }}" data-value="{{ $result->artist }}" value="{{ $result->artist }}"></option>
            @endforeach
        </datalist>
    </div>
</form>
```

And then in the Livewire controller we create the variables and handle the autocomplete query.


```
public $artist;
public array $searchResults = [];

public function updatedArtist()
{
    if ($this->artist != '') {
        $this->searchResults = DB::table('knowledge_artists')->where('artist', 'LIKE', '%' . $this->artist . '%')->orderBy('artist', 'asc')->get()->toArray();
    } else {
        $this->searchResults = [];
    }
}
```

> TODO: Extend by allowing dynamic creation of artists.
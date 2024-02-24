---
sort: 5
tags: ["Real code", "Laravel", "Filament", "Tutorials", "Calendar"]
publishedOn: 2024-02-24
---

A recent personal project required a calendar that I could add and edit events for, lots of JS options but not many Laravel options. 

I decided to go with a Filament project and install the <a href="https://github.com/saade/filament-fullcalendar" target="_blank">saade/filament-fullcalendar</a> package, here's how I set it all up. 

## Requirements

You need to make sure you first have Laravel installed and Filament, before you can install the full-calendar package. 

In your command line, run the following:

```php
composer create-project laravel/laravel example-app

composer require filament/filament:"^3.2" -W

php artisan filament:install --panels

php artisan make:filament-user
```

You will probably want your calendar to display events or tasks, you need to create a model for this. 

For the purpose of this tutorial we have a model Event with the following migration.

```php
Schema::create('events', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->datetime('start');
    $table->datetime('end');
    $table->boolean('allDay')->default(true);
    $table->timestamps();
});
```

## Installation

```php
composer require saade/filament-fullcalendar:^3.0
```

You then need to register FilamentFullCalendarPlugin in the *app/Providers/Filament/AdminPanelProvider.php* file.

```php
use Saade\FilamentFullCalendar\FilamentFullCalendarPlugin; 
 
public function panel(Panel $panel): Panel
{
    return $panel
        ->plugins([FilamentFullCalendarPlugin::make()]); 
}
```

Then, in the command line, create the widget - this is the calendar functionality and can then be used anywhere within Filament.

```php
php artisan make:filament-widget CalendarWidget
```

If you look at the widget created you should find the following code:

```php
<?php

namespace App\Filament\Widgets;

use Saade\FilamentFullCalendar\Widgets\FullCalendarWidget;

class CalendarWidget extends FullCalendarWidget
{
    /**
     * FullCalendar will call this function whenever it needs new event data.
     * This is triggered when the user clicks prev/next or switches views on the calendar.
     */
    public function fetchEvents(array $fetchInfo): array
    {
        // You can use $fetchInfo to filter events by date.
        // This method should return an array of event-like objects. See: https://github.com/saade/filament-fullcalendar/blob/3.x/#returning-events
        // You can also return an array of EventData objects. See: https://github.com/saade/filament-fullcalendar/blob/3.x/#the-eventdata-class
        return [];
    }
}
```

The fetchEvents function is where you can query the model (Events) you want to display on the calendar. 

```php
public function fetchEvents(array $fetchInfo): array
    {
        return Event::query()
            ->where('starts_at', '>=', $fetchInfo['start'])
            ->where('ends_at', '<=', $fetchInfo['end'])
            ->get()
            ->map(
                fn (Event $event) => [
                    'title' => $event->id,
                    'start' => $event->starts_at,
                    'end' => $event->ends_at,
                    'allDay' => $event->allDay
                ]
            )
            ->all();
    }
```

## Extending the calendar

FullCalendarPlugin accepts a <a href="https://fullcalendar.io/docs#toc" target="_blank">variety of config options</a>, you can use most of these by setting them in the *app/Providers/Filament/AdminPanelProvider.php* file.

I wanted the calendar to start on a Monday and only show week-by-week, so I passed the following config to the plugin. 

```php
->plugins([
    FilamentFullCalendarPlugin::make()
        ->selectable(true)
        ->editable(true)
        ->config([
            'initialView' => 'dayGridWeek', // show week by week
            'firstDay' => 1, // start the week on a Monday
            'eventDisplay' => 'block', // render a solid rectangle
        ])
    ]);
```

## Adding or editing events

You'll notice above the calendar is an 'Add Event' button or similar (the text depends on your model name), you can modify the creation form that pops up adding a headerActions function in your *CalendarWidget.php*.

Filament handles all the real "work" we just need to tell it what fields to handle. 

```php
protected function headerActions(): array
    {
        return [
            CreateAction::make()
                ->label('Create event') // change the label of the button
                ->mountUsing(
                    function (Form $form, array $arguments) {
                        $form->fill([
                            'start' => $arguments['start'] ?? null, // if a date is selected it will autofill
                            'end' => $arguments['end'] ?? null,
                            'allDay' => true, // the default is an all day event
                        ]);
                    }
                )
        ];
    }
```

You can do the same for editing or deleting by adding a modalActions function to the same file.

```php
protected function modalActions(): array
    {
        return [
            EditAction::make()
                ->mountUsing(
                    function (CalEvent $record, Form $form, array $arguments) {
                        $form->fill([
                            'title' => $record->name,
                            'start' => $record->start,
                            'end'   => $record->end,
                            'allDay' => $record->allDay,
                        ]);
                    }
                ),
            DeleteAction::make(),
        ];
    }
```

You now have a working calendar!
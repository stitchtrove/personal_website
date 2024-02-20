---
sort: 3
tags: ["Real code", "Drupal"]
publishedOn: 2024-01-10
---
## Context

At work there was a discussion over moving 100’s of articles from a very old Drupal 7 installation over to the newer Drupal 10 CMS powering the current site. We have two sites: old cms on a subdomain and new cms on the main domain. The requirement was to combine the two and no longer use the subdomain. 

## Getting the data out

Due to the drastic changes between Drupal 7 and 10, a simple DB migration wasn’t possible. 

The Drupal 7 installation did however have an API (/api/articles) that returned enough information about each node. 

## Custom module

Create a custom module with a single route (/article-import) and controller. 

For basic node creation this is all you need.

```php
<?php

namespace Drupal\articles_import\Controller;

use Drupal\Core\File\FileSystemInterface;
use \Drupal\node\Entity\Node;

/**
 * Class DefaultController.
 */
class DefaultController extends ControllerBase
{

  public function articles_import()
  {

    $client = \Drupal::httpClient();

    try {

			// If you are getting the json from an external API
      $response = $client->get('https://blog.com/api/article/xxx');

      // If you are getting the json from a local articles.json file stored within your module
			$response = file_get_contents(\Drupal::service('extension.list.module')->getPath('articles_import') . '/data/articles.json');
      
			// make the json usable
			$articles = json_decode($response, TRUE);

      foreach ($articles as $result) {
        foreach ($result['results'] as $data) {

					// Create a node and set the content type
          $node = Node::create(['type' => 'article']);

					// set the title
          $node->setTitle($data['title']);

					// Use data to set the timestamps as in the past
          $node->setCreatedTime($data['publication_dates']['original']);
          $node->setChangedTime($data['publication_dates']['updated']);

					// Publish the node
          $node->setPublished(); 

          $node->save();
        }
      }
    } catch (\Exception $e) {
      // handle your exception here
    }

		print "Content Imported";
    exit;

  }
}
```

## Extending this module

### Taxonomies

Context: The nodes can be associated with a category taxonomy

```php
 // Get the category name from the json
 $categoryName = $data['category'];

 // Check if Drupal already has a category taxonomy entry of $categoryName
 $terms = \Drupal::entityTypeManager()
   ->getStorage('taxonomy_term')
   ->loadByProperties(['name' => $categoryName, 'vid' => 'article_category']);

 if (!$terms) {

	 // If Drupal does not have the category already, create it
	 $term = Term::create([
	   'name' => $categoryName,
     'vid' => 'article_category',
   ]);
   $term->save();
 
 } else {

   // The category already exists, so use it
	 $term = reset($terms);

 }
 
 // Save the category against the node
 $node->article_category[] = [
	 'target_id' => $term->id(),
 ];
```

### Dates

Context: Your node has date field that you need to populate with a timestamp

```php
// For the most basic created_at dates you can simply use a timestamp
$node->setCreatedTime($data['creation_date']);

// If you have a non-standard date field that you want to populate
$originalDateTime = \DateTime::createFromFormat('U', $data['creation_date']);
// Format the timestamp from the json to match your required format
$dateTimeString = $originalDateTime->format('Y-m-d\TH:i:s');
// Save the new formatted date against the node
$node->publication_date->setValue($dateTimeString);
```

### Images

Context: Take an image url and save the image into the new CMS and set it against the node.

```php
// If your json data includes a url to an image
if (isset($data['primary_image']['original'])) {
            
	// Create file object using the image url
  $imgName = $data['primary_image'];
  $imgName = explode("?", $imgName)[0];
  $imgName = basename($imgName);
  $imgData = file_get_contents($data['primary_image']['original']);

  if ($imgData) {
		// Change your image storage settings as required
	  $file_repository = \Drupal::service('file.repository');
	  $image = $file_repository->writeData($imgData, "public://$imgName", FileSystemInterface::EXISTS_REPLACE);
		
		// This assumes you are using https://www.drupal.org/project/media_library module
		// Create the Media object and assign the image to it
    $image_media = Media::create([
	    'name' => $imgName,
      'image_caption' => $data['title'],
      'bundle' => 'image',
      'uid' => 1,
      'langcode' => \Drupal::languageManager()->getCurrentLanguage()->getId(),
      'status' => 1,
      'field_image' => [
	      'target_id' => $image->id(),
      ],
      'field_date' => $data['creation_date'],
    ]);
    
		// Save the Media object
		$image_media->save();

		// Save the image id against the node image field
    $node->featured_image->setValue([
	    'target_id' => $image_media->id(),
    ]);

	} // End if ($imgData)

} // End if json includes image

```
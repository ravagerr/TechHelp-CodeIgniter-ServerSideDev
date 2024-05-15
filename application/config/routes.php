<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/userguide3/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes with
| underscores in the controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/
$route['default_controller'] = 'welcome';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;

$route['api/get_data'] = 'api/get_data';
$route['api/register'] = 'usercontroller/register';
$route['api/login'] = 'usercontroller/login';
$route['api/get_user/(:num)'] = 'usercontroller/getUser/$1';
$route['api/checkSession'] = 'usercontroller/checkSession';
$route['logout'] = 'UserController/logout';

// Specific routes first
$route['api/questions/create'] = 'QuestionController/create';         // POST: Create a new question
$route['api/questions/delete/(:any)'] = 'QuestionController/delete/$1';  // DELETE: Delete a question by slug
$route['api/questions/tag/(:any)'] = 'QuestionController/getQuestionsByTag/$1';
$route['api/vote'] = 'QuestionController/vote';
$route['api/reply'] = 'QuestionController/reply';

// General routes last
$route['api/questions'] = 'QuestionController/index';                  // GET: Fetch all questions
$route['api/questions/(:any)'] = 'QuestionController/view/$1';        // GET: Fetch a single question by slug


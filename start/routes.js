'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/FillBaseController','FillBaseController.fill')

Route.get('/', 'CatController.show')
Route.get('/categories','CatController.show')
Route.get('/positions','PositionController.show')
Route.get('/position','PositionController.show_one')
Route.get('/shopping','PositionController.show_shopping')
Route.get('/users','UserController.show')
Route.get('/orders','OrderController.show')
Route.get('/content','ContentController.show')

Route.post('/users/check_login_present', 'UserController.check_login_present')
Route.post('/users/login', 'UserController.login')
Route.post('/users/logout', 'UserController.logout')
Route.post('/users/get_registration_window', 'UserController.get_registration_window')
Route.post('/users/register', 'UserController.register')
Route.post('/shopping/check_shopping', 'PositionController.check_shopping')
Route.post('/orders/create_order', 'OrderController.Create_Order')
Route.post('/orders/get_edit_order_window', 'OrderController.get_edit_order_window')
Route.post('/orders/UpDateOrdersPage', 'OrderController.UpDateOrdersPage')
Route.post('/orders/ExecOrder', 'OrderController.ExecOrder')
Route.post('/orders/CancelOrder', 'OrderController.CancelOrder')
Route.post('/orders/ReturnOrder', 'OrderController.ReturnOrder')
Route.post('/content/get_edit_position_window', 'ContentController.get_edit_position_window')
Route.post('/content/get_edit_position_text', 'ContentController.get_edit_position_text')
Route.post('/content/set_foto_for_edit_pos', 'ContentController.set_foto_for_edit_pos')
Route.post('/content/save_position', 'ContentController.save_position')
Route.post('/content/delete_position', 'ContentController.delete_position')
Route.post('/content/get_edit_cat_window', 'ContentController.get_edit_cat_window')
Route.post('/content/set_foto_for_edit_cat', 'ContentController.set_foto_for_edit_cat')
Route.post('/content/save_cat', 'ContentController.save_cat')
Route.post('/content/delete_cat', 'ContentController.delete_cat')




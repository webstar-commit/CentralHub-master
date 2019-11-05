/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'pages/homepage'
  },
  '/home': {
    view: 'pages/home'
  },

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝

/** User API */
  'POST /beta/user/signup' : 'UserController.signup',
  'GET /beta/user/activate' : 'UserController.activateAccount',
  'POST /beta/user/login' : 'UserController.login',

  'POST /beta/user/change-email' : 'UserController.changeEmailRequest',
  'GET /beta/user/update-email' : 'UserController.updateEmail',
  'GET /beta/user/profile' : 'UserController.getUserProfile',
  'PUT /beta/user/profile' : 'UserController.saveProfile',

  'POST /beta/user/forgot-passwd' : 'UserController.forgotPassword',
  'POST /beta/user/update-passwd' : 'UserController.updatePassword',
  
  'POST /beta/user/google-signup' : 'UserController.googleSignup',
  'POST /beta/user/google-signin' : 'UserController.googleSignin',
  'POST /beta/user/facebook-signup' : 'UserController.facebookSignup',
  'POST /beta/user/facebook-signin' : 'UserController.facebookSignin',

  


  /** Application API */
  // 'POST /beta/app/new': 'ApplicationsController.createNewApplication', // Register a new application/game
  // 'POST /beta/app/:appId': 'ApplicationsController.editApplication', // Edit an application/game
  // 'GET /beta/app/:appId': 'ApplicationsController.getApplication', // Get Application Info
  // 'POST /beta/app/:appId/item': 'ApplicationsController.addItem', // Add an item for registration in application
  // 'GET /beta/app/:appId/item/:itemId': 'ApplicationsController.getItem', // Get item
  // 'GET /beta/app/:appId/items': 'ApplicationsController.getItems', // Get items
  // 'POST /beta/app/:appId/item/:itemId': 'ApplicationsController.editItem', // Edit an item
  // 'POST /beta/app/:appId/item/:itemId/delete': 'ApplicationsController.deleteItem', // Delete an item


  /** Player API */
  // 'POST /beta/player/new': 'PlayersController.addPlayer', // Register a player into the application/game
  // 'POST /beta/player/:playerId': 'PlayersController.editPlayer', // Edit a player into the application/game
  // 'GET /beta/player/:playerId': 'PlayersController.getPlayer', // GET a player into the application/game
  // 'GET /beta/player/:appId': 'PlayersController.getPlayers', // GET ALL players joined to the game
  // 'GET /beta/player/:playerId/transactions': 'PlayersController.getPlayerTransactions', // GET a player into the application/game
  // 'GET /beta/player/:playerId/balance': 'PlayersController.getPlayerBalance', // GET a player into the application/game
  // 'POST /beta/player/:playerId/reward': 'PlayersController.rewardPlayer', // Edit a player into the application/game
  // 'POST /beta/player/:playerId/trade/:player2Id': 'PlayersController.playerToPlayerTrade', // Allow players to trade items/FORCE between each other
  // 'POST /beta/player/:playerId/trade/:appId': 'PlayersController.playerToAppTrade', // Allow players to trade items/FORCE within the game



  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};

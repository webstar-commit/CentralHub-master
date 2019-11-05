/**
 * GameController
 *
 * @description :: Server-side logic for Game applications
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

  
	/**
	* @api {post} /beta/app/new Register a new Game application
	* @apiName RegisterGame
	* @apiGroup Game
	*
	* @apiParam {String} developerId
	* @apiParam {String} name Games
	* @apiParam {String} platformType platform
	* @apiParam {String} [description]
	*
	* @apiSuccess {String} id gameId of the new registered game
	* @apiSuccess {String} name Name provided by the game developer
	* @apiSuccess {String} publicKey Public API integration key for developer
	* @apiSuccess {String} privateSecret Private API integration secret for developer
	*
	*
	* @apiSuccessExample Success-Response:
	*     HTTP/1.1 200 OK
	*     {
	*       "id": "1234",
	*       "name": "Raid Party",
	*       "publicKey": "oiyawd98y3098ydh089hf308h",
	*       "privateKey": "FEFEJIO3YUF890UJ039J0-9U9UIO",
	*     }
	*
	* @apiError RegisterGameError The id of the User was not found.
	*
	* @apiErrorExample Error-Response:
	*     HTTP/1.1 404 Not Found
	*     {
	*       "error": "UserNotFound"
	*     }
	*/
	createNewApplication: function (req, res) {

	},
	
	
	
	/**
	* MUST BE AUTHENTICATED
	* Edit an Application (Developers game/application)
	* This should change some details the user entered when creating a new application
	*/
	editApplication: function (req, res) {
		/** PARAMS REQUIRED: Developer ID, APP ID */
		/** PARAMS OPTIONAL: Application Name, Developer ID, Game Platform Type, Description */
	},
	
	
	
	/**
	* MUST BE AUTHENTICATED
	* GET an Application (Developers game/application)
	* This should return full details to the developer about their application
	* It should give them number of players registered, FORCE token count in the applications wallet, wallet address
	*/
	getApplication: function (req, res) {
		/** PARAMS REQUIRED: Developer ID, APP ID */
	},
	
	
	
	/**
	* MUST BE AUTHENTICATED
	* Add an ITEM to the games repository
	*/
	addItem: function (req, res) {
		/** PARAMS REQUIRED: Developer ID, APP ID */
	},
	
	
	
	/**
	* MUST BE AUTHENTICATED
	* Get an Item details
	*/
	getItem: function (req, res) {
		/** PARAMS REQUIRED: APP ID, Item ID */
	},
	
	
	
	/**
	* MUST BE AUTHENTICATED
	* Get all items for game
	*/
	getItems: function (req, res) {
		/** PARAMS REQUIRED: APP ID */
	},
	
	
	
	/**
	* MUST BE AUTHENTICATED
	* Edit an item
	*/
	editItem: function (req, res) {
		/** PARAMS REQUIRED: APP ID, Item ID */
	},

	
	
	/**
	* MUST BE AUTHENTICATED
	* Delete an item from game
	*/
	deleteItem: function (req, res) {
		/** PARAMS REQUIRED: APP ID, Item ID */
	},
	
	
};
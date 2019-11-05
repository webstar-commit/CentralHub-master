/**
 * PlayerController
 *
 * @description :: Server-side logic for managing Pages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

  
	/**
	* MUST BE AUTHENTICATED - DEVELOPER KEYS?
	* Add a new player to the game application
	*/
	addPlayer: function (req, res) {
		/** PARAMS REQUIRED: App ID, Email, Username */
		/** PARAMS OPTIONAL:  */
		/** Returns: */
	},
	
	
  
	/**
	* MUST BE AUTHENTICATED - DEVELOPER KEYS?
	* Edit a player
	*/
	editPlayer: function (req, res) {
		/** PARAMS REQUIRED: App ID, Email, Username */
		/** PARAMS OPTIONAL: (un)block player (boolean), */
	},
	
	
	
	/**
	* MUST BE AUTHENTICATED - DEVELOPER KEYS?
	* Get a player
	*/
	getPlayer: function (req, res) {
		/** PARAMS REQUIRED: App ID, PlayerID */
	},
	
	
	/**
	* MUST BE AUTHENTICATED - DEVELOPER KEYS?
	* Get all players (summary)
	*/
	getPlayers: function (req, res) {
		/** PARAMS REQUIRED: App ID */
	},
	
	
	
	/**
	* MUST BE AUTHENTICATED - DEVELOPER KEYS?
	* Get a players transaction history (up to last 100 items - needs to be paginated)
	*/
	getPlayerTransactions: function (req, res) {
		/** PARAMS REQUIRED: App ID, Player ID */
	},
	
	
	
	/**
	* MUST BE AUTHENTICATED - DEVELOPER KEYS?
	* Get a players FORCE balance
	*/
	getPlayerBalance: function (req, res) {
		/** PARAMS REQUIRED: App ID, Player ID */
	},
	
	
	
	/**
	* MUST BE AUTHENTICATED - DEVELOPER KEYS?
	* Reward a player
	*/
	rewardPlayer: function (req, res) {
		/** PARAMS REQUIRED: App ID, Player ID, FORCE amount */
		/** PARAMS OPTIONAL: Reason why */
	},
	
	
	
	/**
	* MUST BE AUTHENTICATED - DEVELOPER KEYS?
	* Trade from one player to another
	* The player ID in path is sending to player 2
	*/
	playerToPlayerTrade: function (req, res) {
		/** PARAMS REQUIRED: App ID, Player ID, Player 2 ID, FORCE sent, Item ID */
	},
	
	
	
	/**
	* MUST BE AUTHENTICATED - DEVELOPER KEYS?
	* Trade from one player to the game/app
	* The player ID i sending to the APP
	*/
	playerToAppTrade: function (req, res) {
		/** PARAMS REQUIRED: App ID, Player ID, Player 2 ID, FORCE sent, Item ID */
	},
	
	
	
	/**
	* MUST BE AUTHENTICATED - DEVELOPER KEYS?
	* Trade from the App to a player
	* The app ID is sending to the player
	*/
	appToPlayerTrade: function (req, res) {
		/** PARAMS REQUIRED: App ID, Player ID, FORCE sent, Item ID */
	},
	
};
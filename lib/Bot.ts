import * as SteamUser from 'steam-user';
import * as SteamCommunity from 'steamcommunity';
import * as SteamTotp from 'steam-totp';
import * as TradeOfferManager from 'steam-tradeoffer-manager';
import * as fs from 'fs-extra';

export default class Bot {

	community: any;
	manager: any;
	client: any;
	logger: any;
	username: any;
	password: any;
	sharedsecret: any;
	identitysecret: any;

	public login(loginDetails: any){
		this.username = loginDetails.username;
		this.password = loginDetails.password;
		this.sharedsecret = loginDetails.shared;
		this.identitysecret = loginDetails.identity;

		let client = new SteamUser();
		let manager = new TradeOfferManager({
	        "steam": this.client, // Polling every 30 seconds is fine since we get notifications from Steam
	        "domain": "localhost", // Our domain is example.com
	        "language": "en", // We want English item descriptions
	        "cancelTime": "300000", //Automatically cancel trades after 90 sec
	        "pendingCancelTime": "300000", //Automatically cancel non confirmed trades after 300 seconds
	        "pollInterval": "5000" //Check for new stuff every 5 second
	    });
	    let community = new SteamCommunity();

		return new Promise((resolve, reject) => {
			let logOnOptions = {
		        "accountName": this.username,
		        "password": this.password,
		        "twoFactorCode": SteamTotp.getAuthCode(this.sharedsecret)
		    };

		    client.logOn(logOnOptions);

		    client.on('loggedOn', function() {
		        console.log("Logged into Steam");
		    });

		    client.on('webSession', function(sessionID, cookies) {

		        community.setCookies(cookies);
		        community.startConfirmationChecker(10000, this.identitysecret); // Checks and accepts confirmations every 10 seconds - identitysecret

		        //Set the bots name to the site
		        let steamprofilesettings = {
		          "name": "BOT#",
		          "realName": "Bot"
		        };
		        //Edit the profile with above settings
		        community.editProfile(steamprofilesettings, function(err) {
		            if(err) {
		                console.log(err);
		            }
		        });

				resolve(cookies);
		   	});
	    }).then((cookies) => {
	    	return new Promise((resolve, reject) => {
			    manager.setCookies(cookies, function(err) {
		            if (err) {
		                console.log(err);
		                return;
		            }
		            console.log("Got API key: " + manager.apiKey + ' BOT');
		            let bot = {
		            	client: client,
						manager: manager,
						community: community,
						steamid: client.steamID.getSteamID64(),
		            }

		           	resolve(bot);
		        });
			});
	    });
	}

	public events(manager: any, event: any)
	{
		return new Promise((resolve,reject) => {
			manager.on(event, function(offer) {
		        resolve(offer);
		    });
		})
	}
}
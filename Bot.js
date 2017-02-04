"use strict";
var SteamUser = require("steam-user");
var SteamCommunity = require("steamcommunity");
var SteamTotp = require("steam-totp");
var TradeOfferManager = require("steam-tradeoffer-manager");
var Bot = (function () {
    function Bot() {
    }
    Bot.prototype.login = function (loginDetails) {
        var _this = this;
        this.username = loginDetails.username;
        this.password = loginDetails.password;
        this.sharedsecret = loginDetails.shared;
        this.identitysecret = loginDetails.identity;
        var client = new SteamUser();
        var manager = new TradeOfferManager({
            "steam": this.client,
            "domain": "localhost",
            "language": "en",
            "cancelTime": "300000",
            "pendingCancelTime": "300000",
            "pollInterval": "5000" //Check for new stuff every 5 second
        });
        var community = new SteamCommunity();
        return new Promise(function (resolve, reject) {
            var logOnOptions = {
                "accountName": _this.username,
                "password": _this.password,
                "twoFactorCode": SteamTotp.getAuthCode(_this.sharedsecret)
            };
            client.logOn(logOnOptions);
            client.on('loggedOn', function () {
                console.log("Logged into Steam");
            });
            client.on('webSession', function (sessionID, cookies) {
                community.setCookies(cookies);
                community.startConfirmationChecker(10000, this.identitysecret); // Checks and accepts confirmations every 10 seconds - identitysecret
                //Set the bots name to the site
                var steamprofilesettings = {
                    "name": "BOT#",
                    "realName": "Bot"
                };
                //Edit the profile with above settings
                community.editProfile(steamprofilesettings, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                resolve(cookies);
            });
        }).then(function (cookies) {
            return new Promise(function (resolve, reject) {
                manager.setCookies(cookies, function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log("Got API key: " + manager.apiKey + ' BOT');
                    var bot = {
                        client: client,
                        manager: manager,
                        community: community,
                        steamid: client.steamID.getSteamID64()
                    };
                    resolve(bot);
                });
            });
        });
    };
    Bot.prototype.events = function (manager, event) {
        return new Promise(function (resolve, reject) {
            manager.on(event, function (offer) {
                resolve(offer);
            });
        });
    };
    return Bot;
}());
exports.__esModule = true;
exports["default"] = Bot;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QkFDdkQsSUFBSSxHQUFHLEdBQUc7d0JBQ1QsTUFBTSxFQUFFLE1BQU07d0JBQ3ZCLE9BQU8sRUFBRSxPQUFPO3dCQUNoQixTQUFTLEVBQUUsU0FBUzt3QkFDcEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO3FCQUM3QixDQUFBO29CQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDakIsQ0FBQyxDQUFDLENBQUM7WUFDVixDQUFDLENBQUMsQ0FBQztRQUNELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLG9CQUFNLEdBQWIsVUFBYyxPQUFZLEVBQUUsS0FBVTtRQUVyQyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUMsTUFBTTtZQUNqQyxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxVQUFTLEtBQUs7Z0JBQ3pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuQixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFBO0lBQ0gsQ0FBQztJQUNGLFVBQUM7QUFBRCxDQXpGQSxBQXlGQyxJQUFBIiwiZmlsZSI6IkJvdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFN0ZWFtVXNlciBmcm9tICdzdGVhbS11c2VyJztcclxuaW1wb3J0ICogYXMgU3RlYW1Db21tdW5pdHkgZnJvbSAnc3RlYW1jb21tdW5pdHknO1xyXG5pbXBvcnQgKiBhcyBTdGVhbVRvdHAgZnJvbSAnc3RlYW0tdG90cCc7XHJcbmltcG9ydCAqIGFzIFRyYWRlT2ZmZXJNYW5hZ2VyIGZyb20gJ3N0ZWFtLXRyYWRlb2ZmZXItbWFuYWdlcic7XHJcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzLWV4dHJhJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvdCB7XHJcblxyXG5cdGNvbW11bml0eTogYW55O1xyXG5cdG1hbmFnZXI6IGFueTtcclxuXHRjbGllbnQ6IGFueTtcclxuXHRsb2dnZXI6IGFueTtcclxuXHR1c2VybmFtZTogYW55O1xyXG5cdHBhc3N3b3JkOiBhbnk7XHJcblx0c2hhcmVkc2VjcmV0OiBhbnk7XHJcblx0aWRlbnRpdHlzZWNyZXQ6IGFueTtcclxuXHJcblx0cHVibGljIGxvZ2luKGxvZ2luRGV0YWlsczogYW55KXtcclxuXHRcdHRoaXMudXNlcm5hbWUgPSBsb2dpbkRldGFpbHMudXNlcm5hbWU7XHJcblx0XHR0aGlzLnBhc3N3b3JkID0gbG9naW5EZXRhaWxzLnBhc3N3b3JkO1xyXG5cdFx0dGhpcy5zaGFyZWRzZWNyZXQgPSBsb2dpbkRldGFpbHMuc2hhcmVkO1xyXG5cdFx0dGhpcy5pZGVudGl0eXNlY3JldCA9IGxvZ2luRGV0YWlscy5pZGVudGl0eTtcclxuXHJcblx0XHRsZXQgY2xpZW50ID0gbmV3IFN0ZWFtVXNlcigpO1xyXG5cdFx0bGV0IG1hbmFnZXIgPSBuZXcgVHJhZGVPZmZlck1hbmFnZXIoe1xyXG5cdCAgICAgICAgXCJzdGVhbVwiOiB0aGlzLmNsaWVudCwgLy8gUG9sbGluZyBldmVyeSAzMCBzZWNvbmRzIGlzIGZpbmUgc2luY2Ugd2UgZ2V0IG5vdGlmaWNhdGlvbnMgZnJvbSBTdGVhbVxyXG5cdCAgICAgICAgXCJkb21haW5cIjogXCJsb2NhbGhvc3RcIiwgLy8gT3VyIGRvbWFpbiBpcyBleGFtcGxlLmNvbVxyXG5cdCAgICAgICAgXCJsYW5ndWFnZVwiOiBcImVuXCIsIC8vIFdlIHdhbnQgRW5nbGlzaCBpdGVtIGRlc2NyaXB0aW9uc1xyXG5cdCAgICAgICAgXCJjYW5jZWxUaW1lXCI6IFwiMzAwMDAwXCIsIC8vQXV0b21hdGljYWxseSBjYW5jZWwgdHJhZGVzIGFmdGVyIDkwIHNlY1xyXG5cdCAgICAgICAgXCJwZW5kaW5nQ2FuY2VsVGltZVwiOiBcIjMwMDAwMFwiLCAvL0F1dG9tYXRpY2FsbHkgY2FuY2VsIG5vbiBjb25maXJtZWQgdHJhZGVzIGFmdGVyIDMwMCBzZWNvbmRzXHJcblx0ICAgICAgICBcInBvbGxJbnRlcnZhbFwiOiBcIjUwMDBcIiAvL0NoZWNrIGZvciBuZXcgc3R1ZmYgZXZlcnkgNSBzZWNvbmRcclxuXHQgICAgfSk7XHJcblx0ICAgIGxldCBjb21tdW5pdHkgPSBuZXcgU3RlYW1Db21tdW5pdHkoKTtcclxuXHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRsZXQgbG9nT25PcHRpb25zID0ge1xyXG5cdFx0ICAgICAgICBcImFjY291bnROYW1lXCI6IHRoaXMudXNlcm5hbWUsXHJcblx0XHQgICAgICAgIFwicGFzc3dvcmRcIjogdGhpcy5wYXNzd29yZCxcclxuXHRcdCAgICAgICAgXCJ0d29GYWN0b3JDb2RlXCI6IFN0ZWFtVG90cC5nZXRBdXRoQ29kZSh0aGlzLnNoYXJlZHNlY3JldClcclxuXHRcdCAgICB9O1xyXG5cclxuXHRcdCAgICBjbGllbnQubG9nT24obG9nT25PcHRpb25zKTtcclxuXHJcblx0XHQgICAgY2xpZW50Lm9uKCdsb2dnZWRPbicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0ICAgICAgICBjb25zb2xlLmxvZyhcIkxvZ2dlZCBpbnRvIFN0ZWFtXCIpO1xyXG5cdFx0ICAgIH0pO1xyXG5cclxuXHRcdCAgICBjbGllbnQub24oJ3dlYlNlc3Npb24nLCBmdW5jdGlvbihzZXNzaW9uSUQsIGNvb2tpZXMpIHtcclxuXHJcblx0XHQgICAgICAgIGNvbW11bml0eS5zZXRDb29raWVzKGNvb2tpZXMpO1xyXG5cdFx0ICAgICAgICBjb21tdW5pdHkuc3RhcnRDb25maXJtYXRpb25DaGVja2VyKDEwMDAwLCB0aGlzLmlkZW50aXR5c2VjcmV0KTsgLy8gQ2hlY2tzIGFuZCBhY2NlcHRzIGNvbmZpcm1hdGlvbnMgZXZlcnkgMTAgc2Vjb25kcyAtIGlkZW50aXR5c2VjcmV0XHJcblxyXG5cdFx0ICAgICAgICAvL1NldCB0aGUgYm90cyBuYW1lIHRvIHRoZSBzaXRlXHJcblx0XHQgICAgICAgIGxldCBzdGVhbXByb2ZpbGVzZXR0aW5ncyA9IHtcclxuXHRcdCAgICAgICAgICBcIm5hbWVcIjogXCJCT1QjXCIsXHJcblx0XHQgICAgICAgICAgXCJyZWFsTmFtZVwiOiBcIkJvdFwiXHJcblx0XHQgICAgICAgIH07XHJcblx0XHQgICAgICAgIC8vRWRpdCB0aGUgcHJvZmlsZSB3aXRoIGFib3ZlIHNldHRpbmdzXHJcblx0XHQgICAgICAgIGNvbW11bml0eS5lZGl0UHJvZmlsZShzdGVhbXByb2ZpbGVzZXR0aW5ncywgZnVuY3Rpb24oZXJyKSB7XHJcblx0XHQgICAgICAgICAgICBpZihlcnIpIHtcclxuXHRcdCAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0ICAgICAgICAgICAgfVxyXG5cdFx0ICAgICAgICB9KTtcclxuXHJcblx0XHRcdFx0cmVzb2x2ZShjb29raWVzKTtcclxuXHRcdCAgIFx0fSk7XHJcblx0ICAgIH0pLnRoZW4oKGNvb2tpZXMpID0+IHtcclxuXHQgICAgXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHQgICAgbWFuYWdlci5zZXRDb29raWVzKGNvb2tpZXMsIGZ1bmN0aW9uKGVycikge1xyXG5cdFx0ICAgICAgICAgICAgaWYgKGVycikge1xyXG5cdFx0ICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcblx0XHQgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cdFx0ICAgICAgICAgICAgfVxyXG5cdFx0ICAgICAgICAgICAgY29uc29sZS5sb2coXCJHb3QgQVBJIGtleTogXCIgKyBtYW5hZ2VyLmFwaUtleSArICcgQk9UJyk7XHJcblx0XHQgICAgICAgICAgICBsZXQgYm90ID0ge1xyXG5cdFx0ICAgICAgICAgICAgXHRjbGllbnQ6IGNsaWVudCxcclxuXHRcdFx0XHRcdFx0bWFuYWdlcjogbWFuYWdlcixcclxuXHRcdFx0XHRcdFx0Y29tbXVuaXR5OiBjb21tdW5pdHksXHJcblx0XHRcdFx0XHRcdHN0ZWFtaWQ6IGNsaWVudC5zdGVhbUlELmdldFN0ZWFtSUQ2NCgpLFxyXG5cdFx0ICAgICAgICAgICAgfVxyXG5cclxuXHRcdCAgICAgICAgICAgXHRyZXNvbHZlKGJvdCk7XHJcblx0XHQgICAgICAgIH0pO1xyXG5cdFx0XHR9KTtcclxuXHQgICAgfSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZXZlbnRzKG1hbmFnZXI6IGFueSwgZXZlbnQ6IGFueSlcclxuXHR7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUscmVqZWN0KSA9PiB7XHJcblx0XHRcdG1hbmFnZXIub24oZXZlbnQsIGZ1bmN0aW9uKG9mZmVyKSB7XHJcblx0XHQgICAgICAgIHJlc29sdmUob2ZmZXIpO1xyXG5cdFx0ICAgIH0pO1xyXG5cdFx0fSlcclxuXHR9XHJcbn0iXX0=

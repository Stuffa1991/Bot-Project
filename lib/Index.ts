import Bot from "./Bot";

let newBot = new Bot();

let loginDetails = {
	username: '',
	password: '',
	shared: '',
	identity: ''
}

let myBot = newBot.login(loginDetails).then((bot) => {
	newBot.events(bot.manager,'sentOfferChanged').then((offer) => {
		console.log('sentOfferChanged');
	});

	newBot.events(bot.manager, 'newOffer').then((offer) => {
		console.log('newOffer');
	});
});
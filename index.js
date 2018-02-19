require('dotenv').load();

const request = require('request');
const imessage = require('osa-imessage');

const startLoop = setInterval(() => { loopFn() }, 300000); //sets to ping very 5 minutes
const stopLoop = () => { clearInterval(startLoop); }


let loopFn = () => {
	request(`http://www.lasership.com/track/${process.env.TRACKING_NUMBER}/json`, (err, res, body) => {
		console.log(`statusCode: ${res.statusCode}, Time: ${new Date(new Date().getTime() + process.env.UTC_OFFSET * 3600 * 1000).toUTCString().replace(/ GMT$/, "")}`);
		try {

			if (res.statusCode === 429) {
				console.log(`You've been rate limited. Wait a minute then try again.`);
				console.log(res.headers);
				imessage.send(process.env.IMESSAGE_ADDRESS, `You've been rate limited.\n${res.headers}`);
				stopLoop();
			}
			else if (body.includes("Delivered")) {
				console.log(`Your groceries were delivered at ${new Date(new Date().getTime() + process.env.UTC_OFFSET * 3600 * 1000).toUTCString().replace(/ GMT$/, "")}`);
				imessage.send(process.env.IMESSAGE_ADDRESS, `Your groceries were delivered on ${new Date(new Date().getTime() + process.env.UTC_OFFSET * 3600 * 1000).toUTCString().replace(/ GMT$/, "")}`);
				stopLoop();
			}
			else {
				console.log(`still no groceries`);
			}

		}//try
		catch (err) {
			console.log(`error: ${err.message},`);
		}// catch
	});//request
}//loopFn
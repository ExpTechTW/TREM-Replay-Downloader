const fetch = require("node-fetch");
const fs = require("fs");

const config = {
	key        : "",
	start_time : "2023-04-01 08:00:30",
	end_time   : "2023-04-01 08:00:35",
};

let lock = false;
let time = new Date(config.start_time).getTime();
const _end_time = new Date(config.end_time).getTime();

if (!fs.existsSync("./replay_data")) fs.mkdirSync("./replay_data");

const clock = setInterval(() => {
	if (time > _end_time) {
		clearInterval(clock);
		console.log("Finish!");
		return;
	}
	if (lock) return;
	lock = true;
	fetch(`https://exptech.com.tw/api/v2/trem/rts?time=${time}`)
		.then(res => res.json())
		.then(res => {
			fs.writeFile(`./replay_data/${Math.round(time / 1000)}.json`, JSON.stringify(res), () => {
				time += 1000;
				lock = false;
			});
		})
		.catch(err => {
			lock = false;
			console.log(err.message);
		});
}, 1000);
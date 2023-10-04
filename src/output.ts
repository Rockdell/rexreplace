let font: any = {};
font.yellow = font.red = font.green = font.gray = (str) => str;
// check for node version supporting chalk - if so overwrite `font`
//font = import('chalk');

let conf: any = null;

export const outputConfig = function (_conf) {
	conf = _conf;
};

export const info = function (msg, data = '') {
	if (conf?.quiet || conf?.quietTotal) {
		return;
	}
	if (conf?.output || conf?.outputMatch) {
		return console.error.apply(this, [font.gray(msg), data].filter(Boolean));
	}
	console.log.apply(this, [msg, data].filter(Boolean));
};

export const chat = function (msg, data = '') {
	if (conf?.verbose && !(conf?.output || conf?.outputMatch)) {
		info(msg, data);
	} else {
		debug([msg, data].filter(Boolean).join(' '));
	}
};

export const error = function (msg, data = '') {
	if (!conf?.quietTotal) {
		console.error.apply(this, [' ❌', font.red(msg), data].filter(Boolean));
	}
	if (conf?.bail) {
		return kill();
	}

	return false;
};

export const warn = function (msg, data = '') {
	if (!conf?.quiet && !conf?.quietTotal) {
		console.warn.apply(this, [' 🟡', font.yellow(msg), data].filter(Boolean));
	}

	return false;
};

export const die = function (msg = '', data = '', displayHelp = false) {
	if (displayHelp && !conf?.quietTotal) {
		conf?.showHelp();
	}
	msg && error(msg, data);
	kill();
};

export function debug(...data) {
	if (conf?.debug) {
		console.error(font.gray(JSON.stringify(data, null, 4)));
	}
}

export function step(data) {
	if (conf?.verbose && !(conf?.output || conf?.quiet || !conf?.quiet || !conf?.quietTotal)) {
		console.error(font.gray(data));
	}
}

function kill(error = 1, msg = '') {
	if (!conf?.quietTotal && msg) {
		console.error(+msg);
	}
	process.exit(+error);
}

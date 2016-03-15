const dgram = require('dgram');
const server = dgram.createSocket('udp4');
var binary = require('binary');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(3000);

server.on('error', (err) => {
	console.log(`server error:\n${err.stack}`);
	server.close();
});

server.on('message', (packet, remote) => {
	var data = parse(packet);
	console.log(data);
	io.emit('data', data);
});

function parse(packet) {
	var uInts = [];
	var resultArr = [];

	var index = 0;
	for (var value of packet.values()) {
		uInts[index] = value;
		index += 1;
	}

	for (var i = 0; i < (packet.length / 8); i++) {
		var binary = [];
		for (var j = 0 + (8 * i); j < 8 + (8 * i); j++) {
			var currentNumber = uInts[j];
			var count = 0;

			while (currentNumber > 0) {
				var bit = currentNumber % 2;
				var quotient = Math.trunc(currentNumber / 2);
				binary.unshift(bit);
				currentNumber = quotient;
				count += 1;
			}

			while (count < 8) {
				binary.unshift(0);
				count++;
			}
		}

		var exponent = 0;
		for (var e = 0, k = 11; k > 0; k--, e++) {
			exponent = exponent + binary[k] * (Math.pow(2, e));
		}
		exponent = exponent-1023;

		var mantissa = 0;
		for (var e = -1, k = 12; k < 64; k++, e--){
			mantissa = mantissa + binary[k] * (Math.pow(2, e));
		}

		var decimal = (1 + mantissa) * Math.pow(2, exponent);

		if (binary[0] === 1){
			decimal = -decimal;
		}

		// format output depending on value
		switch(i) {
			// velocity
			case 0:
				resultArr[i] = Math.round(decimal * 100) / 100;
				break;
			// acceleration
			case 1:
				resultArr[i] = decimal.toFixed(2);
				break;
			// x-coordinate
			case 2:
				resultArr[i] = decimal.toFixed(2);
				break;
			// y-coordinate
			case 3:
				resultArr[i] = decimal.toFixed(2);
				break;
			// no format necessary
			default:
				resultArr[i] = decimal;
				break;
		}
	}
	return resultArr;
}

server.bind(41234);
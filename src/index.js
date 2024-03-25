const readline = require('readline')

const io = require('socket.io-client')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

function fetchIP() {
	return new Promise(function (resolve) {
		rl.question(
			'Whats the IP Address of the server:\nType "enter" for 127.0.0.1\n',
			(address) => {
				if (address.length == 0) return resolve('127.0.0.1')

				resolve(address)
			}
		)
	})
}

function fetchPort() {
	return new Promise(function (resolve) {
		rl.question('Whats the Port of the server: ', (port) => {
			resolve(port)

			console.log()
		})
	})
}

function emitEvent(socket) {
	console.log()

	rl.question('Whats the event name: ', (event) => {
		socket.emit(event)

		console.log(`\n"${event}" emitted.`)

		return fetchNextInput(socket)
	})
}

function fetchNextInput(socket) {
	console.log()

	rl.question(
		'Commands:\n\\d to disconnect\n\\r to reconnect\n\\e to emit a event\n\n',
		(response) => {
			if (response.toLowerCase().indexOf('\\r') !== -1) {
				socket.disconnect()

				console.log()

				return runCLI()
			} else if (response.toLowerCase().indexOf('\\d') !== -1) {
				socket.disconnect()

				return process.exit()
			} else if (response.toLowerCase().indexOf('\\e') !== -1) {
				return emitEvent(socket)
			} else {
				return fetchNextInput(socket)
			}
		}
	)
}

async function runCLI() {
	const IP = await fetchIP()
	const Port = await fetchPort()

	try {
		const socket = io(`http://${IP}:${Port}`)

		console.log('Connected to Socket.io Server.')

		fetchNextInput(socket)
	} catch (err) {
		console.error(err)
	}
}

runCLI()

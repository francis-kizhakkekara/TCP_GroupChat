// Client for the chat
// Run this in multiple terminals at the same time to chat with other terminals
const net = require("net");

// Set the port
const port = 8000;
// Set the  ip address of the server. Example "localhost" or "192.168.56.1"
const serverIP_addr = "localhost";

const socket1 = net.createConnection(port, serverIP_addr);

socket1.pipe(process.stdout); // Pipe data from the socket to stdout
process.stdin.pipe(socket1); // Pipe data from stdin to the socket
socket1.on("close", () => process.exit()); // Quit when the socket closes.

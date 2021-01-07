// Group Chat using TCP/IP
const { timeStamp } = require("console");
const net = require("net");
const port = 8000;
const userGroupID = new Map();
const groupUsers = new Map();
let userID = 0;

const server = net.createServer(function (socket) {
    userID++;
    socket.userID = "User" + userID;

    // Log it to the server output
    console.log(socket.userID + " joined this chat.");

    // Welcome user to the Group Chat
    socket.write(
        `Welcome to the Group chat, ${socket.userID}\n` +
            `Enter the Group ID:  `
    );

    // When client sends data
    socket.on("data", function (data) {
        const message = data.toString();

        // IF user not associated to any group, Map(userID to groupID) in userGroupID
        if (!userGroupID[socket.userID]) {
            userGroupID[socket.userID] = message;
            console.log(userGroupID);

            // If no other user present create a new array
            if (!groupUsers[message]) groupUsers[message] = [socket];
            else groupUsers[message].push(socket);

            console.log(socket.userID + ":" + message);
        }
        // else broadcast message the group members
        else {
            const broadcastMsg = socket.userID + "> " + message;
            broadcastToGroup(socket, broadcastMsg);

            // Log groupID, userID and message to server
            console.log(
                userGroupID[socket.userID] +
                    ": " +
                    socket.userID +
                    "> " +
                    message
            );
        }
    });

    // When user leaves
    socket.on("end", function () {
        const message = socket.userID + " left this chat\n";

        // Log it to the server output
        console.log(message);

        // Remove socket from maps
        removeSocket(socket);

        // Notify all users in group
        broadcastToGroup(socket, message);
    });

    // When socket gets errors
    socket.on("error", function (error) {
        console.log("Socket error: ", error.message);
    });
});

// Broadcast to others in group, excluding the sender
function broadcastToGroup(from, message) {
    groupUsers[userGroupID[from.userID]].forEach((socket) => {
        if (from !== socket) socket.write(message);
    });
}

// Remove disconnected client from sockets both maps
function removeSocket(socket) {
    const temp = userGroupID[socket];
    userGroupID.delete(socket);
    groupUsers[temp].splice(groupUsers[temp].indexOf(socket), 1);
}

// Error with the server
server.on("error", function (error) {
    console.log("Sever error: ", error.message);
});

// Set the port where the server listen
server.listen(port, function () {
    console.log("Server listening at http://localhost:" + port);
});

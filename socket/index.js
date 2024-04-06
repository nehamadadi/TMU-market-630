//Setup the messaging socket
const io = require("socket.io")(3002, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// Holds online users
let activeUsers = [];

io.on("connection", (socket) => {
  // new-user-add: add user onto the socket and log them as active
  socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    //send users to clientside
    io.emit("get-users", activeUsers);
  });

  //disconnect: remove user from the active users
  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User disconnected!", activeUsers);
    io.emit("get-users", activeUsers);
  });

  //send-message: handle sending messages and send the receive message in realtime
  //only if the other user is active
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId);
    console.log("Data", data);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
    }
  });
});

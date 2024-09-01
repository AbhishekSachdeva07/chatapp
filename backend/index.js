import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Ensure this is the correct frontend URL
    credentials: true
}));

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow requests from the frontend
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log("User Connected -->", socket.id);
    io.emit("new");

    socket.broadcast.emit("newuser", {
        type: "newuser",
        message: "New User Joined."
    });

    socket.on("message", (message) => {
        console.log("Received message on server:", message);
        socket.broadcast.emit('message', {
            type: "otheruser",
            message: message.message
        });
    });

    socket.on("disconnect", (reason) => {
        console.log("User Disconnected -->", socket.id, "Reason:", reason);
    });
});

const listen = async () => {
    try {
        server.listen(3000, () => {
            console.log("App listening at port 3000");
        });
    } catch (error) {
        console.log(error);
    }
};

listen();

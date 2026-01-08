const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve frontend files
app.use(express.static("public"));

// Supported stocks
const STOCKS = ["AAPL", "MSFT", "NFLX", "NVDA", "JPM"];

// Initial prices
let stockPrices = {
  AAPL: 180,
  MSFT: 320,
  NFLX: 450,
  NVDA: 900,
  JPM: 160
};

// Update prices every second
setInterval(() => {
  STOCKS.forEach(stock => {
    const change = Math.floor(Math.random() * 10 - 5);
    stockPrices[stock] += change;
  });

  // Send updated prices to all clients
  io.emit("priceUpdate", stockPrices);
}, 1000);

// Handle client connections
io.on("connection", socket => {
  console.log("User connected:", socket.id);

  // Send initial prices
  socket.emit("priceUpdate", stockPrices);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
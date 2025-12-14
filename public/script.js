// Connect to server
const socket = io();

// Supported stocks
const stocks = ["AAPL", "MSFT", "NFLX", "NVDA", "JPM"];

// Store subscribed stocks
const subscribedStocks = new Set();

// Store previous prices for ▲ / ▼
const previousPrices = {};

// Show logged-in user email
const userEmail = localStorage.getItem("userEmail");
document.getElementById("user").innerText = userEmail;

// Logout button
document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("userEmail");
  window.location.href = "index.html";
};

// UI elements
const buttonDiv = document.getElementById("stock-buttons");
const priceList = document.getElementById("price-list");
const stockCountText = document.getElementById("stockCount");

// Create stock buttons
stocks.forEach(stock => {
  const btn = document.createElement("button");
  btn.innerText = stock;

  btn.onclick = () => {
    subscribedStocks.add(stock);

    // Update subscribed count
    stockCountText.innerText =
      `Subscribed Stocks: ${subscribedStocks.size} / ${stocks.length}`;

    // Disable button
    btn.disabled = true;
  };

  buttonDiv.appendChild(btn);
});

// Receive live price updates
socket.on("priceUpdate", prices => {
  priceList.innerHTML = "";

  if (subscribedStocks.size === 0) {
    priceList.innerHTML = "<li>Please select a stock to view live prices.</li>";
    return;
  }

  subscribedStocks.forEach(stock => {
    const li = document.createElement("li");

    let arrow = "";
    if (previousPrices[stock] !== undefined) {
      if (prices[stock] > previousPrices[stock]) {
        arrow = " ▲";
        li.style.color = "green";
      } else if (prices[stock] < previousPrices[stock]) {
        arrow = " ▼";
        li.style.color = "red";
      }
    }

    li.innerText = `${stock}: $${prices[stock]}${arrow}`;
    priceList.appendChild(li);

    previousPrices[stock] = prices[stock];
  });
});

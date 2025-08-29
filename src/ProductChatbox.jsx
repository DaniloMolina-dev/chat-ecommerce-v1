import React, { useState } from "react";

// Dummy product catalog with test images (Unsplash placeholders)
const products = [
  { id: 1, name: "Green Sneakers", size: 42, color: "green", price: "$89", image: "https://via.placeholder.com/400x300.png?text=Sneakers" },
  { id: 2, name: "Blue Running Shoes", size: 42, color: "blue", price: "$99", image: "https://via.placeholder.com/400x300.png?text=Sneakers" },
  { id: 3, name: "Green Sandals", size: 41, color: "green", price: "$49", image: "https://via.placeholder.com/400x300.png?text=Sneakers" },
  { id: 4, name: "Black Sneakers", size: 42, color: "black", price: "$95", image: "https://via.placeholder.com/400x300.png?text=Sneakers" },
];

export default function ProductChatbox() {
  const [messages, setMessages] = useState([
    { sender: "bot", type: "text", text: "👋 Hi! What product are you looking for today?" },
  ]);
  const [input, setInput] = useState("");

  // Improved query parser: matches if ANY word from the query appears in product fields
  const searchProducts = (query) => {
    const words = query.toLowerCase().split(/\s+/);
    return products.filter((p) => {
      const searchable = `${p.name} ${p.color} ${p.size}`.toLowerCase();
      return words.some((word) => searchable.includes(word));
    });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { sender: "user", type: "text", text: input }]);

    // Search for products
    const results = searchProducts(input);

    if (results.length > 0) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", type: "text", text: `I found ${results.length} option(s) that might interest you 👇` },
        ...results.map((p) => ({ sender: "bot", type: "product", product: p })),
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", type: "text", text: "😔 Sorry, I couldn’t find an exact match. Maybe try another color or size?" },
      ]);
    }

    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-2xl border flex flex-col">
      <div className="bg-blue-600 text-white p-3 rounded-t-2xl font-bold">
        🛍️ Product Assistant
      </div>
      <div className="flex-1 p-3 overflow-y-auto space-y-3 text-sm">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === "user" ? "ml-auto flex justify-end items-start" : "mr-auto flex items-start"}>
            {msg.sender === "bot" && (
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 text-2xl mr-2 shrink-0">
                🤖
              </div>
            )}
            {msg.sender === "user" && (
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-2xl ml-2 shrink-0 order-2">
                🙂
              </div>
            )}
            <div className={msg.sender === "user" ? "flex-1 order-1" : "flex-1"}>
              {msg.type === "text" && (
                <div
                  className={`p-2 rounded-xl max-w-[75%] whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-blue-400 text-right"
                      : "bg-gray-400 text-left"
                  }`}
                >
                  {msg.text}
                </div>
              )}
              {msg.type === "product" && (
                <div className="flex items-center bg-gray-400 border rounded-xl p-2 w-60">
                  <img src={msg.product.image} alt={msg.product.name} className="w-16 h-16 rounded-lg mr-2 object-cover" />
                  <div>
                    <div className="font-semibold">{msg.product.name}</div>
                    <div className="text-gray-500 text-xs">{msg.product.color}, size {msg.product.size}</div>
                    <div className="text-blue-600 font-bold">{msg.product.price}</div>
                    <button className="mt-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-lg">View Product</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 border-t flex">
        <input
          className="flex-1 p-2 border rounded-xl mr-2 text-sm"
          placeholder="Type your search..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-blue-600 text-white px-3 rounded-xl"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
import React, { useState } from "react";

// Dummy product catalog with test images (Unsplash placeholders)
const products = [
  { id: 1, name: "Green Sneakers", size: 42, color: "green", price: "$89", image: "https://via.placeholder.com/400x300.png?text=Sneakers" },
  { id: 2, name: "Blue Running Shoes", size: 42, color: "blue", price: "$99", image: "https://via.placeholder.com/400x300.png?text=Sneakers" },
  { id: 3, name: "Green Sandals", size: 41, color: "green", price: "$49", image: "https://via.placeholder.com/400x300.png?text=Sneakers" },
  { id: 4, name: "Black Sneakers", size: 42, color: "black", price: "$95", image: "https://via.placeholder.com/400x300.png?text=Sneakers" },
  { id: 5, name: "Red Sneakers", size: 43, color: "red", price: "$85", image: "https://via.placeholder.com/400x300.png?text=Sneakers" },

];

export default function ProductChatbox() {
  const [messages, setMessages] = useState([
    { sender: "bot", type: "text", text: "👋 Hi! What product are you looking for today?" },
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [productPopup, setProductPopup] = useState({ open: false, products: [] });
  const [showWelcome, setShowWelcome] = useState(true);

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
      const label = results.length === 1 ? 'product' : 'products';
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "text",
          text: `Found ${results.length} ${label} for: "${input}". That might interest you!`,
          openPopup: true,
          products: results,
          label,
          count: results.length,
        },
      ]);
      setProductPopup({ open: true, products: results, label, count: results.length });
    } else {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", type: "text", text: "😔 Sorry, I couldn’t find an exact match. Maybe try another color or size?" },
      ]);
      setProductPopup({ open: false, products: [] });
    }

    setInput("");
  };

  return (
    <>
      {/* Welcome Pop-up above chat button */}
      {!open && showWelcome && (
        <div className="fixed bottom-20 right-8 z-40 flex flex-col items-end animate-fadein" style={{ maxWidth: '170px' }}>
          <div className="bg-white border border-blue-600 rounded-lg shadow-lg px-3 py-1.5 text-xs font-semibold text-blue-900 flex flex-col items-start relative text-left" style={{ maxWidth: '160px', lineHeight: '1.2', textAlign: 'left' }}>
            <span>Hi, I'm Betsy,</span>
            <span>I can help you find products</span>
            <button
              className="absolute top-1 right-1 font-bold text-base px-1 py-0.5 rounded-full border"
              style={{ lineHeight: 1, background: 'transparent', border: '1.5px solid #2563eb', color: '#2563eb' }}
              onClick={() => setShowWelcome(false)}
              aria-label="Close welcome message"
            >
              ×
            </button>
          </div>
          {/* Arrow pointing to chat button */}
          <div style={{
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '12px solid white',
            marginTop: '-2px',
            marginRight: '18px',
            filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.08))'
          }}></div>
        </div>
      )}
      {/* Chatbox */}
      {/* Floating Chat Button */}
      {!open && (
        <button
          className="fixed bottom-4 right-4 z-30 bg-blue-600 text-white rounded-full shadow-lg px-6 py-4 text-sm font-bold flex items-center justify-center hover:bg-blue-700 transition-all duration-200 transform-gpu hover:scale-105 animate-fadein"
          onClick={() => {
            setOpen(true);
            setShowWelcome(false);
          }}
        >
          Betsy
        </button>
      )}

      {/* Chatbox */}
      {open && (
        <div className="fixed bottom-4 right-4 w-80 z-20  animate-chatbox-in" style={{ borderColor: 'rgb(34, 46, 53)' }}>
          <div className="bg-blue-600 text-white p-3 rounded-t-2xl font-bold flex items-center justify-between select-none border-b" style={{ borderColor: 'rgb(34, 46, 53)' }}>
            <span>🛍️ Product Assistant</span>
            <button
              className="ml-2 w-8 h-8 flex items-center justify-center rounded-full border font-bold text-xl"
              style={{ lineHeight: 1, background: 'transparent', border: '1.5px solid #2563eb', color: '#fff' }}
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          <div
            className={`bg-[#222e35] shadow-lg rounded-b-2xl border-t-0 border flex flex-col transition-all duration-300 overflow-hidden max-h-[600px] opacity-100`}
            style={{ borderColor: 'rgb(34, 46, 53)' }}
          >
            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-sm">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={
                    (msg.sender === "user"
                      ? "ml-auto flex justify-end items-start"
                      : "mr-auto flex justify-start items-start") +
                    " animate-message-fadein"
                  }
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className={msg.sender === "user" ? "flex-1 order-1 flex justify-end" : "flex-1 flex justify-start"}>
                    {msg.type === "text" && (
                      <div
                        className={`p-2 rounded-xl max-w-[75%] whitespace-pre-line shadow ${
                          msg.sender === "user"
                            ? "bg-[#144d37] text-right border text-white"
                            : "bg-[#1d1e1e] text-left border text-white"
                        } animate-bubble-in`}
                        style={{ borderColor: 'rgb(34, 46, 53)' }}
                      >
                        {msg.text}
                        {msg.openPopup && (
                          <>
                            {' '}
                            <button
                              className="text-white underline ml-1 transition-transform duration-200 hover:scale-110"
                              onClick={() =>
                                setProductPopup({
                                  open: true,
                                  products: msg.products || [],
                                  label: msg.label,
                                  count: msg.count,
                                })
                              }
                            >
                              View {msg.label || 'products'}
                            </button>
                          </>
                        )}
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
                disabled={!open}
              />
              <button
                className="bg-blue-600 text-white px-3 rounded-xl transform-gpu hover:scale-105 transition-all duration-200"
                onClick={handleSend}
                disabled={!open}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Popup */}
      {productPopup.open && (
        <div
          className={`fixed top-0 right-0 h-full w-96 max-w-full bg-white shadow-2xl z-30 flex flex-col popup-anim popup-in`}
          style={{ boxShadow: '0 0 40px 0 rgba(0,0,0,0.2)', pointerEvents: 'auto' }}
        >
          <div className="flex text-left justify-between p-4 border-b bg-blue-500">
            <span className="font-bold text-lg text-white">
              {productPopup.count && productPopup.label
                ? `I found ${productPopup.count} ${productPopup.label} that might interest you`
                : 'Product Results'}
            </span>
            <button
              id="close-product-popup"
              className="px-2 rounded-full border font-bold"
              style={{ background: 'transparent', border: '1.5px solid #2563eb', color: '#fff', fontSize: '2.5rem', lineHeight: 1, cursor: 'pointer' }}
              onClick={() => setProductPopup({ open: false, products: [] })}
              aria-label="Close product popup"
            >
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {productPopup.products.length === 0 && (
              <div className="text-gray-500 text-center">No products found.</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {productPopup.products.map((p) => (
                <div key={p.id} className="bg-gray-100 border rounded-xl p-3 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-lg">
                  <img src={p.image} alt={p.name} className="w-24 h-24 rounded-lg object-cover mb-2" />
                  <div className="font-semibold text-center">{p.name}</div>
                  <div className="text-gray-500 text-xs text-center">{p.color}, size {p.size}</div>
                  <div className="text-blue-600 font-bold text-center">{p.price}</div>
                  <button className="mt-2 px-3 py-1 text-xs bg-blue-600 text-white rounded-lg transform-gpu hover:scale-105 transition-all duration-200">View Product</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
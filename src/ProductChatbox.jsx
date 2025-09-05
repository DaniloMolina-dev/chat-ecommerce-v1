import React, { useState, useRef, useEffect } from "react";
import { products } from "./components/products.jsx";


export default function ProductChatbox() {
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    { sender: "bot", type: "text", text: "👋 Hi! What product are you looking for today?" },
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [productPopup, setProductPopup] = useState({ open: false, products: [] });
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for lowest to highest, 'desc' for highest to lowest
  const [showWelcome, setShowWelcome] = useState(true);
  const [lastSearchTerm, setLastSearchTerm] = useState("");

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);
  // Improved query parser: matches if ANY meaningful word from the query appears in product fields
  const stopWords = [
    "i", "am", "is", "are", "was", "were", "be", "been", "being", "the", "a", "an", "and", "or", "but", "if", "then", "else", "for", "to", "of", "in", "on", "at", "by", "with", "about", "as", "into", "like", "through", "after", "over", "between", "out", "against", "during", "without", "before", "under", "around", "among", "looking", "searching", "find", "want", "need", "can", "could", "would", "should", "my", "your", "me"
  ];
  const searchProducts = (query) => {
    const lowerQuery = query.toLowerCase();
    const words = lowerQuery.split(/\s+/).filter((word) => word && !stopWords.includes(word));
    if (words.length === 0) return [];

    // Fully dynamic: no hardcoded filters, just search all fields except id and image
    return products.filter((p) => {
      let searchableParts = [];
      for (const key in p) {
        if (key === "id" || key === "image") continue;
        const value = p[key];
        if (Array.isArray(value)) {
          // Flatten arrays (categories, tags, attributes, related)
          if (key === "attributes") {
            searchableParts.push(...value.map(a => `${a.name} ${a.value}`));
          } else {
            searchableParts.push(...value.map(v => v.toString()));
          }
        } else if (typeof value === "object" && value !== null) {
          // Flatten nested objects (if any)
          searchableParts.push(JSON.stringify(value));
        } else {
          searchableParts.push(value.toString());
        }
      }
      const searchable = searchableParts.join(' ').toLowerCase();
      return words.some((word) => searchable.includes(word));
    });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { sender: "user", type: "text", text: input }]);

    // --- Attribute pair detection, strict keyword filtering, and 'on sale' support ---
    const filterWords = input.split(/\s+/).filter(w => w && !stopWords.includes(w.toLowerCase()));
    const allAttrNames = Array.from(new Set(products.flatMap(p => (p.attributes || []).map(a => a.name.toLowerCase()))));
    let attrPairs = [];
    let usedIndexes = new Set();
    for (let i = 0; i < filterWords.length - 1; i++) {
      if (allAttrNames.includes(filterWords[i].toLowerCase())) {
        attrPairs.push([filterWords[i], filterWords[i + 1]]);
        usedIndexes.add(i);
        usedIndexes.add(i + 1);
      }
    }
    // Non-attribute keywords (e.g. 'red wine'), ignore 'on' if 'sale' or similar is present
    const inputLower = input.toLowerCase();
    const wordsLower = inputLower.split(/\s+/);
    const isSaleQuery = (
      (wordsLower.includes("on") && wordsLower.includes("sale")) ||
      wordsLower.includes("sale") ||
      wordsLower.includes("discount") ||
      (wordsLower.includes("special") && wordsLower.includes("offer"))
    );
    // Remove sale-related words from nonAttrWords if isSaleQuery
    const saleWordSet = new Set(["on", "sale", "discount", "special", "offer"]);
    let nonAttrWords = filterWords.filter((word, idx) => {
      if (usedIndexes.has(idx)) return false;
      if (isSaleQuery && saleWordSet.has(word.toLowerCase())) return false;
      return true;
    });
    if (attrPairs.length > 0 || nonAttrWords.length > 0 || isSaleQuery) {
      let altResults = products.filter(p => {
        // Must match all attribute pairs
        if (attrPairs.length > 0) {
          if (!p.attributes || !Array.isArray(p.attributes)) return false;
          const hasAllAttrPairs = attrPairs.every(([attrName, attrValue]) =>
            p.attributes.some(a => {
              if (a.name.toLowerCase() !== attrName.toLowerCase()) return false;
              const attrValStr = a.value.toString().toLowerCase();
              const queryValStr = attrValue.toString().toLowerCase();
              if (attrValStr === queryValStr) return true;
              const attrValNum = Number(a.value);
              const queryValNum = Number(attrValue);
              if (!isNaN(attrValNum) && !isNaN(queryValNum) && attrValNum === queryValNum) return true;
              return false;
            })
          );
          if (!hasAllAttrPairs) return false;
        }
        // Must match all non-attribute keywords in name, categories, or tags
        if (nonAttrWords.length > 0) {
          const searchable = [p.name, ...(p.categories || []), ...(p.tags || [])].join(' ').toLowerCase();
          // Plural/singular matching
          const matchWord = (word) => {
            word = word.toLowerCase();
            if (searchable.includes(word)) return true;
            // If plural, check singular
            if (word.endsWith('s') && word.length > 2) {
              const singular = word.slice(0, -1);
              if (searchable.includes(singular)) return true;
            }
            // If singular, check plural
            if (!word.endsWith('s')) {
              const plural = word + 's';
              if (searchable.includes(plural)) return true;
            }
            return false;
          };
          if (!nonAttrWords.every(matchWord)) return false;
        }
        // Must be on sale if 'on sale' keyword is present
        if (isSaleQuery && !p.onSale) return false;
        return true;
      });
      if (altResults.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            type: "text",
            text: `Found ${altResults.length} product${altResults.length === 1 ? '' : 's'} for: ${input}. That might interest you!`,
            openPopup: true,
            products: altResults,
            label: altResults.length === 1 ? 'product' : 'products',
            count: altResults.length,
            query: input,
          },
        ]);
        setProductPopup({ open: true, products: altResults, label: altResults.length === 1 ? 'product' : 'products', count: altResults.length, query: input });
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", type: "text", text: "😔 Sorry, I couldn’t find an exact match. Maybe try another search?" },
        ]);
        setProductPopup({ open: false, products: [] });
      }
      setInput("");
      return;
    }

    // --- Normal searchProducts logic for all other queries ---
    const results = searchProducts(input);
    // Track last product type if present in this search
    const lowerInput = input.toLowerCase();
    const typeWords = lowerInput.split(/\s+/).filter((word) => word && !stopWords.includes(word) && products.some(p => p.name.toLowerCase().split(/\s+/).includes(word)));
    let newLastSearchTerm = lastSearchTerm;
    if (typeWords.length > 0) {
      newLastSearchTerm = typeWords.join(" ");
      setLastSearchTerm(newLastSearchTerm);
    }

    if (results.length > 0) {
      const label = results.length === 1 ? 'product' : 'products';
      // Extract main search terms (remove stop words)
      const lowerInput = input.toLowerCase();
      const mainTerms = lowerInput.split(/\s+/).filter((word) => word && !stopWords.includes(word));
      const mainQuery = mainTerms.join(' ');
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "text",
          text: `Found ${results.length} ${label} for: ${mainQuery || 'your search'}. That might interest you!`,
          openPopup: true,
          products: results,
          label,
          count: results.length,
          query: input,
        },
      ]);
      setProductPopup({ open: true, products: results, label, count: results.length, query: input });
    } else {
      // Fallback: single value search (e.g., '42')
      if (filterWords.length === 1) {
        const attrValue = filterWords[0];
        let altResults = products.filter(p =>
          p.attributes && Array.isArray(p.attributes) &&
          p.attributes.some(a => {
            const attrValStr = a.value.toString().toLowerCase();
            const queryValStr = attrValue.toString().toLowerCase();
            if (attrValStr === queryValStr) return true;
            const attrValNum = Number(a.value);
            const queryValNum = Number(attrValue);
            if (!isNaN(attrValNum) && !isNaN(queryValNum) && attrValNum === queryValNum) return true;
            return false;
          })
        );
        if (altResults.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              type: "text",
              text: `Found ${altResults.length} product${altResults.length === 1 ? '' : 's'} for: ${input}. That might interest you!`,
              openPopup: true,
              products: altResults,
              label: altResults.length === 1 ? 'product' : 'products',
              count: altResults.length,
              query: input,
            },
          ]);
          setProductPopup({ open: true, products: altResults, label: altResults.length === 1 ? 'product' : 'products', count: altResults.length, query: input });
        } else {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", type: "text", text: "😔 Sorry, I couldn’t find an exact match. Maybe try another search?" },
          ]);
          setProductPopup({ open: false, products: [] });
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", type: "text", text: "😔 Sorry, I couldn’t find an exact match. Maybe try another search?" },
        ]);
        setProductPopup({ open: false, products: [] });
      }
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
          className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white rounded-full shadow-lg px-6 py-4 text-sm font-bold flex items-center justify-center hover:bg-blue-700 transition-all duration-200 transform-gpu hover:scale-105 animate-fadein"
          style={{ zIndex: 1050 }}
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
  <div className="fixed bottom-4 right-4 w-80 z-50 animate-chatbox-in" style={{ borderColor: 'rgb(34, 46, 53)', zIndex: 1050 }}>
          <div className="bg-blue-600 text-white p-3 rounded-t-2xl font-bold flex items-center justify-between select-none border-b" style={{ borderColor: 'rgb(34, 46, 53)' }}>
            <span className="flex items-center">
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2 border border-blue-300 overflow-hidden">
                <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Betsy Avatar" className="w-8 h-8 object-cover rounded-full" />
              </span>
              Product Assistant
            </span>
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full border font-bold text-xl"
                style={{ lineHeight: 1, background: 'transparent', border: '1.5px solid #2563eb', color: '#fff' }}
                onClick={() => setOpen(false)}
                aria-label="Minimize chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full border font-bold text-sm"
                style={{ lineHeight: 1, background: 'transparent', border: '1.5px solid #2563eb', color: '#fff' }}
                onClick={() => {
                  setMessages([{ sender: "bot", type: "text", text: "👋 Hi! What product are you looking for today?" }]);
                  setProductPopup({ open: false, products: [], label: '', count: 0, query: '' });
                }}
                aria-label="Clear chat"
              >
                Clear
              </button>
            </div>
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
                              onClick={() => {
                                setProductPopup({
                                  open: true,
                                  products: msg.products || [],
                                  label: msg.label,
                                  count: msg.count,
                                });
                                setOpen(false);
                              }}
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
              <div ref={messagesEndRef} />
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
          className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-30 flex flex-col transition-all duration-500 ${productPopup.open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'} popup-anim popup-in`}
          style={{ boxShadow: '0 0 40px 0 rgba(0,0,0,0.2)', pointerEvents: 'auto', maxWidth: '700px', width: '100vw' }}
          onClick={() => setOpen(false)}
        >
          <div className="flex text-left justify-between p-4 border-b bg-blue-500">
            <span className="font-bold text-lg text-white">
              {(() => {
                if (productPopup.products && productPopup.products.length > 0) {
                  const count = productPopup.count || productPopup.products.length;
                  const productWord = count === 1 ? 'product' : 'products';
                  return `I found ${count} ${productWord} that might interest you`;
                }
                return 'Product Results';
              })()}
            </span>
            <button
              id="close-product-popup"
              className="w-10 h-10 flex items-center justify-center rounded-full border font-bold transition-all duration-200 hover:bg-blue-600/30"
              style={{ background: 'transparent', border: '1.5px solid #2563eb', color: '#fff', fontSize: '1.8rem', lineHeight: '40px', cursor: 'pointer', padding: 0, width: '40px', height: '40px' }}
              onClick={() => setProductPopup({ open: false, products: [] })}
              aria-label="Close product popup"
            >
              ×
            </button>
          </div>
          {/* Sorting Dropdown: only show if more than one product */}
          {productPopup.products && productPopup.products.length > 1 && (
            <div className="flex items-center justify-end px-4 py-2 bg-gray-50 border-b">
              <label htmlFor="sortOrder" className="mr-2 text-sm text-gray-600">Sort by price:</label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
                style={{ minWidth: '140px' }}
              >
                <option value="asc">Lowest to Highest</option>
                <option value="desc">Highest to Lowest</option>
              </select>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-4">
            {productPopup.products.length === 0 && (
              <div className="text-gray-500 text-center">No products found.</div>
            )}
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: 'repeat(2, 1fr)',
                /* Default: 2 columns for mobile */
              }}
            >
              {[...productPopup.products]
                .sort((a, b) => sortOrder === 'asc' ? a.price - b.price : b.price - a.price)
                .map((p) => (
                  <div key={p.id} className="bg-gray-100 border rounded-xl p-3 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-lg">
                    <img src={p.image} alt={p.name} className="h-24 rounded-lg object-cover mb-2" />
                    <div className="font-semibold text-center text-gray-500 flex items-center justify-center" style={{ minHeight: '2.5rem' }}>{p.name}</div>
                    <div className="text-gray-500 text-xs text-center">
                      {p.color ? p.color : ''}
                      {p.size ? (p.color ? ', ' : '') + `size ${p.size}` : ''}
                    </div>
                    <div className="text-blue-600 font-bold text-center">${p.price}</div>
                    <button
                      className="mt-2 px-3 py-1 text-xs bg-blue-600 text-white rounded-lg transform-gpu hover:scale-105 transition-all duration-200"
                      onClick={() => {
                        setOpen(false);
                        setProductPopup({ open: false, products: [] });
                      }}
                    >
                      View Product
                    </button>
                  </div>
                ))}
            </div>
            {/* Responsive grid columns for tablet and desktop */}
            <style>{`
              @media (min-width: 640px) {
                .popup-anim .grid {
                  grid-template-columns: repeat(3, 1fr) !important;
                }
              }
              @media (min-width: 900px) {
                .popup-anim .grid {
                  grid-template-columns: repeat(4, 1fr) !important;
                }
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
}

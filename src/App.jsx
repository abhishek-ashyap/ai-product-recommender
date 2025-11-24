import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Sparkles, AlertCircle, Loader2, Tag, DollarSign } from 'lucide-react';

/**
 * ------------------------------------------------------------------
 * MOCK DATASET
 * ------------------------------------------------------------------
 * A diverse list of products for the AI to analyze.
 */
const SAMPLE_PRODUCTS = [
  { id: 1, name: "Zenith X5 Smartphone", category: "Electronics", price: 699, description: "High-performance device with OLED display and 5G connectivity." },
  { id: 2, name: "Budget Buddy Phone", category: "Electronics", price: 199, description: "Reliable smartphone with long battery life, perfect for students." },
  { id: 3, name: "ProGamer Laptop 15", category: "Computers", price: 1299, description: "RTX 4060 equipped laptop designed for high-end gaming and rendering." },
  { id: 4, name: "AirPulse Earbuds", category: "Audio", price: 149, description: "Active noise cancelling wireless earbuds with spatial audio." },
  { id: 5, name: "BassBoom Speaker", category: "Audio", price: 89, description: "Waterproof portable bluetooth speaker with deep bass." },
  { id: 6, name: "FitTrack Watch", category: "Wearables", price: 120, description: "Health monitoring smartwatch with heart rate and sleep tracking." },
  { id: 7, name: "LuxLeather Satchel", category: "Accessories", price: 250, description: "Handcrafted genuine leather bag with laptop compartment." },
  { id: 8, name: "Mechanical Keyboard RGB", category: "Computers", price: 85, description: "Clicky blue switches with customizable RGB backlighting." },
  { id: 9, name: "4K UltraMonitor", category: "Computers", price: 350, description: "27-inch IPS panel with 144Hz refresh rate and HDR support." },
  { id: 10, name: "CozyNoise Headphones", category: "Audio", price: 299, description: "Over-ear studio quality headphones with plush memory foam." },
  { id: 11, name: "StreamDeck Mini", category: "Accessories", price: 100, description: "Programmable macro pad for streamers and productivity." },
  { id: 12, name: "Retro Game Console", category: "Gaming", price: 59, description: "Pre-loaded with 500 classic 8-bit games, connects to TV." }
];

/**
 * ------------------------------------------------------------------
 * AI API HELPER FUNCTION
 * ------------------------------------------------------------------
 * This function handles the communication with the Gemini API.
 * It sends the product list + user query and asks for matching IDs.
 */
const recommendProducts = async (userQuery, products) => {
  // NOTE: In a real environment, use process.env.REACT_APP_GEMINI_API_KEY
  // For this demo, we use the injected variable or empty string to be filled by the user.
  const apiKey = import.meta.env.VITE_API_KEY;; 
  
  // 1. Construct the System Prompt
  // We ask the AI to act as a filter and return ONLY a JSON array of IDs.
  const systemPrompt = `
    You are an intelligent shopping assistant API. 
    Your task is to analyze a list of products and a user's natural language request.
    
    Rules:
    1. Return ONLY a valid JSON object. Do not include markdown formatting (like \`\`\`json).
    2. The JSON object must have a key "recommendedIds" which is an array of integers (product IDs).
    3. Select products that match the user's criteria (price, category, features).
    4. If the user asks for something cheap, look at prices.
    5. If no products match, return an empty array for "recommendedIds".
    
    Product List: ${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, price: p.price, category: p.category, desc: p.description })))}
  `;

  const userMessage = `User Request: "${userQuery}"`;

  try {
    // 2. Call the API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            responseMimeType: "application/json"
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // 3. Parse the Result
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiText) {
      throw new Error("No response from AI");
    }

    const parsedResult = JSON.parse(aiText);
    return parsedResult.recommendedIds || [];

  } catch (error) {
    console.error("AI Recommendation Failed:", error);
    throw error;
  }
};

/**
 * ------------------------------------------------------------------
 * COMPONENTS
 * ------------------------------------------------------------------
 */

const ProductCard = ({ product }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full animate-in fade-in zoom-in duration-500">
    <div className="h-32 bg-slate-100 flex items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50 to-blue-50 opacity-50" />
        <ShoppingBag className="w-10 h-10 text-slate-300 group-hover:scale-110 transition-transform duration-500" />
        <span className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded-full text-slate-600 border border-slate-200">
            {product.category}
        </span>
    </div>
    
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-slate-800 leading-tight">{product.name}</h3>
        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-sm whitespace-nowrap ml-2">
          ${product.price}
        </span>
      </div>
      
      <p className="text-slate-500 text-sm mb-4 flex-grow line-clamp-3">
        {product.description}
      </p>
      
      <button className="w-full mt-auto bg-slate-900 hover:bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
        View Details
      </button>
    </div>
  </div>
);

const SearchSection = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) onSearch(input);
  };

  return (
    <div className="max-w-2xl mx-auto mb-12">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
        <div className="relative flex items-center bg-white rounded-xl shadow-lg border border-slate-100 p-2">
          <div className="pl-4 text-indigo-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you're looking for... (e.g., 'A gaming laptop under $1500')"
            className="w-full px-4 py-3 text-slate-700 bg-transparent outline-none placeholder:text-slate-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking</span>
              </>
            ) : (
              <>
                <span>Find</span>
                <Search className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center text-xs text-slate-500">
        <span className="font-medium">Try asking:</span>
        <button onClick={() => setInput("Something for gaming under $100")} className="hover:text-indigo-600 underline decoration-dotted">"Gaming gear under $100"</button>
        <span>•</span>
        <button onClick={() => setInput("Best headphones for travel")} className="hover:text-indigo-600 underline decoration-dotted">"Headphones for travel"</button>
        <span>•</span>
        <button onClick={() => setInput("Cheap smartphone for kids")} className="hover:text-indigo-600 underline decoration-dotted">"Cheap phone for kids"</button>
      </div>
    </div>
  );
};

export default function App() {
  const [displayedProducts, setDisplayedProducts] = useState(SAMPLE_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuery, setCurrentQuery] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  const handleRecommendation = async (query) => {
    setLoading(true);
    setError(null);
    setCurrentQuery(query);

    try {
      // Call the AI helper
      const recommendedIds = await recommendProducts(query, SAMPLE_PRODUCTS);
      
      if (recommendedIds.length === 0) {
        setDisplayedProducts([]);
        setError("I couldn't find any products matching that specific description in our catalog.");
      } else {
        // Filter the main list based on AI results
        const filtered = SAMPLE_PRODUCTS.filter(p => recommendedIds.includes(p.id));
        setDisplayedProducts(filtered);
      }
      setIsFiltered(true);
    } catch (err) {
      setError("Something went wrong while connecting to the AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDisplayedProducts(SAMPLE_PRODUCTS);
    setCurrentQuery("");
    setIsFiltered(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">ShopAI</span>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Powered by Generative AI
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Find exactly what you <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">need</span>.
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Don't scroll through filters. Just describe what you want, and our AI will curate the perfect list for you.
          </p>
        </div>

        {/* Search/Input Section */}
        <SearchSection onSearch={handleRecommendation} isLoading={loading} />

        {/* Results Info Bar */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4 min-h-[50px]">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {isFiltered ? (
              <>
                Results for <span className="text-indigo-600 italic">"{currentQuery}"</span>
              </>
            ) : (
              "Featured Products"
            )}
            <span className="ml-2 text-xs font-normal bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
              {displayedProducts.length} items
            </span>
          </h2>
          
          {isFiltered && (
            <button 
              onClick={handleReset}
              className="text-sm text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-1 transition-colors"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center text-red-600 mb-8 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
            <p className="font-medium">{error}</p>
            <button onClick={handleReset} className="mt-4 text-sm underline hover:text-red-800">Show all products</button>
          </div>
        )}

        {/* Product Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          !loading && !error && (
            <div className="text-center py-20 text-slate-400">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>No products found.</p>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-20 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} ShopAI Demo. Built with React & Gemini.</p>
        </div>
      </footer>
    </div>
  );
}
🛍️ ShopAI - AI-Powered Product Recommender

ShopAI is a modern e-commerce prototype that uses Generative AI (Google Gemini) to understand natural language search queries. Instead of relying on rigid keywords, users can ask complex questions like "I need a cheap laptop for gaming" or "Headphones for travel under $200", and the AI intelligently filters the product catalog to find the best matches.

🚀 View Live Demo (Replace the link above with your actual Vercel URL)

✨ Features

🧠 Semantic Search: Understands user intent (e.g., "budget-friendly" = low price).

⚡ Real-time Filtering: Instantly updates the product grid based on AI recommendations.

🎨 Modern UI: Built with Tailwind CSS for a responsive, beautiful design.

🛡️ Robust Error Handling: Graceful fallback states if the API encounters issues.

📱 Fully Responsive: Works perfectly on mobile, tablet, and desktop.

🛠️ Tech Stack

Frontend Framework: React (Vite)

Styling: Tailwind CSS

Icons: Lucide React

AI Integration: Google Gemini API (gemini-2.5-flash)

Deployment: Vercel

🚀 Getting Started

Follow these instructions to run the project locally on your machine.

Prerequisites

Node.js (v18 or higher recommended)

npm (Node Package Manager)

A free Google Gemini API Key (Get one here)

Installation

Clone the repository

git clone [https://github.com/your-username/ai-product-recommender.git](https://github.com/your-username/ai-product-recommender.git)
cd ai-product-recommender


Install dependencies

npm install


Set up Environment Variables

Create a new file named .env in the root directory.

Add your API key using the exact variable name below:

VITE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxx


Note: Do not wrap the key in quotes.

Run the development server

npm run dev


Open http://localhost:5173 in your browser.

📂 Project Structure

my-shop/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and icons
│   ├── App.jsx          # Main application logic & AI integration
│   ├── main.jsx         # Entry point
│   └── index.css        # Tailwind directives
├── .env                 # API Key (Not committed to GitHub)
├── .gitignore           # Files to ignore (node_modules, .env)
├── index.html           # HTML template
├── package.json         # Project dependencies
├── tailwind.config.js   # Tailwind configuration
└── vite.config.js       # Vite configuration


🧠 How It Works

User Input: The user types a query into the search bar (e.g., "Best headphones for running").

Context Construction: The app combines the user's query with a simplified text representation of the entire product catalog.

AI Analysis: The prompt is sent to the Gemini API with strict instructions to return only a JSON array of matching product IDs.

System Prompt: "You are an intelligent shopping assistant... Return ONLY a valid JSON object..."

Filtering: The frontend parses the JSON response ([4, 6, 10]) and filters the React state to display only those specific products.

🚢 Deployment

This project is optimized for deployment on Vercel.

Push your code to GitHub.

Import the repository on Vercel.

Crucial Step: In the Vercel "Environment Variables" section, add:

Key: VITE_API_KEY

Value: Your_Actual_Gemini_Key

Click Deploy.

🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request for any cool new features.

📄 License

This project is open source and available under the MIT License.
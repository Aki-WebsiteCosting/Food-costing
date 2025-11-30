import React, { useState, useCallback } from 'react';
import { calculateRecipeCost } from './services/geminiService';
import { CostingResult, LoadingState } from './types';
import { DEFAULT_RECIPES } from './constants';
import { CostingDisplay } from './components/CostingDisplay';

function App() {
  const [recipeInput, setRecipeInput] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<CostingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = useCallback(async (input: string) => {
    if (!input.trim()) return;
    
    setLoadingState(LoadingState.LOADING);
    setError(null);
    setResult(null);

    try {
      const data = await calculateRecipeCost(input);
      setResult(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("Oops! We couldn't calculate that. Please try providing more details or check your connection.");
      setLoadingState(LoadingState.ERROR);
    }
  }, []);

  const handleExampleClick = (prompt: string) => {
    setRecipeInput(prompt);
    handleCalculate(prompt);
  };

  const handleReset = () => {
    setResult(null);
    setRecipeInput('');
    setLoadingState(LoadingState.IDLE);
  };

  return (
    <div className="min-h-screen pb-12 flex flex-col">
      
      {/* Navigation / Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-18 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg text-2xl">👩‍🍳</div>
            <div>
              <h1 className="font-serif font-bold text-xl text-stone-800 tracking-tight leading-none">BakeCost</h1>
              <span className="text-xs text-orange-600 font-medium tracking-wide uppercase">The Student Baker's Helper</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8 md:mt-12 w-full flex-grow">
        
        {loadingState === LoadingState.LOADING && (
          <div className="fixed inset-0 bg-stone-900/30 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-6 max-w-sm mx-4 text-center animate-fade-in relative overflow-hidden border-b-4 border-orange-400">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-300 via-yellow-300 to-orange-300 animate-pulse"></div>
              <div className="text-5xl animate-bounce mt-4">🥣</div>
              <div>
                <h3 className="text-xl font-bold text-stone-800 font-serif">Mixing the Numbers...</h3>
                <p className="text-stone-500 mt-2 text-sm">Reviewing market prices, measuring ingredients, and heating up the oven.</p>
              </div>
            </div>
          </div>
        )}

        {result ? (
          <CostingDisplay data={result} onReset={handleReset} />
        ) : (
          <div className="max-w-3xl mx-auto animate-slide-down">
            
            <div className="text-center mb-10 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-semibold tracking-wide uppercase mb-2">
                Simple • Accurate • Educational
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-800">
                Recipe Costing <span className="text-orange-600 italic">Made Easy</span>
              </h2>
              <p className="text-stone-600 text-lg max-w-xl mx-auto leading-relaxed">
                Paste your recipe below. We'll handle the math, convert units, and estimate profits so you can focus on baking.
              </p>
            </div>

            <div className="bg-white p-1 rounded-2xl shadow-xl shadow-stone-200/50 transform transition-all duration-300">
              <div className="bg-white border border-stone-100 rounded-xl p-6 md:p-8 relative">
                
                <label htmlFor="recipe-input" className="block text-lg font-hand font-bold text-stone-500 mb-3">
                  Write your recipe here:
                </label>
                
                <textarea
                  id="recipe-input"
                  className="w-full h-56 p-4 text-lg md:text-xl border border-stone-200 rounded-xl bg-stone-50/30 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-300 outline-none resize-none text-stone-700 placeholder-stone-300 transition-all"
                  placeholder="Example: 500g All Purpose Flour, 250g Butter, 1 cup Sugar, 2 Eggs, 1 tsp Vanilla..."
                  value={recipeInput}
                  onChange={(e) => setRecipeInput(e.target.value)}
                />
                
                <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between border-t border-stone-100 pt-6">
                   <div className="text-stone-400 text-xs md:text-sm italic flex items-center gap-1">
                    <span>💡</span> Uses standard daily wage of ₱695
                  </div>
                  
                  <button
                    onClick={() => handleCalculate(recipeInput)}
                    disabled={!recipeInput.trim() || loadingState === LoadingState.LOADING}
                    className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 text-lg flex items-center justify-center gap-2 group"
                  >
                    <span>Compute Cost</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>

                {error && (
                  <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start gap-2">
                    <span>⚠️</span>
                    <p>{error}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-stone-200 flex-1"></div>
                <span className="text-stone-400 font-hand text-lg">or try a sample recipe</span>
                <div className="h-px bg-stone-200 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEFAULT_RECIPES.map((recipe) => (
                  <button
                    key={recipe.name}
                    onClick={() => handleExampleClick(recipe.prompt)}
                    className="p-5 bg-white hover:bg-orange-50/50 border border-stone-200 hover:border-orange-300 rounded-xl text-left transition-all group shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="font-bold font-serif text-lg text-stone-800 group-hover:text-orange-800 flex items-center justify-between mb-2">
                      {recipe.name}
                      <span className="text-2xl opacity-80 group-hover:scale-110 transition-transform">
                        {recipe.name.includes("Cookie") ? "🍪" : "🧁"}
                      </span>
                    </div>
                    <p className="text-sm text-stone-500">{recipe.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Baking Imagery / Footer Decoration */}
            <div className="mt-20">
               <div className="grid grid-cols-3 gap-4 md:gap-8 opacity-90">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md rotate-2 transform hover:rotate-0 transition-transform duration-500">
                    <img 
                      src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&q=80&w=600" 
                      alt="Flour and eggs" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md -translate-y-4 hover:translate-y-0 transition-transform duration-500">
                     <img 
                      src="https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600" 
                      alt="Baking tools" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md -rotate-2 transform hover:rotate-0 transition-transform duration-500">
                     <img 
                      src="https://images.unsplash.com/photo-1499636138143-bd649043ce52?auto=format&fit=crop&q=80&w=600" 
                      alt="Fresh cookies" 
                      className="w-full h-full object-cover"
                    />
                  </div>
               </div>
               <p className="text-center mt-6 font-hand text-stone-400 text-xl">"Baking is love made edible."</p>
            </div>

          </div>
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-4 mt-12 py-8 text-center text-stone-400 text-sm">
        <p className="font-serif italic text-stone-500">&copy; {new Date().getFullYear()} BakeCost. Made with ❤️ for student bakers.</p>
      </footer>
    </div>
  );
}

export default App;
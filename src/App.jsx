import { useState } from 'react';

function App() {
  const [image, setImage] = useState('nginx');
  const [tag, setTag] = useState('latest');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
const url=import.meta.env.VITE_API_URL || 'http://localhost:8080/container';


  const deployContainer = async (e) => {
    e.preventDefault();

    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, tag }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Somethingggg went wrong');
      }

      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          🐳 Deploy Container
        </h1>

        <form onSubmit={deployContainer} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image Name
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="e.g. nginx, node, ubuntu"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tag
            </label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="e.g. latest, alpine, 18"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Deploying...
              </>
            ) : (
              '🚀 Deploy'
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

    
        {result && (
          <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p className="text-green-200 text-sm mb-2">
              ✅ Container <span className="font-bold">{result.containerName}</span> deployed!
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-gray-300 text-sm">🔗 URL:</span>
              <a
                href={`http://${result.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline break-all font-mono text-sm"
              >
                {result.domain}
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(`http://${result.domain}`)}
                className="ml-auto text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1 rounded-full transition"
              >
                📋 Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
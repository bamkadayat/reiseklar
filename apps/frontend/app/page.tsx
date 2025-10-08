export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          Reiseklar
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Smart Commute Planner for Norway
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Get Started
          </button>
          <button className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

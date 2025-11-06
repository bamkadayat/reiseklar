export function WeatherSkeleton() {
  return (
    <div className="w-full h-full min-h-[450px]">
      <div className="rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 h-full flex flex-col gap-4 sm:gap-6 animate-pulse">
        {/* Header */}
        <div className="flex items-center gap-2 h-8">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-200 rounded flex-shrink-0"></div>
          <div className="h-6 bg-blue-200 rounded w-32"></div>
        </div>

        {/* Current Weather */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm md:mb-6">
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {/* Temperature */}
            <div className="flex flex-col items-start">
              <div className="w-8 h-8 bg-gray-200 rounded-full mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>

            {/* Wind */}
            <div className="flex flex-col items-start">
              <div className="w-8 h-8 bg-gray-200 rounded-full mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>

            {/* Humidity */}
            <div className="flex flex-col items-start">
              <div className="w-8 h-8 bg-gray-200 rounded-full mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>

        {/* Weekly Forecast */}
        <div>
          <div className="h-4 bg-blue-200 rounded w-24 mb-3"></div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
            {[...Array(7)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-3 sm:p-4 flex flex-col items-center shadow-sm"
              >
                <div className="h-3 bg-gray-200 rounded w-8 mb-2"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-10"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Attribution */}
        <div className="pt-4 border-t border-blue-200">
          <div className="h-3 bg-gray-200 rounded w-48 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default function SkeletonLoader() {
  return (
    <div className="rounded-lg p-4 animate-pulse">
      <div className="h-48 w-full bg-gray-300 rounded-md mb-4"></div> {/* Adjusted height and width */}
      <div className="h-8 w-3/4 bg-gray-300 rounded mb-2"></div> {/* Adjusted height and width */}
      <div className="h-6 w-1/2 bg-gray-300 rounded mb-2"></div> {/* Adjusted height and width */}
      <div className="h-6 w-1/2 bg-gray-300 rounded mb-2"></div> {/* Adjusted height and width */}
      <div className="h-8 w-3/4 bg-gray-300 rounded"></div> {/* Adjusted height and width */}
    </div>
  );
}
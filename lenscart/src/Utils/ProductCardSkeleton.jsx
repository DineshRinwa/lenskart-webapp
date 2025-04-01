// import React from 'react';
// import { useThemeContext } from '../context/ThemeContext';

// export const ProductCardSkeleton = () => {
//   const {darkMode, setDarkMode} = useThemeContext();


//   return (
//     <div className="w-full max-w-md rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
//       {/* Favorite icon skeleton */}
//       <div className="flex justify-end mb-2">
//         <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
//       </div>
      
//       {/* Image skeleton */}
//       <div className="relative w-full h-60 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent skeleton-shimmer"></div>
//       </div>
      
//       {/* Rating skeleton */}
//       <div className="flex items-center gap-2 mb-2">
//         <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//         <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//         <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//       </div>
      
//       {/* Title skeleton */}
//       <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
      
//       {/* Size skeleton */}
//       <div className="flex items-center gap-2 mb-3">
//         <div className="w-10 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//         <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//       </div>
      
//       {/* Color options skeleton */}
//       <div className="flex justify-end gap-2 mb-3">
//         <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
//         <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
//       </div>
      
//       {/* Price skeleton */}
//       <div className="flex items-center gap-2">
//         <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//         <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//         <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//       </div>
      
//       {/* Add custom shimmer effect styles */}
//       <style jsx>{`
//         @keyframes shimmer {
//           0% {
//             transform: translateX(-100%);
//           }
//           100% {
//             transform: translateX(100%);
//           }
//         }
        
//         .skeleton-shimmer {
//           animation: shimmer 1.5s infinite;
//         }
//       `}</style>
//     </div>
//   );
// };



import React from 'react';
import { useThemeContext } from '../context/ThemeContext';

export const ProductCardSkeleton = () => {
  const { darkMode } = useThemeContext();

  const baseBg = darkMode ? "bg-gray-900 border-gray-600" : "bg-gray-300 border-gray-200";
  const skeletonBg = darkMode ? "bg-gray-600" : "bg-gray-400";
  
  return (
    <div className={`w-full max-w-sm rounded-2xl overflow-hidden shadow-md ${baseBg} p-4 border`}>
      {/* Favorite icon skeleton */}
      <div className="flex justify-end mb-2">
        <div className={`w-6 h-6 rounded-full ${skeletonBg} animate-pulse`}></div>
      </div>
      
      {/* Image skeleton */}
      <div className={`relative w-full h-60 ${skeletonBg} rounded-lg mb-4 overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent "></div>
      </div>
      
      {/* Rating skeleton */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-6 ${skeletonBg} rounded animate-pulse`}></div>
        <div className={`w-5 h-5 ${skeletonBg} rounded animate-pulse`}></div>
        <div className={`w-6 h-6 ${skeletonBg} rounded animate-pulse`}></div>
      </div>
      
      {/* Title skeleton */}
      <div className={`w-3/4 h-6 ${skeletonBg} rounded mb-3 animate-pulse`}></div>
      
      {/* Size skeleton */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-10 h-5 ${skeletonBg} rounded animate-pulse`}></div>
        <div className={`w-16 h-5 ${skeletonBg} rounded animate-pulse`}></div>
      </div>
      
      {/* Color options skeleton */}
      <div className="flex justify-end gap-2 mb-3">
        <div className={`w-8 h-8 rounded-full ${skeletonBg} animate-pulse`}></div>
        <div className={`w-8 h-8 rounded-full ${skeletonBg} animate-pulse`}></div>
      </div>
      
      {/* Price skeleton */}
      <div className="flex items-center gap-2">
        <div className={`w-16 h-6 ${skeletonBg} rounded animate-pulse`}></div>
        <div className={`w-20 h-6 ${skeletonBg} rounded animate-pulse`}></div>
        <div className={`w-24 h-6 ${skeletonBg} rounded animate-pulse`}></div>
      </div>
    </div>
  );
};

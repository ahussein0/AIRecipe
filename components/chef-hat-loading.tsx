import React from "react"

export function ChefHatLoading() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-24 h-24">
        {/* Chef hat */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-10 bg-white rounded-t-full"></div>
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-20 h-12 bg-white rounded-md"></div>
        
        {/* Steam animation */}
        <div className="absolute -top-8 left-1/4 w-2 h-2 bg-gray-200 rounded-full animate-steam opacity-0"></div>
        <div className="absolute -top-8 left-1/2 w-2 h-2 bg-gray-200 rounded-full animate-steam animation-delay-300 opacity-0"></div>
        <div className="absolute -top-8 left-3/4 w-2 h-2 bg-gray-200 rounded-full animate-steam animation-delay-600 opacity-0"></div>
      </div>
      
      {/* Cooking pot */}
      <div className="w-24 h-6 bg-gray-700 rounded-t-md"></div>
      <div className="w-20 h-12 bg-gray-600 rounded-b-md relative">
        <div className="absolute top-2 left-2 w-4 h-1 bg-gray-400 rounded-full"></div>
        <div className="absolute top-5 left-2 w-4 h-1 bg-gray-400 rounded-full"></div>
        <div className="absolute top-8 left-2 w-4 h-1 bg-gray-400 rounded-full"></div>
      </div>
      
      {/* Bubbling animation */}
      <div className="relative w-16 h-2 mt-1">
        <div className="absolute left-1/4 -top-1 w-2 h-2 bg-blue-300 rounded-full animate-bubble opacity-0"></div>
        <div className="absolute left-1/2 -top-1 w-2 h-2 bg-blue-300 rounded-full animate-bubble animation-delay-500 opacity-0"></div>
        <div className="absolute left-3/4 -top-1 w-2 h-2 bg-blue-300 rounded-full animate-bubble animation-delay-1000 opacity-0"></div>
      </div>
    </div>
  )
} 
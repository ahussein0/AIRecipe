import React from "react";

export function ChefHatLoading() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-24 h-24 animate-bounce">
        {/* Floating Text */}
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-full animate-floating-text z-10">
          <div className="text-sm font-medium text-primary whitespace-nowrap font-bold">
            What's cookin', good lookin'?
          </div>
        </div>
        
        {/* Chef Hat SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
          <line x1="6" x2="18" y1="17" y2="17" />
        </svg>
        
        {/* Steam Animation */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-1">
            <div className="w-1 h-3 bg-primary/60 rounded-full animate-steam-1"></div>
            <div className="w-1 h-3 bg-primary/60 rounded-full animate-steam-2 delay-150"></div>
            <div className="w-1 h-3 bg-primary/60 rounded-full animate-steam-3 delay-300"></div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-medium">The chef is preparing a delicious recipe just for you!</h3>
        
      </div>
    </div>
  );
}

export function KitchenLoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 text-primary"
          >
            <path d="M15 11h.01"></path>
            <path d="M11 15h.01"></path>
            <path d="M16 16h.01"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="M6 6l1.5 1.5"></path>
            <path d="M16.5 16.5l1.5 1.5"></path>
            <path d="M18 6l-1.5 1.5"></path>
            <path d="M7.5 16.5L6 18"></path>
            <circle cx="12" cy="12" r="4"></circle>
          </svg>
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-medium">Preparing your recipe...</h3>
        <p className="text-muted-foreground mt-2">
          This might take a minute. Great food takes time!
        </p>
      </div>
    </div>
  );
} 
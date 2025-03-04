import React from "react"

interface KitchenLoadingSpinnerProps extends React.SVGAttributes<SVGElement> {}

export function KitchenLoadingSpinner({ className, ...props }: KitchenLoadingSpinnerProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M15 11h.01"></path>
      <path d="M11 15h.01"></path>
      <path d="M16 16h.01"></path>
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2a10 10 0 0 1 10 10"></path>
    </svg>
  )
} 
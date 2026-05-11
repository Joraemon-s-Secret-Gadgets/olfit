<<<<<<< HEAD
=======
import { Loader2 } from "lucide-react";
>>>>>>> c5c5017 (feat(frontend): migrate react fragrance experienceAdds the Vite React application, Tailwind styling, Zustand state, API services, report capture flow, reusable UI components, and static imagery for the Olfit fragrance matching experience.)

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export default function LoadingSpinner({ message = "Loading...", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 gap-4 ${className}`}>
<<<<<<< HEAD
      <div className="flex items-center gap-1.5 h-8">
        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse [animation-delay:-0.3s]" />
        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse [animation-delay:-0.15s]" />
        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      </div>
=======
      <Loader2 className="w-8 h-8 animate-spin text-wood" strokeWidth={1.5} />
>>>>>>> c5c5017 (feat(frontend): migrate react fragrance experienceAdds the Vite React application, Tailwind styling, Zustand state, API services, report capture flow, reusable UI components, and static imagery for the Olfit fragrance matching experience.)
      <p className="text-[11px] uppercase tracking-[0.2em] text-wood/40 font-medium">
        {message}
      </p>
    </div>
  );
}

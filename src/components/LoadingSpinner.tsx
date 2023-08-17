import { ImSpinner2 } from "react-icons/im";

type LoadingSpinnerProps = {
  big?: boolean;
}

export function LoadingSpinner({big = false}: LoadingSpinnerProps) {
  const sizeClasses = big ? "w-16 h-16" : "w-10 h-10"

  return (
    <div className="flex justify-center min-h-0 mt-2">
      <ImSpinner2 className={`animate-spin dark:fill-white ${sizeClasses}`} />
    </div>
  );
}
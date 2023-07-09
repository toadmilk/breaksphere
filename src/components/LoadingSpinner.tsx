import { ImSpinner2 } from "react-icons/im";

type LoadingSpinnerProps = {
  big?: boolean;
}

export function LoadingSpinner({big = false}: LoadingSpinnerProps) {
  const sizeClasses = big ? "w-16 h-16" : "w-10 h-10"

  return (
    <div className="justify-center">
      <ImSpinner2 className={`animate-spin dark:fill-white ${sizeClasses}`} />
    </div>
  );
}
import { BiRefresh } from "react-icons/bi";

type LoadingSpinnerProps = {
  big?: boolean;
}

export function LoadingSpinner({big = false}: LoadingSpinnerProps) {
  const sizeClasses = big ? "w-16 h-16" : "w-10 h-10"

  return (
    <div>
      <BiRefresh className={`animate-spin dark:fill-white ${sizeClasses}`} />
    </div>
  );
}
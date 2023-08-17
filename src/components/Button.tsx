import { type ButtonHTMLAttributes, type DetailedHTMLProps } from "react";

type ButtonProps = {
    small?: boolean;
    gray?: boolean;
    red?: boolean;
    className?: string;
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export function Button({
    small = false,
    gray = false,
    red = false,
    className = "",
    ...props
}: ButtonProps) {
    const sizeClasses = small ? "px-2 py-1": "px-4 py-2 font-bold";
    let colorClasses = gray
      ? "bg-neutral-500 hover:bg-neutral-400 focus-visible:bg-neutral-400"
      : "bg-indigo-600 hover:bg-indigo-500 focus-visible:bg-indigo-500";

    if (red) {
        colorClasses = "bg-red-600 hover:bg-red-500 focus-visible:bg-red-500";
    }

    return (
        <button
            className={`rounded-full text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses} ${colorClasses} ${className}`}
            {...props}>
        </button>
    )
}
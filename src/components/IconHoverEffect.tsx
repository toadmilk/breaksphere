import {ReactNode} from 'react';

type IconHoverEffectProps = {
    children: ReactNode;
    red?: boolean;
}

export function IconHoverEffect({ children, red = false}: IconHoverEffectProps) {
    const colorClasses = red
        ? "outline-red-400 hover:bg-red-200 group-hover-bg-red-200 group-focus-visible:bg-red-200 focus-visible:bg-red-200"
        : "outline-gray-400 hover:bg-gray-200 group-hover:bg-gray-200 group-focus-visible:bg-gray-200 focus-visible:bg-gray-200" +
      "dark:outline-gray-900 dark:hover:bg-gray-800 dark:group-hover:bg-gray-800 dark:group-focus-visible:bg-gray-800 dark:focus-visible:bg-gray-800";

    return (
        <div
            className={`rounded-full p-2 transition-colors duration-200 
            ${colorClasses}`}
        >
            {children}
        </div>
    )
}
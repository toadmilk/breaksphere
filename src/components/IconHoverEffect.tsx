import {type ReactNode} from 'react';

type IconHoverEffectProps = {
    children: ReactNode;
    red?: boolean;
}

export function IconHoverEffect({ children, red = false }: IconHoverEffectProps) {
    const colorClasses = red
        ? "outline-red-400 hover:bg-red-200 group-hover-bg-red-200 group-focus-visible:bg-red-200 focus-visible:bg-red-200"
        : "outline-neutral-400 hover:bg-neutral-200 group-hover:bg-neutral-200 group-focus-visible:bg-neutral-200 focus-visible:bg-neutral-200" +
      "dark:outline-neutral-900 dark:hover:bg-neutral-800 dark:group-hover:bg-neutral-800 dark:group-focus-visible:bg-neutral-800 dark:focus-visible:bg-neutral-800";

    return (
        <div
            className={`rounded-full p-2 
            ${colorClasses}`}
        >
            {children}
        </div>
    )
}
import { BsFillMoonFill, BsSunFill } from 'react-icons/bs';

type ThemeButtonProps = {
  theme: string;
  toggleTheme: () => void;
}

export function ThemeButton({ theme, toggleTheme }: ThemeButtonProps) {
  return (
    <div className="flex-grow flex justify-end pr-2 pb-4 pt-1">
      <button onClick={toggleTheme}>
        {theme === 'light' ? (
          <BsFillMoonFill className="fill-black w-7 h-7" />
        ) : (
          <BsSunFill className="fill-white w-7 h-7" />
        )}
      </button>
    </div>
  )
}
import { useState, useEffect } from 'react';
import { BsFillMoonFill, BsSunFill } from 'react-icons/bs';

export function Theme() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const localTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (localTheme) {
      //console.log("local theme: " + localTheme);
      setTheme(localTheme);
    } else if (prefersDarkMode) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    //console.log("current" + theme);
    if (theme == 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  return (
    <div>
      <button onClick={toggleTheme}>
        {theme === 'light' ? (
          <BsFillMoonFill className="fill-black w-7 h-7" />
        ) : (
          <BsSunFill className="fill-white w-7 h-7" />
        )}
      </button>
    </div>
  );
}
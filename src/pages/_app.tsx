import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import {SideNav} from "~/components/SideNav";
import { FollowBar } from "~/components/FollowBar";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const localTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (localTheme) {
      setTheme(localTheme);
    } else if (prefersDarkMode) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
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
    toast.info(`Switched to ${newTheme} mode! ${newTheme === 'dark' ? '🌙' : '☀️'}`);
  }

  return (
    <SessionProvider session={session}>
      <ToastContainer
        position="bottom-right"
        pauseOnFocusLoss={false}
        theme={theme === 'light' ? 'light' : 'dark'}
      />
      <div className="dark:bg-black">
        <Head>
          <title>BreakSphere</title>
          <meta
              name="description"
              content="BreakSphere"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="container mx-auto flex items-start">
          <SideNav />
          <div className="min-h-screen min-w-0 flex-grow border-x dark:border-neutral-700">
              <Component {...pageProps} theme={theme} toggleTheme={toggleTheme} />
          </div>
          <FollowBar
            id={session?.user?.id ?? ""}
            title="Who to follow"
          />
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

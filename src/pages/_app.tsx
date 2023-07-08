import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import {SideNav} from "~/components/SideNav";
import { FollowBar } from "~/components/FollowBar";
import { ToastContainer } from "react-toastify";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className="dark:bg-black">
        <Head>
          <title>BreakSphere</title>
          <meta
              name="description"
              content="BreakSphere"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="container mx-auto flex items-start sm:pr-4">
          <SideNav />
          <div className="min-h-screen flex-grow border-x dark:border-neutral-700">
              <Component {...pageProps} />
          </div>
          <FollowBar
            id={"cljcj2mk10000l17o33mwhp2x"}
            title="Who to follow"
          />
        </div>
        <ToastContainer />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

import { InferGetStaticPropsType, NextPage } from "next";
import { getStaticProps } from "~/pages/profiles/[id]";
import Head from "next/head";
import Switch from "~/components/Switch";

const Settings: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  {
    id,
  }
) => {
  return (
    <div className="dark:bg-black">
      <Head>
        <title>{`BreakSphere - Settings`}</title>
      </Head>
      <header className="dark:text-white">Yo</header>
      <main>
          <Switch />
      </main>
    </div>
  );
}

export default Settings;
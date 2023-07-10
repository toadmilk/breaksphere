import {NewPostForm} from "~/components/NewPostForm";
import {InfinitePostList} from "~/components/InfinitePostList";
import {api} from "~/utils/api";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ThemeButton } from "~/components/ThemeButton";

const TABS = ["Recent", "Following"] as const;

type ThemeProps = {
  theme: string;
  toggleTheme: () => void;
}

const Home: NextPage<ThemeProps> = ({ theme, toggleTheme }) => {
  const session = useSession();
  const [selectedTab, setSelectedTab] = useState<(typeof TABS)[number]>("Recent");
  return (
      <>
          <header className="sticky top-0 z-10 border-b dark:border-neutral-700 bg-white dark:bg-black pt-2">
            <div className="flex">
              <h1 className="mb-2 px-4 pt-1 text-2xl dark:text-white font-bold">Home</h1>
              <ThemeButton theme={theme} toggleTheme={toggleTheme} />
            </div>
            {session.status === "authenticated" && (
                <div className="flex">
                  {TABS.map((tab) => {
                    return <button key={tab}
                      className={`flex-grow p-2 hover:bg-neutral-200 focus-visible:bg-neutral-200 dark:text-white dark:hover:bg-neutral-900 dark:focus-visible:bg-neutral-900 ${
                        tab === selectedTab
                          ? "border-b-4 border-b-indigo-600 font-bold"
                          : ""
                      }`}
                      onClick={() => setSelectedTab(tab)}
                    >{tab}</button>
                  })}
                </div>
            )}
          </header>
          <NewPostForm />
        {selectedTab === "Recent" ? <RecentPosts /> : <FollowingPosts />}
      </>
  );
};

function RecentPosts() {
    const posts = api.post.infiniteFeed.useInfiniteQuery(
        {},
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );
    return (
        <InfinitePostList
            posts={posts.data?.pages.flatMap((page) => page.posts)}
            isError={posts.isError}
            isLoading={posts.isLoading}
            hasMore={posts.hasNextPage}
            fetchNewPosts={posts.fetchNextPage}
        />
    )
}

function FollowingPosts() {
  const posts = api.post.infiniteFeed.useInfiniteQuery(
    { onlyFollowing: true},
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
  return (
    <InfinitePostList
      posts={posts.data?.pages.flatMap((page) => page.posts)}
      isError={posts.isError}
      isLoading={posts.isLoading}
      hasMore={posts.hasNextPage}
      fetchNewPosts={posts.fetchNextPage}
    />
  )
}

export default Home;
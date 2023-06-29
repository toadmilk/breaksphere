import {Button} from "~/components/Button";
import {ProfileImage} from "~/components/ProfileImage";
import {useSession} from "next-auth/react";
import {useState, useRef, useLayoutEffect, useCallback, type FormEvent, useEffect} from "react";
import {api} from "~/utils/api";

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
    if (textArea == null) return;
    textArea.style.height = "0";
    textArea.style.height = `${textArea.scrollHeight}px`;
}

export function NewPostForm() {
    const session = useSession();
    if (session.status !== "authenticated") return null;

    return <Form />
}

function Form() {
    const session = useSession();
    const [inputValue, setInputValue] = useState("");
    const textAreaRef = useRef<HTMLTextAreaElement>();
    const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
        updateTextAreaSize(textArea);
        textAreaRef.current = textArea;
    }, []);
    const trpcUtils = api.useContext();
    const [varCount, setVarCount] = useState(0);

    useEffect(() => {
        setVarCount(inputValue.length);
    }, [inputValue]);

    useLayoutEffect(() => {
        updateTextAreaSize(textAreaRef.current);
    }, [inputValue]);

    const createPost = api.post.create.useMutation({
        onSuccess: (newPost) => {
            setInputValue("");

            if (session.status !== "authenticated") return;

            trpcUtils.post.infiniteFeed.setInfiniteData({}, (oldData) => {
                if (oldData == null || oldData.pages[0] == null) return;

                const newCachePost = {
                    ...newPost,
                    likeCount: 0,
                    likedByMe: false,
                    user: {
                        id: session.data.user.id,
                        name: session.data.user.name || null,
                        image: session.data.user.image || null,
                    },
                };

                return {
                    ...oldData,
                    pages: [
                        {
                            ...oldData.pages[0],
                            posts: [newCachePost, ...oldData.pages[0].posts],
                        },
                      ...oldData.pages.slice(1),
                    ]
                }
            })
        },
    });

    if (session.status !== "authenticated") return null;

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        createPost.mutate({ content: inputValue });
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-b dark:border-gray-700 px-4 py-2">
            <div className="flex gap-4">
                <ProfileImage src={session.data.user.image} />
                <textarea
                    ref={inputRef}
                    style={{height: 0}}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none dark:bg-black dark:text-white"
                    placeholder="What's choppin!"
                />
            </div>
            <div className="flex items-center self-end">
                <p className="dark:text-white px-2">{varCount}/192</p>
                <Button className={`${
                  varCount > 192 ? "text-gray-500" : ""
                } ${varCount > 192 ? "opacity-50 cursor-not-allowed" : ""}`}>
                    Post
                </Button>
            </div>
        </form>
    );
}
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { signIn, signOut } from 'next-auth/react';
import {IconHoverEffect} from "~/components/IconHoverEffect";
// import { VscHome, VscAccount, VscSignIn, VscSignOut } from "react-icons/vsc";
import { BsHouseFill, BsBellFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { BiLogIn, BiLogOut } from "react-icons/bi";

export function SideNav() {
    const session = useSession();
    const user = session.data?.user;
    return (
        <nav className="sticky top-0 px-2 py-4">
            <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
                <li>
                    <Link href="/">
                        <IconHoverEffect>
                            <span className="flex items-center gap-4">
                                <BsHouseFill className="h-8 w-8 dark:fill-white" ></BsHouseFill>
                                <span className="hidden text-lg md:inline dark:text-white">Home</span>
                            </span>
                        </IconHoverEffect>
                    </Link>
                </li>
                {user != null && (
                    <li>
                        <Link href={`/profiles/${user.id}`}>
                            <IconHoverEffect>
                            <span className="flex items-center gap-4">
                                <FaUser className="h-8 w-8 dark:fill-white" ></FaUser>
                                <span className="hidden text-lg md:inline dark:text-white">Profile</span>
                            </span>
                        </IconHoverEffect>
                        </Link>
                    </li>
                )}
                {user == null ?
                    <li>
                        <button onClick={() => void signIn()}>
                            <IconHoverEffect>
                                <span className="flex items-center gap-4">
                                    <BiLogIn className="h-8 w-8 fill-green-700" ></BiLogIn>
                                    <span className="hidden text-lg text-green-700 md:inline">Log In</span>
                                </span>
                            </IconHoverEffect>
                        </button>
                    </li>
                :
                    <li>
                        <button onClick={() => void signOut()}>
                            <IconHoverEffect>
                                <span className="flex items-center gap-4">
                                    <BiLogOut className="h-8 w-8 fill-red-700" ></BiLogOut>
                                    <span className="hidden text-lg text-red-700 md:inline">Log Out</span>
                                </span>
                            </IconHoverEffect>
                        </button>
                    </li>
                }
            </ul>
        </nav>
    )
}
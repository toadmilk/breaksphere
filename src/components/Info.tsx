import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export function Info() {
  return (
    <div className="w-[350px] pt-4">
      <Link
        href="https://github.com/toadmilk/breaksphere"
        className="flex justify-center items-center min-h-0"
      >
        <FaGithub className="dark:fill-white w-10 h-10" />
        <p className="pl-2 dark:text-white">Github</p>
      </Link>
    </div>
  );
}
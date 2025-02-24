"use client";

import Link from "next/link";

type AppBarProps = {
  userName?: string | null;
};

export default function AppBar({ userName }: AppBarProps) {
  return (
    <div className="sticky top-0 flex w-full items-center border-b bg-white px-10 py-4">
      <p className="text-2xl font-semibold">EvMan</p>
      <div className="flex-grow"></div>
      <div className="space-x-2">
        {userName ? <p>{userName}</p> : ""}
        <Link
          href="/api/auth/signout"
          className="rounded-xl border px-5 py-3 font-semibold no-underline transition hover:bg-slate-200"
        >
          Sign out
        </Link>
      </div>
    </div>
  );
}

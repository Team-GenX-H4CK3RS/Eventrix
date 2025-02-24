import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import AppBar from "~/app/_components/appbar";
import { events, formatDate } from "~/server/data.smpl";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col">
        {session?.user ? <AppBar /> : ""}
        <div className="flex h-screen items-center justify-center">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Welcome to <span className="text-blue-800">Eventrix</span>
            </h1>

            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center justify-center gap-4">
                {session ? (
                  <Link
                    href="/dashboard"
                    className="rounded-full bg-blue-700 px-10 py-3 text-xl font-semibold text-white no-underline transition hover:bg-blue-700/60"
                  >
                    Create An Event
                  </Link>
                ) : (
                  <Link
                    href="/api/auth/signin"
                    className="rounded-full bg-blue-700 px-10 py-3 text-lg font-semibold text-white no-underline transition hover:bg-blue-700/60"
                  >
                    Sign in
                  </Link>
                )}
                <p className="mt-2 text-xl">Or Explore Events ↓</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-screen" id="exp-evs">
          <div className="flex h-screen flex-col justify-center p-10">
            <p className="text-4xl font-semibold">Explore Events Near You!</p>
            <div className="flex w-screen items-center gap-4 overflow-x-auto p-4">
              {events.map((v) => (
                <div
                  key={v.id}
                  className="grid min-w-[300px] overflow-hidden rounded-2xl border"
                >
                  <div
                    className="h-[150px] bg-contain"
                    style={{ backgroundImage: `url('${v.imageUrl}')` }}
                  ></div>
                  <div className="z-10 -mt-2 flex h-[200px] flex-col rounded-2xl bg-white px-6 py-6">
                    <p className="text-xl font-semibold">{v.title}</p>
                    <p>
                      Registration Ends:{" "}
                      <span className="font-semibold">
                        {formatDate(v.beginsOn)}
                      </span>
                    </p>
                    <div className="flex-grow"></div>
                    <button className="w-fit self-end rounded-xl bg-blue-700 px-4 py-2 text-white">
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}

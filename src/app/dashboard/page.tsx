import Link from "next/link";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import AppBar from "~/app/_components/appbar";
import { randomInt } from "crypto";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.org.hasAny.prefetch();
    void api.org.getAll.prefetch();
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col">
        {session?.user ? <AppBar /> : ""}
        <div className="flex flex-grow flex-col gap-10">
          <div className="grid-row-2 grid grid-cols-3">
            <div className="bg-blue-600">
              <p></p>
            </div>
          </div>
          <div className="px-10 py-4">
            <div className="flex items-center px-10 py-2">
              <p className="text-xl font-semibold">Organisations</p>
              <div className="flex-grow"></div>
              <Link
                className="flex items-center rounded-xl border px-4 py-2"
                href={`/dashboard/orgs/new`}
              >
                New
              </Link>
            </div>
            <hr />
            <div className="flex w-screen gap-4 overflow-x-auto p-4">
              {(await api.org.hasAny()) || (
                <p className="px-6 text-lg">
                  You are not a part of any organisation...
                </p>
              )}
              {(await api.org.getAll()).map((v) => (
                <Link
                  href={`/dashboard/orgs/${v.id}`}
                  key={v.id}
                  className="min-w-[400px] rounded-xl border p-4 text-lg"
                >
                  <p className="text-xl font-semibold">{v.name}</p>
                  <p className="text-sm">
                    <span className="font-semibold text-blue-600">
                      {(v.events as []).length}
                    </span>{" "}
                    Active Events
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-yellow-700">
                      {(v.members as []).length}
                    </span>{" "}
                    Active Members
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}

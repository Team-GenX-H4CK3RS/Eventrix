import Link from "next/link";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import AppBar from "~/app/_components/appbar";
import { orgs } from "~/server/data.smpl";
import { randomInt } from "crypto";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.org.hasAny.prefetch();
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
          <div className="p-10">
            <p className="text-xl font-semibold">Organisations</p>
            <div className="flex w-screen gap-4 overflow-x-auto p-4">
              {orgs.map((v) => (
                <Link
                  href={`/dashboard/orgs/${v.id}`}
                  key={v.id}
                  className="min-w-[400px] rounded-xl border p-4 text-lg"
                >
                  <p className="text-xl font-semibold">{v.name}</p>
                  <p className="text-sm text-blue-700">
                    {v.eventsCount} Active Events
                  </p>
                  <p className="text-sm text-red-700">
                    {randomInt(30)} Queries Raised
                  </p>
                  <br />
                  <p>Active Members:</p>
                  <ul className="flex flex-wrap gap-2">
                    {v.members.map((mem) => (
                      <li
                        className="flex items-center gap-1 rounded-full border px-2 py-1 text-sm"
                        key={mem.id}
                      >
                        {mem.email}
                        <span className="rounded-full bg-slate-200 px-1 py-0.5 text-xs">
                          {mem.role}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}

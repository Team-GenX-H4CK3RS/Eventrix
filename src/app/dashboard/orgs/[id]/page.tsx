import Link from "next/link";
import z from "zod";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import AppBar from "~/app/_components/appbar";
import { orgs, events, formatDate } from "~/server/data.smpl";
import { randomInt } from "crypto";

export default async function OrgsEvents({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const orgId = parseInt((await params).id);
  const dtFilter = { orgId };

  // if (session?.user) {
  //   void api.org.getById.prefetch(dtFilter);
  //   void api.event.getAllByOrg.prefetch(dtFilter);
  // }

  // const orgDetails = await api.org.getById(dtFilter);
  // const events = await api.event.getAllByOrg(dtFilter);

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col">
        {session?.user ? <AppBar /> : ""}
        <div className="flex flex-col gap-4 p-10">
          <div className="px-6 pb-2">
            <p className="text-3xl font-semibold">{orgs[orgId]?.name}</p>
          </div>
          <div className="px-10 py-4">
            <div className="flex items-center px-10 py-2">
              <p className="text-xl font-semibold">Events</p>
              <div className="flex-grow"></div>
              <Link
                className="flex items-center rounded-xl border px-4 py-2"
                href={`/dashboard/orgs/${orgId}/events/new`}
              >
                New
              </Link>
            </div>
            <hr />
            <ul className="py-2">
              {events.slice(3, 7).map((v) => (
                <li
                  key={v.id}
                  className="flex items-center space-x-2 px-4 py-2"
                >
                  <div
                    style={{ backgroundImage: `url('${v.imageUrl}')` }}
                    className="mr-4 h-[60px] w-[60px] rounded-xl bg-cover"
                  />
                  <div>
                    <p className="font-semibold">{v.title}</p>
                    <p>
                      Registration Starts:
                      {formatDate(v.beginsOn)}
                    </p>
                  </div>
                  <div className="flex-grow"></div>
                  <div className="flex flex-col items-end">
                    <p>{randomInt(1000)} enrolled</p>
                    <p>
                      <span className="text-semibold">{randomInt(100)}</span>{" "}
                      waiting
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="px-10 py-4">
            <div className="flex items-center space-x-2 px-10 py-2">
              <p className="text-xl font-semibold">Members</p>
              <div className="flex-grow"></div>
              <Link
                className="flex items-center rounded-xl border px-4 py-2"
                href={`/dashboard/orgs/${orgId}/events/new`}
              >
                New
              </Link>
              <Link
                className="text-semibold flex items-center rounded-xl border px-4 py-2 text-red-700"
                href={`/dashboard/orgs/${orgId}/events/new`}
              >
                Delete
              </Link>
            </div>
            <hr />
            <ul>
              {orgs[orgId]?.members.map((v) => (
                <li key={v.id} className="flex items-center px-4 py-2">
                  <div>
                    <p className="font-semibold">{v.name}</p>
                    <p>{v.email}</p>
                    <p>{v.role}</p>

                    <Link
                      className="text-semibold flex w-fit items-center rounded-xl border px-3 py-1"
                      href={`/dashboard/orgs/${orgId}/events/new`}
                    >
                      Contact
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}

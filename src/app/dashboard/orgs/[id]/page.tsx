import Link from "next/link";
import z from "zod";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import AppBar from "~/app/_components/appbar";
import { orgs, events } from "~/server/data.smpl";
import { formatDateAs } from "~/server/util";
import { randomInt } from "crypto";

export default async function OrgsEvents({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const orgId = parseInt((await params).id);
  const dtFilter = { orgId };

  if (session?.user) {
    void api.org.getById.prefetch(dtFilter);
  }

  const orgDetails = await api.org.getById(dtFilter);

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col">
        <AppBar />
        <div className="flex flex-col gap-4 p-10">
          <div className="px-6 pb-2">
            <p className="text-3xl font-semibold">{orgDetails?.name}</p>
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
            <div className="max-h-[300px] overflow-y-auto py-2">
              {(await api.event.hasAnyByOrg(dtFilter)) || (
                <p className="px-6 text-lg">
                  This organisation has no events...
                </p>
              )}
              {(await api.event.getAllByOrg(dtFilter)).map((v) => (
                <Link
                  href={`/dashboard/orgs/${orgId}/events/channels/`}
                  key={v.id}
                  className="flex items-center space-x-2 px-4 py-2"
                >
                  <div
                    style={{ backgroundImage: `url('${v.imageUrl}')` }}
                    className="mr-4 h-[100px] w-[100px] rounded-xl bg-cover bg-center"
                  />
                  <div>
                    <p className="capitalize text-slate-700">{v.visibility}</p>
                    <p className="font-semibold">{v.title}</p>
                    <p>Registration Ends: {formatDateAs.mmmcdd(v.beginsOn)}</p>
                  </div>
                  <div className="flex-grow"></div>
                  <div className="flex flex-col items-end">
                    <p>{randomInt(500)} enrolled</p>
                    <p>
                      <span className="text-semibold">{randomInt(30)}</span>{" "}
                      waiting
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="px-10 py-4">
            <div className="flex items-center px-10 py-2">
              <p className="text-xl font-semibold">Members</p>
              <div className="flex-grow"></div>
              <Link
                className="flex items-center rounded-xl border px-4 py-2"
                href={`/dashboard/orgs/${orgId}/members/new`}
              >
                New
              </Link>
              {/* <button className="flex items-center rounded-xl border px-4 py-2 text-red-600">
                Delete
              </button> */}
            </div>
            <hr />
            <ul className="max-h-[200px] overflow-y-auto py-2">
              {(await api.org.hasAnyMembersById(dtFilter)) || (
                <p className="px-6 text-lg">
                  This organisation has no members...
                </p>
              )}
              {(await api.org.getAllMembersByOrg(dtFilter)).map((v, i) => (
                <li key={i} className="flex items-center space-x-2 px-4 py-2">
                  {/* <div
                    style={{ backgroundImage: `url('${v.}')` }}
                    className="mr-4 h-[60px] w-[60px] rounded-xl bg-cover"
                  /> */}
                  <div>
                    <p className="font-semibold">{v.userEmail}</p>
                  </div>
                  <div className="flex-grow"></div>
                  <div>
                    <p className="">{v.role?.name}</p>
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

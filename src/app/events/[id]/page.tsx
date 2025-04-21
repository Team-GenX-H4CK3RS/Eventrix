import Link from "next/link";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import AppBar from "~/app/_components/appbar";
import { formatDateAs } from "~/server/util";

export default async function EventView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const id = parseInt((await params).id);

  void api.event.getById.prefetch({ id });

  const event = await api.event.getById({ id });

  return (
    <HydrateClient>
      <main className="flex flex-col">
        {session?.user ? <AppBar /> : ""}
        <div className="grid min-h-screen grid-cols-3 gap-10 p-10">
          <div className="col-span-2 flex flex-col gap-4">
            <div
              style={{ backgroundImage: `url('${event?.imageUrl}')` }}
              className="mr-4 h-[200px] w-full rounded-t-xl bg-cover bg-center"
            />
            <p className="-mt-20 bg-gradient-to-b from-transparent via-white to-white px-10 pb-5 pt-10 text-6xl font-semibold">
              {event?.title}
            </p>
            <hr />
            <p className="px-10 pt-3 text-justify text-lg">
              {event?.description}
            </p>
            <div className="flex-grow"></div>
            <div className="flex items-center rounded-xl border">
              <p className="p-10 text-2xl">
                Registration Ends In <br />
                <span className="text-2xl font-semibold">
                  {event?.beginsOn && formatDateAs.mmmcdd(event?.beginsOn)}
                </span>
              </p>
              <div className="flex-grow"></div>
              <div className="px-10 text-3xl font-semibold">
                <p>
                  {event?.enrollFee === 0 ? "Free" : `₹ ${event?.enrollFee}`}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-xl border p-10">
            <p className="flex flex-wrap items-center gap-2">
              {(event?.tags as string).split(",").map((v) => (
                <span
                  key={v}
                  className="rounded-full bg-blue-200 px-6 py-1 text-xl"
                >
                  {v}
                </span>
              ))}
            </p>
            <p>
              Where? <br />
              <span className="text-2xl font-semibold">{event?.location}</span>
            </p>
            <p>
              When? <br />
              <span className="text-2xl font-semibold">
                {event?.beginsOn && formatDateAs.mmmcdd(event?.beginsOn)}
              </span>
            </p>
            <div className="flex-grow"></div>
            <Link
              href={`/events/${id}/register`}
              className="rounded-xl bg-blue-700 py-3 text-center text-2xl font-semibold text-white"
            >
              Register
            </Link>
            {event?.enrollFee !== 0 ? (
              <a
                href={`https://razorpay.com/`}
                className="rounded-xl bg-blue-700 py-3 text-center text-2xl font-semibold text-white"
              >
                Pay
              </a>
            ) : (
              ""
            )}
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}

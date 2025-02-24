"use client";
import z from "zod";
import { api } from "~/trpc/react";
import AppBar from "~/app/_components/appbar";
import { useRouter } from "next/navigation";
import { DateTime } from "next-auth/providers/kakao";

export default function DashboardNewEvent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { mutate, error } = api.event.create.useMutation();
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col">
      <AppBar />
      <div className="flex flex-grow items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16">
          <p className="text-2xl font-semibold">Create New Event</p>
          <hr className="w-1/2" />
          <p className="text-red-700">{error?.message}</p>
          <form
            className="grid grid-cols-2 gap-12 text-xl"
            onSubmit={async (e) => {
              e.preventDefault();
              const zdt = z.string().datetime({
                local: true,
              });
              const fd = new FormData(e.currentTarget);

              mutate(
                {
                  title: fd.get("title") as string,
                  description: fd.get("description") as string,
                  location: fd.get("location") as string,
                  beginsOn: fd.get("beginsOn") as string,
                  endsOn: fd.get("endsOn") as string,
                  enrollEndsOn: fd.get("enrollEndsOn") as string,
                  orgId: parseInt((await params).id),
                  tags: fd.get("tags") as string,
                },
                {
                  onSuccess(data) {
                    router.push(`/dashboard/orgs/${data.id}`);
                  },
                },
              );
            }}
          >
            <label className="col-span-2 flex flex-col">
              <p>Title</p>
              <input
                type="text"
                name="title"
                className="rounded-xl border px-4 py-1"
              />
            </label>
            <label className="col-span-2 flex flex-col">
              <p className="">Description</p>
              <input
                type="text"
                name="description"
                className="rounded-xl border px-4 py-1"
              />
            </label>
            <label>
              <p className="">Location</p>
              <input
                type="text"
                name="location"
                className="rounded-xl border px-4 py-1"
              />
            </label>
            <label>
              <p className="">Starts On</p>
              <input
                type="datetime-local"
                name="beginsOn"
                className="rounded-xl border px-4 py-1"
              />
            </label>
            <label>
              <p className="">Starts On</p>
              <input
                type="datetime-local"
                name="endsOn"
                className="rounded-xl border px-4 py-1"
              />
            </label>
            <label>
              <p className="">Registration Ends On</p>
              <input
                type="datetime-local"
                name="enrollEndsOn"
                className="rounded-xl border px-4 py-1"
              />
            </label>
            <label className="col-span-2 flex flex-col">
              <p className="">Tags</p>
              <input
                type="text"
                name="tags"
                className="rounded-xl border px-4 py-1"
              />
            </label>
            <button className="col-span-2 rounded-xl bg-blue-700 px-6 py-2 text-white">
              Create
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

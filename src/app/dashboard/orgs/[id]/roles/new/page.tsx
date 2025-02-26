"use client";
import { api } from "~/trpc/react";
import AppBar from "~/app/_components/appbar";
import { useRouter } from "next/navigation";

export default function DashboardNewEvent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { mutate, error } = api.org.createRole.useMutation();
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
              const fd = new FormData(e.currentTarget);
              const orgId = parseInt((await params).id);
              mutate(
                {
                  orgId: orgId,
                  name: fd.get("name") as string,
                  hasAdmin: Boolean(fd.get("isAdmin") as string),
                  hasJoined: false,
                },
                {
                  onSuccess() {
                    router.back();
                  },
                },
              );
            }}
          >
            <label className="col-span-2 flex flex-col">
              <p className="">Role</p>
              <input
                type="text"
                name="name"
                className="rounded-xl border px-4 py-1"
              />
            </label>
            <label className="flex space-x-2">
              <input
                type="checkbox"
                name="isAdmin"
                className="rounded-xl border px-4 py-1"
              />
              <p className="">Is Admin</p>
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

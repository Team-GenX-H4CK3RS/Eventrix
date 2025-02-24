"use client";
import { api } from "~/trpc/react";
import AppBar from "~/app/_components/appbar";
import { useRouter } from "next/navigation";

export default function DashboardNewOrg() {
  const { mutate, error } = api.org.create.useMutation();
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col">
      <AppBar />
      <div className="flex flex-grow items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16">
          <p className="text-2xl font-semibold">Create New Organisation</p>
          <hr className="w-1/2" />
          <p className="text-red-700">{error?.message}</p>
          <form
            className="flex flex-col items-stretch space-y-4 text-xl"
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              mutate(
                {
                  name: fd.get("orgName") as string,
                },
                {
                  onSuccess(data) {
                    router.push(`/dashboard/orgs/${data.id}`);
                  },
                },
              );
            }}
          >
            <label>
              <p className="">Name</p>
              <input
                type="text"
                name="orgName"
                className="rounded-xl border px-4 py-1"
              />
            </label>
            <button className="rounded-xl bg-blue-700 px-6 py-2 text-white">
              Create
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

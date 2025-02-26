"use client";
import { api } from "~/trpc/react";
import AppBar from "~/app/_components/appbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardNewEvent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [orgId, setOrgId] = useState<number>();
  const { mutate, error } = api.org.createMember.useMutation();
  const { data: roles } = api.org.getRolesById.useQuery(
    { orgId: orgId ?? -1 },
    { enabled: !!orgId },
  );
  const router = useRouter();

  useEffect(() => {
    void (async () => setOrgId(parseInt((await params).id)))();
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      <AppBar />
      <div className="flex flex-grow items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16">
          <p className="text-2xl font-semibold">Create New Member</p>
          <hr className="w-1/2" />
          <p className="text-red-700">{error?.message}</p>
          <form
            className="flex flex-col gap-12 text-xl"
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const orgId = parseInt((await params).id);
              mutate(
                {
                  orgId: orgId,
                  roleId: parseInt(fd.get("roleId") as string),
                  userEmail: fd.get("userEmail") as string,
                },
                {
                  onSuccess() {
                    router.back();
                  },
                },
              );
            }}
          >
            <label className="flex flex-col">
              <p>Email</p>
              <input
                type="email"
                name="userEmail"
                className="rounded-xl border px-4 py-1"
              />
            </label>
            <label className="flex flex-col">
              <p className="">Role</p>
              <div className="flex items-center space-x-2">
                {" "}
                <select
                  name="roleId"
                  defaultValue={-1}
                  className="flex-grow rounded-xl border px-4 py-1"
                >
                  {roles?.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
                <Link
                  className="rounded-xl border px-4 py-1"
                  href={`/dashboard/orgs/${orgId}/roles/new`}
                >
                  New
                </Link>
              </div>
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

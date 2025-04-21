"use client";
import { api } from "~/trpc/react";

import Link from "next/link";
import { useState } from "react";

export default function Chatbot() {
  const { mutate, error } = api.chatbot.send.useMutation();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [response, setResponse] = useState<Record<string, string>>();
  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end gap-4">
      <div
        className={`flex h-[500px] w-[400px] flex-col rounded-xl border bg-white ${isOpen ? "" : "hidden"}`}
      >
        <div className="flex h-12 items-center border-b">
          <p className="px-4 py-2 font-semibold">Eventrix Assistant</p>
        </div>
        <div className="flex min-h-[400px] flex-col">
          {JSON.stringify(response)}
        </div>
        <form
          className="flex h-12 items-center gap-2 border-t px-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            mutate(
              {
                q: fd.get("q") as string,
              },
              {
                onSuccess(data) {
                  setResponse(data);
                },
              },
            );
          }}
        >
          <input type="text" name="q" className="flex-grow rounded-xl border" />
          <button className="rounded-lg border px-2 py-1 text-sm">Go</button>
        </form>
      </div>
      <button
        className="rounded-full bg-blue-700 px-4 py-2 text-white"
        onClick={() => setOpen((o) => !o)}
      >
        ChatBot
      </button>
    </div>
  );
}

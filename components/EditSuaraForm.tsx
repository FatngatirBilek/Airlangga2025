"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditTopicForm({
  id,
  nama,
  nomor,
  count,
}: {
  id: string;
  nama: string;
  nomor: string;
  count: string;
}) {
  const [newNama, setNewNama] = useState(nama);
  const [newNomor, setNewNomor] = useState(nomor);
  const [newCount, setNewCount] = useState(count);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/suara/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ newNama, newNomor, newCount }),
      });

      if (!res.ok) {
        throw new Error("Failed to update topic");
      }

      router.refresh();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        onChange={(e) => setNewNama(e.target.value)}
        value={newNama}
        className="border border-slate-500 px-8 py-2 rounded-2xl"
        type="text"
        placeholder="Topic Title"
      />

      <input
        onChange={(e) => setNewNomor(e.target.value)}
        value={newNomor}
        className="border border-slate-500 px-8 py-2 rounded-2xl"
        type="text"
        placeholder="Topic Description"
      />

      <input
        onChange={(e) => setNewCount(e.target.value)}
        value={newCount}
        className="border border-slate-500 px-8 py-2 rounded-2xl"
        type="text"
        placeholder="Topic Content"
      />

      <button className="bg-gray-600 font-bold text-white py-3 px-6 w-fit rounded-xl">
        Update Suara
      </button>
    </form>
  );
}

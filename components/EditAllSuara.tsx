"use client";
import { useEffect, useState } from "react";

// Define the Suara type
interface Suara {
  _id: string;
  nama: string;
  nomor: string;
  count: string;
}

export default function EditAllSuara() {
  const [suaraList, setSuaraList] = useState<Suara[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all suara on mount
  useEffect(() => {
    fetch("/api/suara")
      .then((res) => res.json())
      .then((data: Suara[]) => {
        setSuaraList(data);
        setLoading(false);
      });
  }, []);

  // Handle edit for a single Suara
  const handleEdit = async (index: number) => {
    const suara = suaraList[index];
    const res = await fetch(`/api/suara/${suara._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newNama: suara.nama,
        newNomor: suara.nomor,
        newCount: suara.count,
      }),
    });

    if (res.ok) {
      alert("Suara updated!");
      // Optional: Refetch data to get the latest (uncomment if you want it to refresh)
      // fetch("/api/suara")
      //   .then((res) => res.json())
      //   .then((data: Suara[]) => setSuaraList(data));
      // window.dispatchEvent(new Event("suaraUpdated")); // For chart update, if needed
    } else {
      alert("Failed to update suara!");
    }
  };

  // Handle input change
  const handleChange = (index: number, field: keyof Suara, value: string) => {
    setSuaraList((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Edit Semua Suara</h2>
      <table className="min-w-full table-auto mb-8">
        <thead>
          <tr>
            <th className="border px-2 py-1">Nama</th>
            <th className="border px-2 py-1">Nomor</th>
            <th className="border px-2 py-1">Count</th>
            <th className="border px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {suaraList.map((suara, idx) => (
            <tr key={suara._id}>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={suara.nama}
                  onChange={(e) => handleChange(idx, "nama", e.target.value)}
                  className="border px-2 py-1 rounded"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={suara.nomor}
                  onChange={(e) => handleChange(idx, "nomor", e.target.value)}
                  className="border px-2 py-1 rounded"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={suara.count}
                  onChange={(e) => handleChange(idx, "count", e.target.value)}
                  className="border px-2 py-1 rounded"
                />
              </td>
              <td className="border px-2 py-1">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => handleEdit(idx)}
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

interface Suara {
  _id: string;
  nama: string;
  nomor: string;
  count: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type NotifType = "success" | "error" | "";

export default function EditAllSuara() {
  const {
    data: suaraList,
    isLoading,
    mutate,
  } = useSWR<Suara[]>("/api/suara", fetcher);

  const [editList, setEditList] = useState<Suara[]>([]);
  const [notif, setNotif] = useState<{ message: string; type: NotifType }>({
    message: "",
    type: "",
  });
  const [notifOpen, setNotifOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (suaraList) setEditList(suaraList);
  }, [suaraList]);

  const handleChange = (index: number, field: keyof Suara, value: string) => {
    setEditList((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  // Save all edited suara
  const handleSaveAll = async () => {
    setSaving(true);
    let success = true;
    for (const suara of editList) {
      const res = await fetch(`/api/suara/${suara._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newNama: suara.nama,
          newNomor: suara.nomor,
          newCount: suara.count,
        }),
      });
      if (!res.ok) success = false;
    }
    setSaving(false);
    if (success) {
      setNotif({ message: "All suara updated!", type: "success" });
      mutate(); // refresh the list
    } else {
      setNotif({ message: "Some suara failed to update!", type: "error" });
    }
    setNotifOpen(true);
    setTimeout(() => setNotifOpen(false), 2500);
  };

  if (isLoading || !editList) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Edit Semua Suara</h2>
      <table className="min-w-full table-auto mb-8">
        <thead>
          <tr>
            <th className="border px-2 py-1">Nama</th>
            <th className="border px-2 py-1">Nomor</th>
            <th className="border px-2 py-1">Count</th>
          </tr>
        </thead>
        <tbody>
          {editList.map((suara, idx) => (
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
            </tr>
          ))}
        </tbody>
      </table>

      {/* Global Save Button at the bottom right */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveAll}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save All"}
        </Button>
      </Box>

      {/* Material UI Alert notification at the bottom right */}
      <Box
        sx={{
          position: "fixed",
          right: 24,
          bottom: 24,
          display: "flex",
          alignItems: "flex-end",
          zIndex: 1400,
          pointerEvents: "none",
        }}
      >
        <Slide direction="up" in={notifOpen} mountOnEnter unmountOnExit>
          <Alert
            severity={notif.type === "success" ? "success" : "error"}
            sx={{ minWidth: 280, pointerEvents: "auto" }}
            variant="filled"
          >
            {notif.message}
          </Alert>
        </Slide>
      </Box>
    </div>
  );
}

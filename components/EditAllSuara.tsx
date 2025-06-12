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
  } = useSWR<Suara[]>("/api/suara", fetcher, {
    refreshInterval: 5000,
  });

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
      mutate();
    } else {
      setNotif({ message: "Some suara failed to update!", type: "error" });
    }
    setNotifOpen(true);
    setTimeout(() => setNotifOpen(false), 2500);
  };

  if (isLoading || !editList) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center py-2">
      <div className="w-full max-w-4xl bg-[#10141f] rounded-xl p-5 shadow-lg mx-2">
        <h2 className="text-3xl font-bold mb-8 text-gray-100">
          Edit Semua Suara
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-200 bg-[#141a28]">
                  Nama
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-200 bg-[#141a28]">
                  Nomor
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-200 bg-[#141a28]">
                  Jumlah Suara
                </th>
              </tr>
            </thead>
            <tbody>
              {editList.map((suara, idx) => (
                <tr key={suara._id}>
                  <td className="px-4 py-2 bg-[#171c29]">
                    <input
                      type="text"
                      value={suara.nama}
                      onChange={(e) =>
                        handleChange(idx, "nama", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded bg-[#232b3d] text-gray-100 border border-gray-700 focus:border-blue-600 outline-none transition"
                    />
                  </td>
                  <td className="px-4 py-2 bg-[#171c29]">
                    <input
                      type="text"
                      value={suara.nomor}
                      onChange={(e) =>
                        handleChange(idx, "nomor", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded bg-[#232b3d] text-gray-100 border border-gray-700 focus:border-blue-600 outline-none transition"
                    />
                  </td>
                  <td className="px-4 py-2 bg-[#171c29]">
                    <input
                      type="text"
                      value={suara.count}
                      onChange={(e) =>
                        handleChange(idx, "count", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded bg-[#232b3d] text-gray-100 border border-gray-700 focus:border-blue-600 outline-none transition"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-8">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveAll}
            disabled={saving}
            style={{
              background: "#1976d2",
              color: "#fff",
              fontWeight: 600,
              letterSpacing: "1px",
              borderRadius: "0.5rem",
            }}
          >
            {saving ? "Saving..." : "SAVE ALL"}
          </Button>
        </div>
      </div>
      {/* Notification */}
      <Box
        sx={{
          position: "fixed",
          right: 16,
          bottom: 16,
          display: "flex",
          alignItems: "flex-end",
          zIndex: 1400,
          pointerEvents: "none",
        }}
      >
        <Slide direction="up" in={notifOpen} mountOnEnter unmountOnExit>
          <Alert
            severity={notif.type === "success" ? "success" : "error"}
            sx={{ minWidth: 220, pointerEvents: "auto" }}
            variant="filled"
          >
            {notif.message}
          </Alert>
        </Slide>
      </Box>
    </div>
  );
}

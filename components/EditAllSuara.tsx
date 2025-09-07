"use client";
import { useEffect, useState, ReactElement } from "react";
import useSWR from "swr";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button, { ButtonProps } from "@mui/material/Button";
import React from "react";

interface Suara {
  _id: string;
  nama: string;
  nomor: string;
  count: string;
}

type ChartToggleButtonType =
  | ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>
  | ReactElement<ButtonProps>;
type HasilToggleButtonType =
  | ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>
  | ReactElement<ButtonProps>;

export default function EditAllSuara({
  chartToggleButton,
  hasilToggleButton,
}: {
  chartToggleButton?: ChartToggleButtonType;
  hasilToggleButton?: HasilToggleButtonType;
}) {
  const {
    data: suaraList,
    isLoading,
    mutate,
  } = useSWR<Suara[]>(
    "/api/suara",
    (url) => fetch(url).then((res) => res.json()),
    { refreshInterval: 5000 },
  );

  const [editList, setEditList] = useState<Suara[]>([]);
  const [notif, setNotif] = useState<{
    message: string;
    type: "success" | "error" | "";
  }>({ message: "", type: "" });
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

  // Universal button style
  const customButtonStyle: React.CSSProperties = {
    background: "#12c95b",
    color: "#fff",
    fontWeight: 500,
    borderRadius: "12px",
    fontSize: "16px",
    padding: "10px 24px",
    letterSpacing: "1px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 2px 8px 0 rgba(18,201,91,0.07)",
    fontFamily: "inherit",
    height: "100%",
  };

  function renderButton(btn: ChartToggleButtonType | HasilToggleButtonType) {
    if (!React.isValidElement(btn)) return btn;
    return React.cloneElement(btn, {
      style: {
        ...customButtonStyle,
        ...(btn.props && "style" in btn.props
          ? (btn.props.style as React.CSSProperties)
          : {}),
      },
    });
  }

  return (
    <div
      className="w-full mx-auto relative"
      style={{
        maxWidth: "950px",
        minWidth: "600px",
        marginTop: "48px",
        padding: "52px 40px 90px 40px",
        background: "rgba(180,255,180,0.44)",
        borderRadius: "40px",
        boxShadow:
          "0 8px 64px 0 rgba(0,80,0,0.13), 0 0 128px 0 rgba(97,255,130,0.32) inset",
        border: "3px solid rgba(60,255,125,0.18)",
        backdropFilter: "blur(18px)",
      }}
    >
      <h2
        className="details-paslon text-4xl font-bold text-center mb-10"
        style={{
          color: "#244f2b",
          letterSpacing: "2px",
        }}
      >
        Edit Semua Suara
      </h2>
      <div className="overflow-x-auto w-full">
        <table className="w-full" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th
                style={{
                  color: "#244f2b",
                  fontSize: "25px",
                  fontWeight: 700,
                  paddingBottom: "20px",
                  width: "36%",
                }}
              >
                Nama
              </th>
              <th
                style={{
                  color: "#244f2b",
                  fontSize: "25px",
                  fontWeight: 700,
                  paddingBottom: "20px",
                  width: "22%",
                }}
              >
                Nomor
              </th>
              <th
                style={{
                  color: "#244f2b",
                  fontSize: "20px",
                  fontWeight: 700,
                  paddingBottom: "20px",
                  width: "22%",
                }}
              >
                Jumlah Suara
              </th>
            </tr>
          </thead>
          <tbody>
            {editList.map((suara, idx) => (
              <tr key={suara._id} style={{ height: 68 }}>
                <td>
                  <input
                    type="text"
                    value={suara.nama}
                    onChange={(e) => handleChange(idx, "nama", e.target.value)}
                    className="font-bold details-paslon text-center"
                    style={{
                      width: "98%",
                      background: "rgba(220,255,213,0.95)",
                      border: "2px solid #b7e9b1",
                      borderRadius: "16px",
                      padding: "14px 0",
                      color: "#244f2b",
                      fontSize: "18px",
                      boxShadow: "0 2px 8px 0 rgba(60,255,125,0.09)",
                      outline: "none",
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={suara.nomor}
                    onChange={(e) => handleChange(idx, "nomor", e.target.value)}
                    className="font-bold text-center"
                    style={{
                      width: "98%",
                      background: "rgba(220,255,213,0.95)",
                      border: "2px solid #b7e9b1",
                      borderRadius: "16px",
                      padding: "14px 0",
                      color: "#244f2b",
                      fontSize: "18px",
                      boxShadow: "0 2px 8px 0 rgba(60,255,125,0.09)",
                      outline: "none",
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={suara.count}
                    onChange={(e) => handleChange(idx, "count", e.target.value)}
                    className="font-bold text-center"
                    style={{
                      width: "98%",
                      background: "rgba(220,255,213,0.95)",
                      border: "2px solid #b7e9b1",
                      borderRadius: "16px",
                      padding: "14px 0",
                      color: "#244f2b",
                      fontSize: "18px",
                      boxShadow: "0 2px 8px 0 rgba(60,255,125,0.09)",
                      outline: "none",
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action buttons pinned to bottom right */}
      <div
        style={{
          position: "absolute",
          right: 36,
          bottom: 25,
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          zIndex: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={handleSaveAll}
          disabled={saving}
          style={{
            background: "#e8fa71",
            color: "#274f2b",
            fontWeight: 700,
            borderRadius: "18px",
            fontSize: "18px",
            boxShadow: "0 2px 12px 0 rgba(60,255,125,0.09)",
            padding: "10px 30px",
            letterSpacing: "1px",
            textTransform: "none",
            fontFamily: "inherit",
            minWidth: "110px",
            height: "48px",
          }}
        >
          {saving ? "Saving..." : "SAVE"}
        </Button>
        {chartToggleButton && (
          <div
            style={{ display: "flex", alignItems: "center", height: "48px" }}
          >
            {renderButton(chartToggleButton)}
          </div>
        )}
        {hasilToggleButton && (
          <div
            style={{ display: "flex", alignItems: "center", height: "48px" }}
          >
            {renderButton(hasilToggleButton)}
          </div>
        )}
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
        {notifOpen && (
          <Alert
            severity={notif.type === "success" ? "success" : "error"}
            sx={{ minWidth: 220, pointerEvents: "auto" }}
            variant="filled"
          >
            {notif.message}
          </Alert>
        )}
      </Box>
    </div>
  );
}

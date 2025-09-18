"use client";
import Image from "next/image";
import React from "react";
import useSWR from "swr";
import menangbg from "@/public/images/bg-hp.png";
import paslon1menanghp from "@/public/images/paslonmenang/paslon1menanghp.png";
import paslon2menanghp from "@/public/images/paslonmenang/paslon2menanghp.png";
import paslon3menanghp from "@/public/images/paslonmenang/paslon3menanghp.png";

const paslonImageMap: Record<string, string> = {
  "1": paslon1menanghp.src,
  "2": paslon2menanghp.src,
  "3": paslon3menanghp.src,
};

interface Suara {
  nama: string;
  nomor: string;
  count: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PaslonWinnerMobile() {
  const { data: suaraList } = useSWR<Suara[]>("/api/suara", fetcher, {
    refreshInterval: 5000,
  });

  const winner =
    suaraList && suaraList.length > 0
      ? suaraList.reduce((max, curr) =>
          Number(curr.count) > Number(max.count) ? curr : max,
        )
      : null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center">
      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={menangbg}
          alt="background image"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>

      {/* Logo and badges */}
      <div className="absolute top-3 items-center flex gap-2 z-20">
        <Image
          src="/images/logoportal.svg"
          alt="Logo"
          width={220}
          height={220}
        />
      </div>
      {/* Title - moved further down to fit glass area */}
      <div className="w-full flex flex-col items-center mt-[190px] z-20 relative">
        {/* OUTLINE LAYER */}
        <span
          className="dashboard-title absolute inset-0 pointer-events-none select-none text-stroke-6 text-center tracking-wide leading-tight"
          style={{
            fontWeight: 900,
            fontSize: "3.5rem",
            color: "transparent",
            letterSpacing: "0.04em",
            lineHeight: 1.05,
            textShadow: "0 2px 16px rgba(21,68,60,0.08)",
            width: "100%",
            display: "block",
            padding: "1px",
          }}
        >
          SELAMAT
          <br />
          &amp;
          <br />
          SUKSES
        </span>
        {/* FILL LAYER */}
        <span
          className="dashboard-title relative text-[#15443C] text-center drop-shadow-lg tracking-wide leading-tight"
          style={{
            fontWeight: 900,
            fontSize: "3.5rem",
            letterSpacing: "0.04em",
            lineHeight: 1.05,
            textShadow: "0 2px 16px rgba(21,68,60,0.08)",
            width: "100%",
            display: "block",
            padding: "1px",
          }}
        >
          SELAMAT
          <br />
          &amp;
          <br />
          SUKSES
        </span>
      </div>
      {/* Winner Layered Section */}
      {winner ? (
        <div
          className="relative w-full flex flex-col items-center z-20"
          style={{ minHeight: 520 }}
        >
          {/* PASLON Image as full-width background layer */}
          <div
            className="absolute left-0 w-full z-10 pointer-events-none"
            style={{
              top: "-360px",
              minWidth: 420,
              maxWidth: 1020,
              minHeight: 940,
              maxHeight: 1000,
            }}
          >
            <Image
              src={paslonImageMap[winner.nomor]}
              alt="Paslon Winner"
              fill
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                borderRadius: 0,
              }}
              quality={100}
              priority
            />
          </div>
          {/* PASLON Info and Message */}
          <div
            className="details-paslon relative flex flex-col items-start w-full max-w-[420px] mx-auto mt-[220px] z-20"
            style={{ top: "100px" }}
          >
            {/* PASLON NO */}
            <span className="relative flex flex-col w-full">
              {/* OUTLINE */}
              <span
                className="absolute inset-0 pointer-events-none select-none text-stroke-2 text-3xl tracking-wide"
                style={{
                  color: "transparent",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  lineHeight: "2.25rem",
                }}
              >
                PASLON {winner.nomor}
              </span>
              {/* FILL */}
              <span
                className="relative text-3xl text-[#15443C] mb-1 tracking-wide"
                style={{
                  fontWeight: 900,
                  letterSpacing: "1px",
                  lineHeight: "2.25rem",
                }}
              >
                PASLON {winner.nomor}
              </span>
            </span>
            {/* NAMA PASLON */}
            <span className="relative flex flex-col w-full">
              {/* OUTLINE */}
              <span
                className="absolute inset-0 pointer-events-none select-none text-stroke-2 text-3xl uppercase border-b-4 tracking-wide"
                style={{
                  color: "transparent",
                  fontWeight: 900,
                  letterSpacing: "2px",
                  lineHeight: "2.25rem",
                }}
              >
                {winner.nama}
              </span>
              {/* FILL */}
              <span
                className="relative text-3xl text-[#15443C] uppercase border-b-4 border-[#E4D41F] mb-2 px-0 tracking-wide"
                style={{
                  fontWeight: 900,
                  letterSpacing: "2px",
                  lineHeight: "2.25rem",
                }}
              >
                {winner.nama}
              </span>
            </span>
            {/* MITRATAMA */}
            <span className="relative flex flex-col w-full">
              {/* OUTLINE */}
              <span
                className="absolute inset-0 pointer-events-none select-none text-stroke-1_5 text-lg tracking-wide"
                style={{
                  color: "transparent",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  lineHeight: "1.75rem",
                }}
              >
                SEBAGAI MITRATAMA DAN MITRAMUDA
              </span>
              {/* FILL */}
              <span
                className="relative text-lg text-[#15443C] mb-1 tracking-wide"
                style={{
                  fontWeight: 700,
                  letterSpacing: "1px",
                  lineHeight: "1.75rem",
                }}
              >
                SEBAGAI MITRATAMA DAN MITRAMUDA
              </span>
            </span>
            {/* TAHUN */}
            <span className="relative flex flex-col w-full">
              {/* OUTLINE */}
              <span
                className="absolute inset-0 pointer-events-none select-none text-stroke-1_5 text-lg font-bold tracking-wide"
                style={{
                  color: "transparent",
                  fontWeight: 700,
                  lineHeight: "1.75rem",
                }}
              >
                2025/2026
              </span>
              {/* FILL */}
              <span
                className="relative text-lg font-bold text-[#15443C] mb-3 tracking-wide"
                style={{
                  lineHeight: "1.75rem",
                }}
              >
                2025/2026
              </span>
            </span>
          </div>
          <div
            className="relative w-full flex justify-center z-20"
            style={{ top: "80px", left: "-10px" }}
          >
            <span className="text-white details-paslon font-medium text-base rounded-lg px-4 py-2 mt-4 mb-2 max-w-[600px] text-left ">
              Semoga amanah ini dapat diemban dengan baik
              <br />
              dan membawa kemajuan bagi OSIS serta sekolah kita.
            </span>
          </div>
        </div>
      ) : (
        <span className="text-xl font-bold text-gray-700 mt-8 z-20">
          Loading...
        </span>
      )}
    </div>
  );
}

"use client";
import Image from "next/image";
import React from "react";
import useSWR from "swr";
import portalbg from "@/public/images/dashboardbg.webp";
import paslon1menang from "@/public/images/paslonmenang/paslon1menang.png";
import paslon2menang from "@/public/images/paslonmenang/paslon2menang.png";
import paslon3menang from "@/public/images/paslonmenang/paslon3menang.png";

interface Suara {
  nama: string;
  nomor: string;
  count: string;
}

const paslonImageMap: Record<string, string> = {
  "1": paslon1menang.src,
  "2": paslon2menang.src,
  "3": paslon3menang.src,
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PaslonWinner() {
  const { data: suaraList, isLoading } = useSWR<Suara[]>(
    "/api/suara",
    fetcher,
    {
      refreshInterval: 5000,
    },
  );

  if (isLoading || !suaraList) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-700">Loading...</span>
      </div>
    );
  }

  // Find the winner (highest vote count)
  const winner = suaraList.reduce((max, curr) =>
    Number(curr.count) > Number(max.count) ? curr : max,
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={portalbg}
          alt="background image"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>
      {/* Glassy card at the bottom */}
      <div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 z-10 flex flex-col items-center justify-center"
        style={{
          width: "80vw",
          maxWidth: "1300px",
          height: "70vh",
          minHeight: "350px",
          borderRadius: "40px",
          background: "rgba(199,228,86,0.37)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.13)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "2.5px solid rgba(255,255,255,0.18)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* SELAMAT & SUKSES */}
        <div className="w-full flex justify-center mt-12 mb-4">
          <span
            className="font-extrabold details-paslon text-[3.5vw] md:text-[2.5vw] text-center tracking-wide"
            style={{
              color: "#15443C",
              letterSpacing: "0.06em",
              textShadow: "0 2px 12px rgba(0,0,0,0.09)",
            }}
          >
            SELAMAT&nbsp;&amp;&nbsp;SUKSES
          </span>
        </div>

        {/* Winner image - bigger and centered */}
        <div
          className="relative mx-auto mb-6 flex items-center justify-center"
          style={{
            width: "36vw",
            height: "44vw",
            minWidth: "340px",
            minHeight: "420px",
            maxWidth: "520px",
            maxHeight: "630px",
          }}
        >
          <Image
            src={paslonImageMap[winner.nomor]}
            alt="Paslon Winner"
            fill
            className="object-contain"
            priority
            style={{
              borderRadius: "18px",
              boxShadow: "0 6px 36px 0 rgba(31,38,135,0.20)",
            }}
          />
        </div>

        {/* Winner info */}
        <div className="w-full flex flex-col items-center mb-2">
          <span
            className="font-extrabold details-paslon text-[1.6rem] md:text-3xl text-center uppercase tracking-widest"
            style={{ color: "#15443C" }}
          >
            {`PASLON ${winner.nomor}`}
          </span>
          <span
            className="font-extrabold details-paslon text-[1.6rem] md:text-3xl text-center uppercase tracking-widest"
            style={{ color: "#15443C", marginTop: "0.25em" }}
          >
            {winner.nama}
          </span>
          <span
            className="font-bold details-paslon text-lg md:text-xl mt-2 text-center"
            style={{ color: "#15443C" }}
          >
            {winner.count} SUARA
          </span>
          <span
            className="font-semibold text-lg md:text-xl mt-4 text-center"
            style={{ color: "#15443C", maxWidth: "85%", lineHeight: "1.5" }}
          >
            SEBAGAI MITRATAMA DAN MITRAMUDA 2025/2026
          </span>
          <span
            className="font-medium text-base md:text-lg mt-4 text-center"
            style={{ color: "#15443C", maxWidth: "80%", lineHeight: "1.4" }}
          >
            Semoga amanah ini dapat diemban dengan baik dan membawa kemajuan
            bagi OSIS serta sekolah kita.
          </span>
        </div>
      </div>
    </div>
  );
}

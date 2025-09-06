"use client";
import Image from "next/image";
import React from "react";
import useSWR from "swr";
import portalbg from "@/public/images/hasilbg.png";
import gradient from "@/public/images/gradient.png";
import paslon1menang from "@/public/images/paslonmenang/paslon1menang.png";
import paslon2menang from "@/public/images/paslonmenang/paslon2menang.png";
import paslon3menang from "@/public/images/paslonmenang/paslon3menang.png";

const paslonImageMap: Record<string, string> = {
  "1": paslon1menang.src,
  "2": paslon2menang.src,
  "3": paslon3menang.src,
};

interface Suara {
  nama: string;
  nomor: string;
  count: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PaslonWinner() {
  const { data: suaraList, isLoading } = useSWR<Suara[]>(
    "/api/suara",
    fetcher,
    { refreshInterval: 5000 },
  );

  if (isLoading || !suaraList) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-700">Loading...</span>
      </div>
    );
  }

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
      {/* Logo */}
      <Image
        src="/images/logoportal.svg"
        alt="Logo"
        className="absolute top-8 left-8 h-24 w-auto z-20"
        width={50}
        height={50}
        priority
      />

      {/* Main congratulation layout */}
      <div
        className="absolute left-1/2 top-[21%] -translate-x-1/2 z-10 flex flex-col"
        style={{
          width: "92vw",
          maxWidth: "1240px",
          minHeight: "610px",
          height: "610px",
          padding: "0 0 0 0",
        }}
      >
        {/* SELAMAT & SUKSES */}
        <div className="w-full flex justify-center mb-2 mt-2">
          <span
            className="details-paslon text-8xl font-extrabold text-center tracking-wide"
            style={{
              color: "#244f2b",
              letterSpacing: "0.09em",
              textShadow: "0 2px 16px rgba(0,0,0,0.09)",
              lineHeight: 1,
            }}
          >
            SELAMAT &amp; SUKSES
          </span>
        </div>
        <div
          className="w-full flex flex-row items-end justify-between pt-6"
          style={{ height: "100%" }}
        >
          {/* Left - PASLON Info */}
          <div
            className="flex flex-col items-start justify-end pb-12 pl-10"
            style={{ flex: "2", minWidth: 320 }}
          >
            <span
              className="details-paslon font-bold text-[1.15vw] md:text-xl mb-1"
              style={{ color: "#244f2b", marginBottom: 6 }}
            >
              {`PASLON ${winner.nomor}`}
            </span>
            <span
              className="details-paslon font-extrabold text-[2.4vw] md:text-[2vw] uppercase mb-2"
              style={{
                color: "#244f2b",
                letterSpacing: "2px",
                marginBottom: 8,
                lineHeight: 1.1,
              }}
            >
              {winner.nama}
            </span>
            <span
              className="details-paslon font-bold text-[1.2vw] md:text-lg mb-1"
              style={{ color: "#244f2b", marginBottom: 6 }}
            >
              SEBAGAI MITRATAMA DAN MITRAMUDA
            </span>
            <span
              className="details-paslon font-bold text-[1vw] md:text-lg"
              style={{ color: "#244f2b" }}
            >
              2025/2026
            </span>
          </div>
          {/* Center - PASLON Image */}
          <div
            className="relative flex items-end justify-center pb-7"
            style={{
              width: "30vw",
              minWidth: "425px",
              maxWidth: "530px",
              height: "540px",
              flex: "2",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
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
              }}
            />
          </div>
          {/* Right - congratulation message */}
          <div
            className="flex flex-col items-end justify-end pb-14 pr-10"
            style={{ flex: "2", minWidth: 320 }}
          >
            <div
              className="details-paslon font-semibold text-lg md:text-xl text-right"
              style={{
                color: "#244f2b",
                background: "rgba(255,255,255,0.30)",
                borderRadius: "14px",
                padding: "16px 24px",
                borderLeft: "4px solid #244f2b",
                boxShadow: "0 2px 20px rgba(36,79,43,0.08)",
                maxWidth: "330px",
                lineHeight: "1.4",
              }}
            >
              Semoga amanah ini dapat diemban dengan baik
              <br />
              dan membawa kemajuan bagi OSIS serta sekolah kita.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

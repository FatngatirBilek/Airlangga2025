"use client";
import Image from "next/image";
import React from "react";
import useSWR from "swr";
import portalbg from "@/public/images/hasilbg.png";
import paslon1menang from "@/public/images/paslonmenang/paslon1menang.png";
import paslon2menang from "@/public/images/paslonmenang/paslon2menang.png";
import paslon3menang from "@/public/images/paslonmenang/paslon3menang.png";

const paslonImageMap: Record<string, string> = {
  "1": paslon1menang.src,
  "2": paslon2menang.src,
  "3": paslon3menang.src,
};

const TITLE_COLOR = "#15443C";
const PASLON_YELLOW = "#E4D41F";

interface Suara {
  nama: string;
  nomor: string;
  count: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PaslonWinner() {
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
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <div className="fixed inset-0 -z-10 w-full h-full">
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
        className="absolute top-8 left-8 h-24 w-auto z-30"
        width={50}
        height={50}
        priority
      />

      {/* Title (stretched full width, big, no translucent container) */}
      <div
        className="absolute left-0 top-40 z-40 w-full flex items-center justify-center"
        style={{
          height: "170px",
        }}
      >
        <span
          className="dashboard-title"
          style={{
            color: TITLE_COLOR,
            fontWeight: 900,
            fontSize: "9rem",
            letterSpacing: "0.08em",
            textShadow: "0 2px 16px rgba(21,68,60,0.08)",
            textAlign: "center",
            lineHeight: 1.1,
            width: "100%",
            display: "block",
          }}
        >
          SELAMAT &amp; SUKSES
        </span>
      </div>

      {/* Centered PASLON image and congratulation overlay */}
      <div
        className="flex items-center justify-center absolute top-0 left-0 w-full h-full z-20"
        style={{
          minHeight: "100vh",
        }}
      >
        {winner ? (
          <div
            className="relative flex flex-col items-center justify-center"
            style={{
              width: "1920px",
              height: "1080px",
              maxWidth: "100vw",
              maxHeight: "100vh",
              boxShadow: "0 8px 32px rgba(0,0,0,0.09)",
              borderRadius: "18px",
              overflow: "hidden",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            {/* PASLON Image */}
            <Image
              src={paslonImageMap[winner.nomor]}
              alt="Paslon Winner"
              width={1920}
              height={1080}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                borderRadius: "18px",
              }}
              quality={100}
              priority
            />

            {/* Paslon info and congratulation message at the bottom */}
            <div
              className="absolute left-0 bottom-0 w-full flex flex-row items-end justify-between px-24 pb-12"
              style={{
                height: "274px",
                minHeight: "170px",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(228,212,31,0.25) 85%)",
              }}
            >
              {/* Left PASLON info */}
              <div
                className="flex flex-col justify-end items-start"
                style={{ minWidth: 320 }}
              >
                <span
                  className="details-paslon"
                  style={{
                    color: TITLE_COLOR,
                    fontWeight: 800,
                    fontSize: "2.35rem",
                    letterSpacing: "1px",
                    marginBottom: "8px",
                  }}
                >{`PASLON ${winner.nomor}`}</span>
                <span
                  className="details-paslon"
                  style={{
                    color: TITLE_COLOR,
                    fontWeight: 900,
                    fontSize: "2.4rem",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                    borderBottom: `4px solid ${PASLON_YELLOW}`,
                    display: "inline-block",
                  }}
                >
                  {winner.nama}
                </span>
                <span
                  className="details-paslon"
                  style={{
                    color: TITLE_COLOR,
                    fontWeight: 700,
                    fontSize: "2.5rem",
                    letterSpacing: "1px",
                    marginBottom: "6px",
                  }}
                >
                  SEBAGAI MITRATAMA DAN MITRAMUDA
                </span>
                <span
                  className="details-paslon"
                  style={{
                    color: TITLE_COLOR,
                    fontWeight: 700,
                    fontSize: "2rem",
                  }}
                >
                  2025/2026
                </span>
              </div>
              {/* Right congratulation message */}
              <div
                className="flex flex-col justify-end items-end"
                style={{ minWidth: 320 }}
              >
                <span
                  className="details-paslon"
                  style={{
                    color: TITLE_COLOR,
                    fontWeight: 800,
                    fontSize: "2rem",
                    textAlign: "right",
                    background: "rgba(255,255,255,0.00)",
                    borderRadius: 10,
                    left: 20,
                    padding: "10px 0px",
                    maxWidth: 450,
                    lineHeight: "1.2",
                    marginBottom: "8px",
                  }}
                >
                  Semoga amanah ini dapat diemban dengan baik
                  <br />
                  dan membawa kemajuan bagi OSIS serta sekolah kita.
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-[1920px] h-[1080px]">
            <span className="text-2xl font-bold text-gray-700">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
}

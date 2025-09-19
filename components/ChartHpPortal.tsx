"use client";
import useSWR from "swr";
import { useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  TooltipItem,
} from "chart.js";
import portalhpbg from "@/public/images/portalhp.png";
Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

interface SuaraData {
  _id: string;
  nama: string;
  nomor: string;
  count: string;
}

const chartColors = ["#F76102", "#F7A43A", "#FFDC04", "#FFDE94"];
const suaraTextColors = [
  "text-white",
  "text-white",
  "text-[#9f6c00]",
  "text-white",
];

const paslonImages = [
  "/images/paslon1.jpg",
  "/images/paslon2.jpg",
  "/images/paslon3.jpg",
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function (context: TooltipItem<"doughnut">): string {
          const label = context.label || "";
          const value = context.parsed || 0;
          return `${label}: ${value}`;
        },
      },
    },
  },
  cutout: "60%",
};

export default function ChartHpPortal() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const {
    data: apiData,
    error,
    isLoading,
  } = useSWR<SuaraData[]>("/api/suara", fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 5000,
  });

  const paslonData = useMemo(
    () =>
      apiData?.filter(
        (d) => d.nomor !== "" && d.nama.toLowerCase() !== "tidaksah",
      ) ?? [],
    [apiData],
  );

  const tidaksahData = useMemo(
    () => apiData?.find((d) => d.nama.toLowerCase() === "tidaksah"),
    [apiData],
  );

  const chartData = useMemo(
    () => ({
      labels: [...paslonData.map((item) => item.nama), "tidaksah"],
      datasets: [
        {
          label: "Jumlah Suara",
          data: [
            ...paslonData.map((item) => parseInt(item.count, 10)),
            tidaksahData ? parseInt(tidaksahData.count, 10) : 0,
          ],
          backgroundColor: [
            ...paslonData.map(
              (_, idx) => chartColors[idx % chartColors.length],
            ),
            chartColors[3],
          ],
          borderColor: [
            ...paslonData.map(
              (_, idx) => chartColors[idx % chartColors.length],
            ),
            chartColors[3],
          ],
          borderWidth: 4,
        },
      ],
    }),
    [paslonData, tidaksahData],
  );

  useEffect(() => {
    if (chartRef.current && paslonData.length && !isLoading && !error) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
        chartInstanceRef.current = new Chart(ctx, {
          type: "doughnut",
          data: chartData,
          options: options,
        });
      }
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [paslonData, tidaksahData, isLoading, error, chartData]);

  // Mobile card sizing
  const cardWidth = 420;
  const cardImageHeight = 120;
  const cardRadius = 14;
  const pillWidth = "90%";
  const pillRadius = 9;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={portalhpbg}
          alt="background image"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>

      {/* Logo and badges */}
      <div className="absolute top-3 left-3 flex gap-2 z-20">
        <Image
          src="/images/logoportal.svg"
          alt="Logo"
          width={120}
          height={120}
        />
      </div>

      {/* Title */}
      <div className="w-full flex justify-center mt-20 mb-2 z-10 relative">
        <h1 className="text-white text-center text-2xl drop-shadow-lg leading-tight dashboard-title">
          DASHBOARD PERHITUNGAN SUARA <br />
          AIRLANGGA 2025
        </h1>
      </div>

      {/* Chart */}
      <div className="w-full flex justify-center items-center mt-10 relative">
        <div className="relative flex items-center justify-center h-[280px] w-[280px] mb rounded-full bg-[rgba(48,255,70,0.18)] shadow-[0_0_24px_8px_#4cff15,0_0_0_7px_#222_inset]">
          {isLoading && (
            <div className="text-white font-bold text-base">Loading...</div>
          )}
          {error && (
            <div className="text-red-600 font-bold text-base">
              Error loading data
            </div>
          )}
          {!isLoading && !error && (
            <canvas
              ref={chartRef}
              id="mySuaraPieChart"
              width={150}
              height={150}
            />
          )}
        </div>
      </div>

      {/* Cards container with glass background */}
      <div className="w-full flex justify-center mt-10 z-10 relative">
        <div className="relative w-[200vw] max-w-[470px] flex flex-col items-center rounded-[18px] bg-white/22 shadow-[0_6px_24px_0_rgba(0,0,0,0.22)] border-2 border-white/34 backdrop-blur-[16px] saturate-[180%] py-3 gap-3">
          {paslonData.map((c, idx) => (
            <div
              key={c._id}
              className="flex flex-row items-center gap-2"
              style={{
                width: cardWidth,
                maxWidth: cardWidth,
                borderRadius: `${cardRadius}px`,
                boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                overflow: "hidden",
              }}
            >
              <Image
                src={paslonImages[idx % paslonImages.length]}
                alt={`Paslon ${c.nomor}`}
                width={cardImageHeight * 1.4}
                height={cardImageHeight}
                className="object-cover"
                priority
                style={{
                  borderRadius: `${cardRadius}px  ${cardRadius}px`,
                  objectFit: "cover",
                  width: `${cardImageHeight * 1.4}px`,
                  height: `${cardImageHeight}px`,
                }}
              />
              <div className="flex flex-col flex-1 py-2 px-2">
                <div
                  className={`text-center font-bold rounded-[9px] py-0.5 shadow text-white text-[15px] mb-1`}
                  style={{
                    background: chartColors[idx % chartColors.length],
                    width: pillWidth,
                  }}
                >
                  <span
                    className={`text-center details-paslon ${suaraTextColors[idx % suaraTextColors.length]} `}
                  >
                    Paslon {c.nomor}
                  </span>
                </div>
                <div
                  className={` font-bold flex flex-col text-center rounded-[9px] py-0.5 shadow text-white text-[16px]`}
                  style={{
                    background: chartColors[idx % chartColors.length],
                    width: pillWidth,
                  }}
                >
                  <span
                    className={`details-paslon ${suaraTextColors[idx % suaraTextColors.length]}`}
                  >
                    {c.nama}
                  </span>
                  <span
                    className={`details-paslon font-semibold mt-0.5 ${suaraTextColors[idx % suaraTextColors.length]} text-[15px]`}
                  >
                    {c.count} suara
                  </span>
                </div>
              </div>
            </div>
          ))}
          {/* Golput card */}
          {tidaksahData && (
            <div
              key={tidaksahData._id}
              className="flex flex-col items-center justify-center"
              style={{
                borderRadius: `${pillRadius}px`,
                background: chartColors[3],
                width: `${cardWidth}px`,
                boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                marginTop: "-6px",
                padding: "14px 0 8px 0",
              }}
            >
              <span className="text-center details-paslon font-extrabold tracking-wide text-[#594013] text-[18px] mb-1">
                Tidak Sah
              </span>
              <span className="text-center details-paslon font-semibold text-[#594013] text-[15px] ">
                {tidaksahData.count} suara
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

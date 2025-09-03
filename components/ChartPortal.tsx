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

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

interface SuaraData {
  _id: string;
  nama: string;
  nomor: number;
  count: number;
}

// Chart colors based on your provided image
const chartColors = [
  "#FFD600", // yellow
  "#FFA726", // orange
  "#FF5722", // deep orange
];
const chartBorders = ["#FFD600", "#FFA726", "#FF5722"];
const paslonImages = [
  "/images/paslon1.jpeg",
  "/images/paslon2.jpeg",
  "/images/paslon3.jpeg",
];
const portalBg = "/images/portalbg.png";
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

export default function ChartPortal() {
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

  const sortedPaslon = useMemo(
    () => (apiData ? [...apiData].sort((a, b) => a.nomor - b.nomor) : []),
    [apiData],
  );

  const chartData = useMemo(
    () => ({
      labels: sortedPaslon.map((item: SuaraData) => item.nama),
      datasets: [
        {
          label: "Jumlah Suara",
          data: sortedPaslon.map((item: SuaraData) => item.count),
          backgroundColor: sortedPaslon.map(
            (_, idx) => chartColors[idx % chartColors.length],
          ),
          borderColor: sortedPaslon.map(
            (_, idx) => chartBorders[idx % chartBorders.length],
          ),
          borderWidth: 4,
        },
      ],
    }),
    [sortedPaslon],
  );

  useEffect(() => {
    if (chartRef.current && sortedPaslon.length && !isLoading && !error) {
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
  }, [sortedPaslon, isLoading, error, chartData]);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ minHeight: "100vh", width: "100vw" }}
    >
      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={portalBg}
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
        className="absolute top-8 left-8 h-30 w-auto z-20"
        width={100}
        height={100}
        priority
      />
      {/* Title */}
      <div className="absolute top-12 left-0 w-full flex justify-center z-10">
        <h1
          className="text-4xl font-extrabold uppercase tracking-wide text-white text-center drop-shadow-lg"
          style={{ textShadow: "0 3px 12px #222" }}
        >
          DASHBOARD PERHITUNGAN SUARA
          <br />
          AIRLANGGA 2025
        </h1>
      </div>

      {/* Chart Centered */}
      <div className="absolute flex flex-col items-center justify-center z-10 left-[49%] top-[57%] -translate-x-1/2 -translate-y-1/2">
        <div
          style={{
            position: "relative",
            height: "420px",
            width: "420px",
            borderRadius: "50%",
            boxShadow: "0 0 50px 15px #4cff15, 0 0 0 14px #222 inset",
            background: "rgba(48,255,70,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isLoading && (
            <div className="text-white font-bold text-xl">
              Loading Chart Data...
            </div>
          )}
          {error && (
            <div className="text-red-600 font-bold text-xl">
              Error loading data: {String(error)}
            </div>
          )}
          {!isLoading && !error && (
            <canvas
              ref={chartRef}
              id="mySuaraPieChart"
              width={420}
              height={420}
            ></canvas>
          )}
        </div>
      </div>

      {/* Single vertical glassy square for all paslon cards */}
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10"
        style={{
          width: 340,
          minHeight: 770,
          height: "auto",
        }}
      >
        {/* Glass effect container */}
        <div
          className="relative w-full"
          style={{
            minHeight: 770,
            borderRadius: 32,
            background: "rgba(255,255,255,0.20)",
            boxShadow: "0 12px 48px 0 rgba(0,0,0,0.20)",
            border: "2.2px solid rgba(255,255,255,0.34)",
            backdropFilter: "blur(32px) saturate(180%)",
            WebkitBackdropFilter: "blur(32px) saturate(180%)",
            padding: "32px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Stack paslon cards inside */}
          {sortedPaslon.map((c, idx) => (
            <div
              key={c._id}
              className="flex flex-col items-center w-full"
              style={{
                borderRadius: 24,
                background: "#82b892",
                marginBottom: 32,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                paddingBottom: 20,
                paddingTop: 20,
                width: "80%",
                maxWidth: 280,
              }}
            >
              {/* Paslon image */}
              <div
                className="w-full flex justify-center"
                style={{
                  marginBottom: "12px",
                  borderTopLeftRadius: "24px",
                  borderTopRightRadius: "24px",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={paslonImages[idx] || paslonImages[0]}
                  alt={`Paslon ${c.nomor}`}
                  width={260}
                  height={110}
                  className="object-cover"
                  style={{
                    objectFit: "cover",
                    width: "260px",
                    height: "110px",
                    borderTopLeftRadius: "24px",
                    borderTopRightRadius: "24px",
                  }}
                  priority
                />
              </div>
              {/* Orange bar: Paslon number */}
              <div
                className="font-bold text-lg text-center"
                style={{
                  background: "#FF7000",
                  borderRadius: 18,
                  padding: "6px 32px",
                  width: "fit-content",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1.12rem",
                  marginBottom: 10,
                }}
              >
                Paslon {c.nomor}
              </div>
              {/* Name - matches chart color */}
              <div
                className="font-bold text-md text-center"
                style={{
                  background: chartColors[idx % chartColors.length],
                  borderRadius: 18,
                  padding: "6px 32px",
                  width: "fit-content",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1.08rem",
                }}
              >
                {c.nama}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

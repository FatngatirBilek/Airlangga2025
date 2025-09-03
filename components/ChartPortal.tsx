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

// CHART COLORS from your sample image (cyan/blue/turquoise)
const chartColors = [
  "#A4FFFF", // bright cyan
  "#239AFF", // bright blue
  "#22CED6", // turquoise
];
const chartBorders = ["#A4FFFF", "#239AFF", "#22CED6"];

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

  // FIX: Memoize sortedPaslon so its reference is stable
  const sortedPaslon = useMemo(
    () => (apiData ? [...apiData].sort((a, b) => a.nomor - b.nomor) : []),
    [apiData],
  );

  // Memoize chartData so it's stable unless sortedPaslon changes
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

  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  // --- PIE CHART POSITION ADJUSTMENT ---
  // Move the chart div down and to the left a little bit
  // Example: from perfectly centered (top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2)
  // To: slightly lower and left (e.g. top-[56%] left-[46%], same translate)
  // This can be done with Tailwind arbitrary values or inline style if needed
  // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        minHeight: "100vh",
        width: "100vw",
      }}
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
      <Image
        src="/images/logoportal.svg"
        alt="Logo"
        className="absolute top-8 left-8 h-30 w-auto z-20"
        width={100}
        height={100}
        priority
      />
      {/* Title at the top, centered */}
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

      <div className="absolute flex flex-col items-center justify-center z-10 left-[49%] top-[56%] -translate-x-1/2 -translate-y-1/2">
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

      {/* Paslon cards on right with blur background behind the PASLON IMAGE only */}
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-8"
        style={{
          width: 270,
        }}
      >
        {sortedPaslon.map((c, idx) => (
          <div
            key={c._id}
            className="flex flex-col items-center p-0 rounded-2xl relative"
            style={{
              borderRadius: 18,
              overflow: "hidden",
              background: "#8fd6a9",
              boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
            }}
          >
            {/* Blur background behind the paslon image only */}
            <div
              className="absolute top-0 left-0 w-full h-32"
              style={{
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
                zIndex: 0,
                overflow: "hidden",
              }}
            >
              <Image
                src={paslonImages[idx] || paslonImages[0]}
                alt=""
                width={270}
                height={128}
                className="object-cover object-top"
                style={{
                  objectFit: "cover",
                  objectPosition: "top",
                  filter: "blur(16px) brightness(0.9)",
                  width: "100%",
                  height: "100%",
                  borderTopLeftRadius: 18,
                  borderTopRightRadius: 18,
                }}
                priority
              />
            </div>
            {/* Paslon image (sharp, in front of blur) */}
            <div
              className="w-full h-32 rounded-t-xl overflow-hidden flex items-center justify-center relative"
              style={{
                minHeight: 0,
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
                zIndex: 1,
              }}
            >
              <Image
                src={paslonImages[idx] || paslonImages[0]}
                alt={`Paslon ${c.nomor}`}
                width={270}
                height={128}
                className="object-cover object-top"
                style={{
                  objectFit: "cover",
                  objectPosition: "top",
                  width: "100%",
                  height: "100%",
                  borderTopLeftRadius: 18,
                  borderTopRightRadius: 18,
                }}
                priority
              />
            </div>
            {/* Paslon info */}
            <div
              className="w-full rounded-b-xl flex flex-col items-center py-3 relative"
              style={{
                background: "#8fd6a9",
                zIndex: 1,
              }}
            >
              <span className="font-bold text-lg uppercase tracking-wider mb-1 text-[#2c4b36] text-center">
                PASLON {c.nomor}
              </span>
              <span className="text-md font-semibold text-gray-800 text-center">
                {c.nama}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

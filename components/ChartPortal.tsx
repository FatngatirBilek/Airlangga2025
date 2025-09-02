"use client";
import useSWR from "swr";
import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
} from "chart.js";

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

interface SuaraData {
  _id: string;
  nama: string; // Candidate names from DB, e.g. "Rizal - Nana"
  nomor: number; // Candidate number (1, 2, 3)
  count: number;
}

// Pastel colors for chart
const donutColors = [
  "rgba(255, 233, 122, 1)", // yellow
  "rgba(107, 176, 74, 1)", // green
  "rgba(135, 90, 71, 1)", // brown
];
const donutBorders = [
  "rgba(255, 233, 122, 1)",
  "rgba(107, 176, 74, 1)",
  "rgba(135, 90, 80, 1)",
];

// Candidate images (each matches paslon number)
const paslonImages = [
  "/images/paslon1.png",
  "/images/paslon2.png",
  "/images/paslon3.png",
];

// Background image
const portalBg = "/images/portalbg.png";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function (context: any) {
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

  // Sort paslon by nomor for consistency
  const sortedPaslon = apiData
    ? [...apiData].sort((a, b) => a.nomor - b.nomor)
    : [];

  const chartData = {
    labels: sortedPaslon.map((item) => item.nama),
    datasets: [
      {
        label: "Jumlah Suara",
        data: sortedPaslon.map((item) => item.count),
        backgroundColor: sortedPaslon.map(
          (_, idx) => donutColors[idx % donutColors.length],
        ),
        borderColor: sortedPaslon.map(
          (_, idx) => donutBorders[idx % donutBorders.length],
        ),
        borderWidth: 4,
      },
    ],
  };

  useEffect(() => {
    if (chartRef.current && apiData && !isLoading && !error) {
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
    // eslint-disable-next-line
  }, [JSON.stringify(chartData), isLoading, error]);

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

      {/* Centered chart and title */}
      <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
        <div
          className="flex flex-col items-center justify-center"
          style={{ width: 900 }}
        >
          <h1
            className="text-4xl font-extrabold uppercase tracking-wide text-white text-center drop-shadow-lg"
            style={{ marginBottom: 24, textShadow: "0 3px 12px #222" }}
          >
            DASHBOARD PERHITUNGAN SUARA
            <br />
            AIRLANGGA 2025
          </h1>
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
      </div>

      {/* Paslon cards on right, color and layout matching your latest screenshot */}
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-8"
        style={{
          width: 270,
          background: "none",
          backdropFilter: "none",
        }}
      >
        {sortedPaslon.map((c, idx) => (
          <div
            key={c._id}
            className="flex flex-col items-center p-0 rounded-2xl"
            style={{
              background: "#8fd6a9", // pastel green for lower box
              boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
              borderRadius: 18,
              overflow: "hidden",
            }}
          >
            <div
              className="w-full h-32 rounded-t-xl overflow-hidden flex items-center justify-center"
              style={{
                minHeight: 0,
                background: "#eaf7ea", // light green for upper box
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
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
                  height: "100%",
                  width: "100%",
                }}
                priority
              />
            </div>
            <span className="font-bold text-lg uppercase tracking-wider mt-2 mb-1 text-[#2c4b36] text-center">
              PASLON {c.nomor}
            </span>
            <span className="text-md font-semibold text-gray-800 text-center mb-2">
              {c.nama}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
import portalbg from "@/public/images/portalbg.webp";
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

  // Candidate and golput separation (unified logic)
  const paslonData = useMemo(
    () =>
      apiData?.filter(
        (d) => d.nomor !== "" && d.nama.toLowerCase() !== "golput",
      ) ?? [],
    [apiData],
  );

  const golputData = useMemo(
    () => apiData?.find((d) => d.nama.toLowerCase() === "golput"),
    [apiData],
  );

  // Chart data includes golput
  const chartData = useMemo(
    () => ({
      labels: [...paslonData.map((item) => item.nama), "Golput"],
      datasets: [
        {
          label: "Jumlah Suara",
          data: [
            ...paslonData.map((item) => parseInt(item.count, 10)),
            golputData ? parseInt(golputData.count, 10) : 0,
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
    [paslonData, golputData],
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
  }, [paslonData, golputData, isLoading, error, chartData]);

  // Card and pill sizing (keep consistent with Chart.tsx)
  const cardWidth = 250;
  const cardImageHeight = 180;
  const cardRadius = 18;
  const pillWidth = "58%";
  const pillRadius = 9;

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

      {/* Title */}
      <div className="absolute top-20 right-10 w-full text-5xl flex justify-center z-10">
        <h1 className="dashboard-title text-white text-center">
          DASHBOARD PERHITUNGAN SUARA
          <br />
          AIRLANGGA 2025
        </h1>
      </div>

      {/* Chart */}
      <div className="absolute flex flex-col items-center justify-center z-10 left-1/2 top-[56%] -translate-x-[58%] -translate-y-1/2">
        <div className="relative flex items-center justify-center h-[460px] w-[460px] rounded-full shadow-[0_0_50px_15px_#4cff15,0_0_0_14px_#222_inset] bg-[rgba(48,255,70,0.18)]">
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
            />
          )}
        </div>
      </div>

      {/* Cards container with glass background */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10 w-[314px] min-h-[540px]">
        <div className="absolute left-0 top-0 w-full h-full rounded-[18px] bg-white/22 shadow-[0_6px_24px_0_rgba(0,0,0,0.22)] border-2 border-white/34 backdrop-blur-[16px] saturate-[180%] z-1" />
        <div className="relative w-full flex flex-col items-center rounded-[18px] bg-transparent shadow-none border-none py-3 gap-3 z-2">
          {paslonData.map((c, idx) => (
            <div
              key={c._id}
              className="flex flex-col items-center"
              style={{ width: cardWidth, maxWidth: cardWidth }}
            >
              <div
                className="relative flex flex-col justify-end"
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardImageHeight}px`,
                  borderRadius: `${cardRadius}px`,
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                  marginBottom: "14px",
                }}
              >
                <Image
                  src={paslonImages[idx % paslonImages.length]}
                  alt={`Paslon ${c.nomor}`}
                  width={cardWidth}
                  height={cardImageHeight}
                  className="object-cover"
                  priority
                  style={{
                    borderRadius: `${cardRadius}px`,
                    objectFit: "cover",
                    width: `${cardWidth}px`,
                    height: `${cardImageHeight}px`,
                  }}
                />
                {/* Pills PART OF IMAGE, at bottom (smaller) */}
                <div
                  className="absolute left-1/2 bottom-2 -translate-x-1/2 flex flex-col items-center gap-1"
                  style={{ width: pillWidth, zIndex: 3 }}
                >
                  <div
                    className={`details-paslon w-full text-center font-bold rounded-[9px] py-0.5 shadow text-white text-[0.78rem]`}
                    style={{
                      background: chartColors[idx % chartColors.length],
                    }}
                  >
                    <span
                      className={`${suaraTextColors[idx % suaraTextColors.length]}`}
                    >
                      {" "}
                      PASLON {c.nomor}{" "}
                    </span>
                  </div>
                  <div
                    className={`details-paslon w-full text-center font-bold flex flex-col items-center rounded-[9px] py-0.5 shadow text-white text-[0.76rem]`}
                    style={{
                      background: chartColors[idx % chartColors.length],
                    }}
                  >
                    <span
                      className={`${suaraTextColors[idx % suaraTextColors.length]}`}
                    >
                      {c.nama}
                    </span>
                    <span
                      className={`details-paslon font-semibold mt-0.5 ${suaraTextColors[idx % suaraTextColors.length]} text-[0.73rem]`}
                    >
                      {c.count} suara
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Golput card WITHOUT image, chart yellow, compact */}
          {golputData && (
            <div
              key={golputData._id}
              className="flex flex-col items-center"
              style={{
                borderRadius: `${pillRadius}px`,
                background: chartColors[3],
                width: `${cardWidth}px`,
                boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                marginTop: "-10px",
                marginLeft: "18px",
                padding: "10px 0 5px 0",
              }}
            >
              <span className="details-paslon text-center font-extrabold tracking-wide text-[#594013] text-[1.4rem] mb-1">
                Golput
              </span>
              <span className="details-paslon text-center font-semibold text-[#594013] text-[0.74rem] mt-1">
                {golputData.count} suara
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

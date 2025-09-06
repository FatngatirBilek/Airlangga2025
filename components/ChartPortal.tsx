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

  // Only paslons (not golput)
  const paslonData = useMemo(
    () =>
      apiData?.filter(
        (d) => d.nomor !== "" && d.nama.toLowerCase() !== "golput",
      ) ?? [],
    [apiData],
  );
  // Only golput
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

  // Images (for demo)
  const paslonImages = [
    "/images/paslon1.jpeg",
    "/images/paslon2.jpeg",
    "/images/paslon3.jpeg",
    "/images/paslon1.jpeg", // fallback
  ];

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
      <div className="absolute top-20 right-10 w-full flex justify-center z-10">
        <h1 className="dashboard-title text-4xl font-extrabold uppercase tracking-wide text-white text-center drop-shadow-lg">
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
      {/* Glass background behind all cards */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10 w-[314px] min-h-[540px]">
        <div className="absolute left-0 top-0 w-full h-full rounded-[18px] bg-white/22 shadow-[0_6px_24px_0_rgba(0,0,0,0.22)] border-2 border-white/34 backdrop-blur-[16px] saturate-[180%] z-1" />
        <div className="relative w-full flex flex-col items-center rounded-[18px] bg-transparent shadow-none border-none py-3 gap-3 z-2">
          {paslonData.map((c, idx) => (
            <div
              key={c._id}
              className="flex flex-col items-center w-full rounded-[12px] bg-transparent shadow-none p-0"
              style={{ width: 300, maxWidth: 300 }}
            >
              <div className="relative flex flex-col justify-end w-[300px] h-[230px] rounded-[12px] overflow-hidden mb-0 shadow-[0_2px_7px_rgba(0,0,0,0.08)] bg-[#eee]">
                <Image
                  src={paslonImages[idx % paslonImages.length]}
                  alt={`Paslon ${c.nomor}`}
                  width={300}
                  height={230}
                  className="object-cover object-top rounded-[12px] z-1"
                  priority
                />
                {/* Pills at the very bottom edge, OUTSIDE the image */}
                <div className="absolute left-1/2 bottom-[10px] -translate-x-1/2 w-[60%] z-2 flex flex-col items-center gap-[7px]">
                  {/* Number bar */}
                  <div
                    className={`details-paslon w-full text-center font-bold rounded-[16px] py-[2px] shadow-[0_2px_6px_rgba(0,0,0,0.08)] text-[0.92rem] text-white`}
                    style={{
                      background: chartColors[idx % chartColors.length],
                    }}
                  >
                    {`Paslon ${c.nomor || "null"}`}
                  </div>
                  {/* Name & suara bar */}
                  <div
                    className={`details-paslon w-full text-center font-bold flex flex-col items-center rounded-[16px] py-[2px] shadow-[0_2px_6px_rgba(0,0,0,0.08)] text-[0.87rem] text-white`}
                    style={{
                      background: chartColors[idx % chartColors.length],
                    }}
                  >
                    {c.nama}
                    {c.count && (
                      <span
                        className={`details-paslon font-semibold text-[0.83rem] mt-[1px] ${suaraTextColors[idx % suaraTextColors.length]}`}
                      >
                        {`${c.count} suara`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Golput card (smaller pill at the end, no image) */}
          {golputData && (
            <div
              className="flex flex-col  rounded-[12px] justify-center items-center shadow-[0_2px_6px_rgba(0,0,0,0.07)] py-[9px] mt-[15px] z-2 w-[300px] max-w-[300px]"
              style={{ background: chartColors[3] }}
            >
              <span className="details-paslon text-center font-extrabold mb-[2px] tracking-wide text-[#594013] text-[1.18rem]">
                GOLPUT
              </span>
              <span className="details-paslon text-center font-bold mt-[1px] text-[#594013] text-[0.93rem]">
                {golputData.count ? `${golputData.count} suara` : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

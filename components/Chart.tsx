"use client";
import useSWR from "swr";
import { useEffect, useRef } from "react";
import Image from "next/image";
import background from "@/public/images/bg.png";
import {
  Chart,
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  ChartData,
  ChartOptions,
} from "chart.js";

Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
);

interface SuaraData {
  _id: string;
  nama: string;
  nomor: number | null;
  count: number;
}

const chartColors = ["#F76102", "#F7A43A", "#FFDC04", "#FFD06C"];
const chartBorders = ["#F76102", "#F7A43A", "#FFDC04", "#FFD06C"];
const paslonImages = [
  "/images/paslon1.jpeg",
  "/images/paslon2.jpeg",
  "/images/paslon3.jpeg",
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const options: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.dataset.label || ""}: ${context.parsed.y}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Jumlah Suara",
        color: "#fff",
        font: { weight: "bold", size: 17 },
      },
      ticks: {
        color: "#fff",
        font: { weight: "bold", size: 13 },
      },
      grid: {
        color: "rgba(255,255,255,0.16)",
        lineWidth: 1.1,
      },
    },
    x: {
      title: {
        display: true,
        text: "Kandidat",
        color: "#fff",
        font: { weight: "bold", size: 17 },
      },
      ticks: {
        color: "#fff",
        font: { weight: "bold", size: 13 },
      },
      grid: {
        display: false,
        color: "rgba(255,255,255,0.16)",
        lineWidth: 1.1,
        drawTicks: false,
      },
    },
  },
};

export default function ChartView() {
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

  // Candidate and golput separation
  const paslonData =
    apiData?.filter(
      (c) => c.nomor !== null && c.nama.toLowerCase() !== "golput",
    ) || [];
  const golputData = apiData?.find((c) => c.nama.toLowerCase() === "golput");

  const chartData: ChartData<"bar"> = {
    labels: apiData ? apiData.map((item) => item.nama) : [],
    datasets: [
      {
        label: "Jumlah Suara",
        data: apiData ? apiData.map((item) => item.count) : [],
        backgroundColor: apiData
          ? apiData.map((_, idx) => chartColors[idx % chartColors.length])
          : [],
        borderColor: apiData
          ? apiData.map((_, idx) => chartBorders[idx % chartBorders.length])
          : [],
        borderWidth: 2,
        borderRadius: 7,
        barPercentage: 1.3,
        categoryPercentage: 0.62,
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
          type: "bar",
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

  // Card and pill sizing (even more compact)
  const cardWidth = 250;
  const cardImageHeight = 180;
  const cardRadius = 18;
  const pillWidth = "58%";
  const pillPadding = "2px 0px";
  const pillFontSize1 = "0.78rem";
  const pillFontSize2 = "0.76rem";
  const suaraFontSize = "0.73rem";
  const pillRadius = 9;

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="fixed inset-0 -z-10">
        <Image
          src={background}
          alt="background image"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>
      <Image
        src="/images/logosmk.svg"
        alt="Logo"
        className="absolute top-6 left-6 h-24 w-auto z-20"
        width={80}
        height={80}
        priority
      />
      <Image
        src="/images/logompk.svg"
        alt="Logo"
        className="absolute top-6 right-6 h-20 w-auto z-20"
        width={80}
        height={80}
        priority
      />

      {/* Glass background and contents */}
      <div
        className="flex flex-row bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 z-10"
        style={{
          width: "calc(100vw - 180px)",
          maxWidth: "1095px",
          height: "calc(95vh - 120px)",
          minHeight: "550px",
          alignItems: "center",
        }}
      >
        {/* Candidate List */}
        <div className="flex flex-col justify-center gap-6 w-80 pr-8">
          {/* PASLON cards only */}
          {paslonData.map((c, idx) => (
            <div key={c._id} className="flex flex-col items-center">
              <div
                style={{
                  position: "relative",
                  width: `${cardWidth}px`,
                  height: `${cardImageHeight}px`,
                  borderRadius: `${cardRadius}px`,
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                  marginBottom: "14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <Image
                  src={
                    paslonImages[idx % paslonImages.length] ||
                    "/images/paslon1.png"
                  }
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
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: "8px",
                    transform: "translateX(-50%)",
                    width: pillWidth,
                    zIndex: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      background: chartColors[idx % chartColors.length],
                      color: "#fff",
                      borderRadius: pillRadius,
                      padding: pillPadding,
                      width: "100%",
                      fontWeight: 700,
                      fontSize: pillFontSize1,
                      textAlign: "center",
                      letterSpacing: "0.01em",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                  >
                    PASLON {c.nomor}
                  </div>
                  <div
                    style={{
                      background: chartColors[idx % chartColors.length],
                      color: "#fff",
                      borderRadius: pillRadius,
                      padding: pillPadding,
                      width: "100%",
                      fontWeight: 700,
                      fontSize: pillFontSize2,
                      textAlign: "center",
                      letterSpacing: "0.01em",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {c.nama}
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: suaraFontSize,
                        marginTop: "1px",
                        color: "#fff",
                        letterSpacing: "0.01em",
                        opacity: 0.96,
                        display: "block",
                      }}
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
              <span
                style={{
                  color: "#594013",
                  fontWeight: 900,
                  fontSize: "0.86rem",
                  textAlign: "center",
                  letterSpacing: "0.01em",
                  marginBottom: "1px",
                  display: "block",
                }}
              >
                Golput
              </span>
              <span
                style={{
                  color: "#594013",
                  fontWeight: 600,
                  fontSize: "0.74rem",
                  textAlign: "center",
                  marginTop: "1px",
                  display: "block",
                }}
              >
                {golputData.count} suara
              </span>
            </div>
          )}
        </div>

        {/* Chart Section */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-extrabold uppercase tracking-[0.13em] text-white drop-shadow mb-10 text-center">
            DASHBOARD PERHITUNGAN SUARA
            <br />
            AIRLANGGA 2025
          </h1>
          <div style={{ position: "relative", height: "500px", width: "100%" }}>
            {isLoading && <div>Loading Chart Data...</div>}
            {error && <div>Error loading data: {String(error)}</div>}
            {!isLoading && !error && (
              <canvas ref={chartRef} id="mySuaraChart"></canvas>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
  nomor: string; // "" for Golput
  count: string;
}

const chartColors = ["#F76102", "#F7A43A", "#FFDC04", "#FFDE94"];

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

  // Separate paslon and golput
  const paslonData = useMemo(
    () => apiData?.filter((d) => d.nomor !== "") ?? [],
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

  // Images (for demo)
  const paslonImages = [
    "/images/paslon1.jpeg",
    "/images/paslon2.jpeg",
    "/images/paslon3.jpeg",
  ];
  const portalBg = "/images/portalbg.png";

  // Card sizing for "a little big but not too big"
  const cardWidth = 280;
  const cardImageHeight = 120;

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
        width={70}
        height={70}
        priority
      />

      {/* Title */}
      <div className="absolute top-20 left-0 w-full flex justify-center z-10">
        <h1
          className="text-4xl font-extrabold uppercase tracking-wide text-white text-center drop-shadow-lg"
          style={{ textShadow: "0 2px 8px #222" }}
        >
          DASHBOARD PERHITUNGAN SUARf76102A
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

      {/* Cards container */}
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10"
        style={{
          width: cardWidth + 40,
          minHeight: 640,
          height: "auto",
        }}
      >
        <div
          className="relative w-full"
          style={{
            borderRadius: 28,
            background: "rgba(255,255,255,0.20)",
            boxShadow: "0 12px 48px 0 rgba(0,0,0,0.20)",
            border: "2px solid rgba(255,255,255,0.34)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            padding: "28px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {apiData?.map((c, idx) =>
            c.nama.toLowerCase() !== "golput" ? (
              <div
                key={c._id}
                className="flex flex-col items-center w-full"
                style={{
                  borderRadius: 24,
                  background: "#82b892",
                  marginBottom: 24,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  paddingBottom: 16,
                  paddingTop: 16,
                  width: cardWidth,
                  maxWidth: cardWidth,
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
                    width={cardWidth - 16}
                    height={cardImageHeight}
                    className="object-cover object-top"
                    style={{
                      objectFit: "cover",
                      width: `${cardWidth - 16}px`,
                      height: `${cardImageHeight}px`,
                      borderTopLeftRadius: "24px",
                      borderTopRightRadius: "24px",
                    }}
                    priority
                  />
                </div>
                {/* Paslon number bar */}
                <div
                  className="font-bold text-center"
                  style={{
                    background: "#FF7000",
                    borderRadius: 16,
                    padding: "8px 0",
                    width: "80%",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.08rem",
                    marginBottom: 10,
                    textAlign: "center",
                  }}
                >
                  {`Paslon ${c.nomor}`}
                </div>
                {/* Name */}
                <div
                  className="font-bold text-center"
                  style={{
                    background: chartColors[idx % chartColors.length],
                    borderRadius: 16,
                    padding: "8px 0",
                    width: "80%",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.06rem",
                    textAlign: "center",
                  }}
                >
                  {c.nama}
                </div>
              </div>
            ) : (
              <div
                key={c._id}
                className="flex flex-col items-center w-full"
                style={{
                  borderRadius: 24,
                  background: "#F9E8BE",
                  marginBottom: 24,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                  paddingBottom: 18,
                  paddingTop: 18,
                  width: cardWidth,
                  maxWidth: cardWidth,
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    color: "#594013",
                    fontWeight: 900,
                    fontSize: "1.13rem",
                    textAlign: "center",
                    letterSpacing: "0.07em",
                    fontFamily: "inherit",
                  }}
                >
                  Golput
                </span>
                <span
                  style={{
                    color: "#594013",
                    fontWeight: 600,
                    fontSize: "1.02rem",
                    textAlign: "center",
                    marginTop: "8px",
                  }}
                >
                  {c.count ? `${c.count} suara` : ""}
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

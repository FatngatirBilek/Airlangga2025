"use client";
import { useDashboardEnabled } from "@/app/context/useDashboardEnabled";
import EditAllSuara from "@/components/EditAllSuara";
import { motion } from "framer-motion";
import Image from "next/image";
import background from "@/public/images/dashboardbg.webp";

export default function DashboardClientPage() {
  const { enabled, setEnabled, winnerMode, setWinnerMode, loading } =
    useDashboardEnabled();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background */}
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
      {/* Logo */}
      <Image
        src="/images/logoportal.svg"
        alt="Logo"
        className="absolute top-8 left-8 h-24 w-auto z-20"
        width={50}
        height={50}
        priority
      />
      {/* Tables, Save Button, and Control Buttons */}
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full flex justify-center">
          <EditAllSuara
            chartToggleButton={
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setEnabled(!enabled)}
                className={`details-paslon px-5 py-2 rounded-lg font-semibold shadow transition-colors duration-300
                  ${
                    enabled
                      ? "bg-green-500 hover:bg-green-600 focus:ring-green-300"
                      : "bg-gray-600 hover:bg-gray-700 focus:ring-gray-300"
                  }
                  text-white focus:outline-none focus:ring-2 focus:ring-offset-2 min-w-[180px] tracking-wide`}
              >
                {enabled ? "Disable Chart Portal" : "Enable Chart Portal"}
              </motion.button>
            }
            hasilToggleButton={
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setWinnerMode(!winnerMode)}
                className={`details-paslon px-5 py-2 rounded-lg font-semibold shadow transition-colors duration-300
                  ${
                    winnerMode
                      ? "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-300"
                      : "bg-gray-600 hover:bg-gray-700 focus:ring-gray-300"
                  }
                  text-white focus:outline-none focus:ring-2 focus:ring-offset-2 min-w-[180px] tracking-wide`}
              >
                {winnerMode ? "Hide Hasil" : "Show Hasil"}
              </motion.button>
            }
          />
        </div>
      </div>
    </div>
  );
}

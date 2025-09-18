"use client";
import Chart from "@/components/Chart";
import ChartPortal from "@/components/ChartPortal";
import ChartHpPortal from "@/components/ChartHpPortal";
import PaslonWinner from "@/components/PaslonWinner";
import PaslonWinnerMobile from "@/components/PaslonWinnerMobile";
import { useDashboardEnabled } from "@/app/context/useDashboardEnabled";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const { enabled, winnerMode, loading } = useDashboardEnabled();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <AnimatePresence mode="wait">
        {winnerMode ? (
          <>
            {/* Show PaslonWinnerMobile on mobile, PaslonWinner on desktop/tablet */}
            <motion.div
              key="winner-desktop"
              className="hidden sm:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PaslonWinner />
            </motion.div>
            <motion.div
              key="winner-mobile"
              className="block sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PaslonWinnerMobile />
            </motion.div>
          </>
        ) : enabled ? (
          <>
            {/* Show ChartHpPortal on mobile, ChartPortal on desktop/tablet */}
            <motion.div
              key="portal-desktop"
              className="hidden sm:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ChartPortal />
            </motion.div>
            <motion.div
              key="portal-mobile"
              className="block sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ChartHpPortal />
            </motion.div>
          </>
        ) : (
          <motion.div
            key="chart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Chart />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

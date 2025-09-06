"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageWrapper({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}   // when entering
        animate={{ opacity: 1, y: 0 }}    // when active
        exit={{ opacity: 0, y: -20 }}     // when leaving
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}


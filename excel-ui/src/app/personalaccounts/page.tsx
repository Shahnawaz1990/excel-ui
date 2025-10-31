"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const cardItems = [
  { name: "Ledger", link: "/personalaccounts/ledger" },
  { name: "Summaries", link: "/personalaccounts/summaries" },
  { name: "Rental", link: "/personalaccounts/rental" },
  { name: "Dividend", link: "/personalaccounts/dividend" },
];

export default function PersonalAccountsPage() {
  return (
    <div className="p-6 min-h-screen bg-gray-950 text-white">
      <h1 className="text-2xl font-bold text-green-500 mb-6">Personal Accounts</h1>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {cardItems.map((item) => (
          <Link key={item.name} href={item.link}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Card className="bg-gray-900 border-gray-800 cursor-pointer hover:border-green-500 transition-colors">
                <CardHeader>
                  <CardTitle className="text-green-400">{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Click view {item.name.toLowerCase()} details</p>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

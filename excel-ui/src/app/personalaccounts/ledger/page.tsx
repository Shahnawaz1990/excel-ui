"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LedgerPage() {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [filters, setFilters] = useState({ member: "", bank: "", date: "" });
  const [memberOptions, setMemberOptions] = useState<string[]>([]);
  const [bankOptions, setBankOptions] = useState<string[]>([]);

  // Fetch Excel data
  useEffect(() => {
    const fetchExcelData = async () => {
      try {
        const response = await fetch("/api/read-excel");
        const data = await response.json();

        const rows = Array.isArray(data) ? data : data.data;
        // Normalize headers and keep consistent casing
        const normalizedData = rows.map((row: any) => {
          const newRow: any = {};
          Object.keys(row).forEach((key) => {
            const cleanKey = key.trim().toUpperCase();
            newRow[cleanKey] = row[key];
          });
          return newRow;
        });
        setExcelData(normalizedData);


        // Extract unique dropdown options
        const members: string[] = Array.from(
          new Set(rows.map((r: any) => r["MEMBER NAME"]).filter(Boolean))
        );
        const banks: string[] = Array.from(
          new Set(rows.map((r: any) => r["BANK ACCOUNT"]).filter(Boolean))
        );

        setMemberOptions(members);
        setBankOptions(banks);
      } catch (error) {
        console.error("Error fetching Excel data:", error);
      }
    };

    fetchExcelData();
  }, []);

  // Handle Member change (dependent dropdown)
  const handleMemberChange = (member: string) => {
    setFilters({ ...filters, member, bank: "" });

    if (member) {
      const filteredBanks = Array.from(
        new Set(
          excelData
            .filter((row: any) => row["MEMBER NAME"] === member)
            .map((row: any) => row["BANK ACCOUNT"])
        )
      );
      setBankOptions(filteredBanks);
    } else {
      const allBanks = Array.from(
        new Set(excelData.map((row: any) => row["BANK ACCOUNT"]))
      );
      setBankOptions(allBanks);
    }
  };

  // Filter data based on selections
  const filteredData = excelData.filter((row) => {
    const memberMatch = filters.member ? row["MEMBER NAME"] === filters.member : true;
    const bankMatch = filters.bank ? row["BANK ACCOUNT"] === filters.bank : true;
    const dateMatch = filters.date ? row["Date"] === filters.date : true;
    return memberMatch && bankMatch && dateMatch;
  });

  // Clear filters
  const clearFilters = () => {
    setFilters({ member: "", bank: "", date: "" });
    const allBanks = Array.from(new Set(excelData.map((r: any) => r["BANK ACCOUNT"])));
    setBankOptions(allBanks);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-8 text-green-400">Ledger</h1>

      {/* Filters Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {/* MEMBER NAME */}
        <div>
          <Label className="text-green-400">MEMBER NAME</Label>
          <Select onValueChange={handleMemberChange} value={filters.member}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select Member" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white">
              {memberOptions.map((member) => (
                <SelectItem key={member} value={member}>
                  {member}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* BANK ACCOUNT */}
        <div>
          <Label className="text-green-400">BANK ACCOUNT</Label>
          <Select
            onValueChange={(value) => setFilters({ ...filters, bank: value })}
            value={filters.bank}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select Bank" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white">
              {bankOptions.map((bank) => (
                <SelectItem key={bank} value={bank}>
                  {bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div>
          <Label className="text-green-400">Date</Label>
          <Input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      <Button
        variant="outline"
        onClick={clearFilters}
        className="mb-6 border-green-500 text-green-400 hover:bg-green-600 hover:text-white transition"
      >
        Clear Filters
      </Button>

      {/* Table Section */}
      <motion.div
        key={filteredData.length}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="overflow-x-auto"
      >
        <table className="min-w-full border border-gray-700 rounded-xl overflow-hidden">
          <thead className="bg-green-900">
            <tr>
              {[
                "MEMBER NAME",
                "BANK ACCOUNT",
                "DATE",
                "CATEGORY",
                "PARTICULAR",
                "CHEQUE NO.",
                "DEBIT",
                "CREDIT",
                "BALANCE",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-base font-semibold tracking-wider text-white uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className="bg-white border-b border-gray-300 hover:bg-gray-100 transition-all duration-200">
                {[
                  "MEMBER NAME",
                  "BANK ACCOUNT",
                  "DATE",
                  "CATEGORY",
                  "PARTICULAR",
                  "CHEQUE NO.",
                  "DEBIT",
                  "CREDIT",
                  "BALANCE",
                ].map((key) => {
                  let value = row[key] ?? "";

                  // Handle Excel serial dates (e.g., 45481)
                  if (key === "DATE") {
                    if (!isNaN(value) && value !== "") {
                      const excelDate = new Date(Math.round((value - 25569) * 86400 * 1000));
                      value = excelDate.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      });
                    }
                  }

                  // Format numeric columns
                  if (["DEBIT", "CREDIT", "BALANCE"].includes(key)) {
                    const num = parseFloat(value);
                    value = !isNaN(num) ? num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "–";
                  }

                  // Alignment based on column type
                  const alignment = ["DEBIT", "CREDIT", "BALANCE"].includes(key) ? "text-right" : "text-left";

                  return (
                    <td
                      key={key}
                      className={`px-6 py-3 text-base text-black font-medium tracking-wide ${alignment}`}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>


        </table>
      </motion.div>
    </div>
  );
}

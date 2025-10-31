import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(
      "D:",
      "14-10-2025",
      "OneDrive",
      "Working Data",
      "Excelui",
      "ledgers.xlsx"
    );

    console.log("Checking file path:", filePath);
    const exists = fs.existsSync(filePath);
    console.log("File exists:", exists);

    if (!exists) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const buffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    return NextResponse.json({ data: jsonData });
  } catch (error: any) {
    console.error("Error reading Excel file:", error);
    return NextResponse.json(
      { error: error?.message || "Unknown error occurred" },
      { status: 500 }
    );
  }

}

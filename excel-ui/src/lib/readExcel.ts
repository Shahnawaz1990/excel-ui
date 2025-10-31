import * as XLSX from "xlsx";

export interface LedgerRow {
  member: string;
  bank: string;
  date: string;
  [key: string]: any;
 
}

export function readExcelFile(file: File): Promise<LedgerRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<LedgerRow>(firstSheet, {
          defval: "",
        });

        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export async function readExcelFileFromPath(filePath: string): Promise<LedgerRow[]> {
  try {
    const response = await fetch(`/api/read-excel?path=${encodeURIComponent(filePath)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Error reading Excel:", error);
    return [];
  }
}

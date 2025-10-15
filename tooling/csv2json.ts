import fs from "fs";
import path from "path";
import * as csv from "csv-parse/sync";

const dataDir = path.resolve(__dirname, "../src/data");
const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".csv"));

const allDrafts: Record<string, any[]> = {};

files.forEach((file) => {
  const csvPath = path.join(dataDir, file);
  const content = fs.readFileSync(csvPath, "utf8");
  const records = csv.parse(content, {
    columns: true,
    skip_empty_lines: true,
  });

  // Convert pick field from string to number and trim all keys
  const processedRecords = records.map((record: any) => {
    const cleaned: any = {};
    for (const key in record) {
      const trimmedKey = key.trim();
      cleaned[trimmedKey] = trimmedKey === "pick" ? Number(record[key]) : record[key];
    }
    return cleaned;
  });

  // Extract year from filename (e.g., draft_1990.csv -> 1990)
  const yearMatch = file.match(/draft_(\d{4})\.csv/i);
  if (yearMatch) {
    const year = yearMatch[1];
    allDrafts[year] = processedRecords;
    console.log(`Loaded ${file} as year ${year}`);
  }
});

const jsonPath = path.join(dataDir, "drafts.json");
fs.writeFileSync(jsonPath, JSON.stringify(allDrafts, null, 2), "utf8");
console.log(`\nCombined all drafts into ${path.basename(jsonPath)}`);

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "..", "..", "uploads");

export const deleteUploadedFile = (filename) => {
  const filePath = path.join(uploadDir, filename);
  console.log("Deleting file at:", filePath);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("❌ Could not delete file:", filename, err.message);
    } else {
      console.log("✅ File deleted:", filename);
    }
  });
};

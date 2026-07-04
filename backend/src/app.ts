import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import mahasiswaRoutes from "./routes/mahasiswa.route";
import prodiRoutes from "./routes/prodi.route";
import produkRoutes from "./routes/produk.route";
import authRoutes from "./routes/auth.route";

const app = express();

app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Agar file di folder uploads bisa diakses oleh frontend
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Backend Express berjalan" });
});

app.use("/api/auth", authRoutes);
app.use("/api/prodi", prodiRoutes);
app.use("/api/mahasiswa", mahasiswaRoutes);
app.use("/api/produk", produkRoutes);

// Middleware penanganan error (Error Handling Middleware)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ message: "Ukuran file foto maksimal 2 MB" });
      return;
    }
    res.status(400).json({ message: `Gagal mengunggah file: ${err.message}` });
    return;
  }

  if (err instanceof Error) {
    if (err.message === "File harus berupa JPG, PNG, atau WEBP") {
      res.status(400).json({ message: err.message });
      return;
    }
    res.status(500).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: "Terjadi kesalahan server" });
});

export default app;

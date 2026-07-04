import { Router } from "express";
import {
  getMahasiswa,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "../controllers/mahasiswa.controller";
import { uploadFotoMahasiswa } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", getMahasiswa);
router.post("/", uploadFotoMahasiswa.single("foto"), createMahasiswa);
router.put("/:id", uploadFotoMahasiswa.single("foto"), updateMahasiswa);
router.delete("/:id", deleteMahasiswa);

export default router;

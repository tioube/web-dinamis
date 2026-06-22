import { Request, Response } from "express";
import pool from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export const getMahasiswa = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM mahasiswa");
    res.json({ message: "Data mahasiswa berhasil diambil", data: rows });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error });
  }
};

export const createMahasiswa = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nim, nama, prodi, angkatan } = req.body;
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO mahasiswa (nim, nama, prodi, angkatan) VALUES (?, ?, ?, ?)",
      [nim, nama, prodi, angkatan]
    );
    res.status(201).json({ message: "Data mahasiswa berhasil ditambahkan", data: { id: result.insertId, nim, nama, prodi, angkatan } });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat menambahkan data", error });
  }
};

export const updateMahasiswa = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nim, nama, prodi, angkatan } = req.body;
    await pool.query(
      "UPDATE mahasiswa SET nim = ?, nama = ?, prodi = ?, angkatan = ? WHERE id = ?",
      [nim, nama, prodi, angkatan, id]
    );
    res.json({ message: "Data mahasiswa berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat memperbarui data", error });
  }
};

export const deleteMahasiswa = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM mahasiswa WHERE id = ?", [id]);
    res.json({ message: "Data mahasiswa berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus data", error });
  }
};

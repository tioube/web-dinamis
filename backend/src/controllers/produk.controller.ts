import { Request, Response } from "express";
import pool from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export const getProduk = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM produk");
    res.json({ message: "Data produk berhasil diambil", data: rows });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error });
  }
};

export const createProduk = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nama, harga, stok } = req.body;
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO produk (nama, harga, stok) VALUES (?, ?, ?)",
      [nama, harga, stok]
    );
    res.status(201).json({ message: "Data produk berhasil ditambahkan", data: { id: result.insertId, nama, harga, stok } });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat menambahkan data", error });
  }
};

export const updateProduk = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nama, harga, stok } = req.body;
    await pool.query(
      "UPDATE produk SET nama = ?, harga = ?, stok = ? WHERE id = ?",
      [nama, harga, stok, id]
    );
    res.json({ message: "Data produk berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat memperbarui data", error });
  }
};

export const deleteProduk = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM produk WHERE id = ?", [id]);
    res.json({ message: "Data produk berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus data", error });
  }
};

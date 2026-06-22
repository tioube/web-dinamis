"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProdukForm from "@/components/ProdukForm";
import ProdukTable from "@/components/ProdukTable";
import {
  createProduk,
  deleteProduk,
  getProduk,
  Produk,
  ProdukInput,
  updateProduk,
} from "@/lib/api";

export default function ProdukPage() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [selectedProduk, setSelectedProduk] = useState<Produk | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProduk = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProduk();
      setProduk(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil data produk");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduk();
  }, []);

  const handleSubmit = async (payload: ProdukInput) => {
    try {
      setMessage("");
      setError("");

      if (selectedProduk) {
        await updateProduk(selectedProduk.id, payload);
        setMessage("Data produk berhasil diperbarui");
      } else {
        await createProduk(payload);
        setMessage("Data produk berhasil ditambahkan");
      }

      setSelectedProduk(null);
      await loadProduk();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Yakin ingin menghapus data ini?");
    if (!confirmed) return;

    try {
      setMessage("");
      setError("");
      await deleteProduk(id);
      setMessage("Data produk berhasil dihapus");
      await loadProduk();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data");
    }
  };

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1>CRUD Data Produk</h1>
          <p>Frontend Next.js yang terhubung ke backend Express.js.</p>
        </div>

        <Link href="/">
          <button className="btn-secondary">Kembali</button>
        </Link>
      </div>

      {message && <div className="message">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <ProdukForm
        selectedProduk={selectedProduk}
        onSubmit={handleSubmit}
        onCancelEdit={() => setSelectedProduk(null)}
      />

      <section className="card" style={{ marginTop: 20 }}>
        <h2>Daftar Produk</h2>
        
        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <ProdukTable
            produk={produk}
            onEdit={setSelectedProduk}
            onDelete={handleDelete}
          />
        )}
      </section>
    </main>
  );
}

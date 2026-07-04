"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MahasiswaForm from "@/components/MahasiswaForm";
import MahasiswaTable from "@/components/MahasiswaTable";
import {
  createMahasiswa,
  deleteMahasiswa,
  getMahasiswa,
  getProdi,
  Mahasiswa,
  Prodi,
  updateMahasiswa,
} from "@/lib/api";

export default function MahasiswaPage() {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [prodiList, setProdiList] = useState<Prodi[]>([]);
  
  // State Search & Filter
  const [search, setSearch] = useState("");
  const [prodiId, setProdiId] = useState("");
  
  // State Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // Batas 5 item per halaman
  const [totalPage, setTotalPage] = useState(1);
  
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Ambil list prodi untuk form & dropdown filter
  const loadProdi = async () => {
    try {
      const data = await getProdi();
      setProdiList(data);
    } catch (err) {
      console.error("Gagal memuat prodi:", err);
    }
  };

  // Ambil data mahasiswa dengan filter, search, & pagination dari Server
  const loadMahasiswa = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await getMahasiswa({
        search,
        prodi_id: prodiId,
        page,
        limit,
      });
      
      setMahasiswa(response.data);
      setTotalPage(response.meta.totalPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil data mahasiswa");
    } finally {
      setLoading(false);
    }
  };

  // Load prodi sekali saja saat inisialisasi
  useEffect(() => {
    loadProdi();
  }, []);

  // Fetch ulang mahasiswa setiap kali halaman berubah
  useEffect(() => {
    loadMahasiswa();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset ke halaman pertama saat melakukan search
    loadMahasiswa();
  };

  const handleResetFilter = () => {
    setSearch("");
    setProdiId("");
    setPage(1);
    // Jalankan load manual setelah state direset (useEffect state reset akan dieksekusi secara asinkronus)
    setTimeout(() => {
      loadMahasiswa();
    }, 50);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setMessage("");
      setError("");

      if (selectedMahasiswa) {
        await updateMahasiswa(selectedMahasiswa.id, formData);
        setMessage("Data mahasiswa berhasil diperbarui");
      } else {
        await createMahasiswa(formData);
        setMessage("Data mahasiswa berhasil ditambahkan");
      }

      setSelectedMahasiswa(null);
      await loadMahasiswa();
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
      await deleteMahasiswa(id);
      setMessage("Data mahasiswa berhasil dihapus");
      await loadMahasiswa();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data");
    }
  };

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1>CRUD Data Mahasiswa</h1>
          <p>Frontend Next.js yang terhubung ke backend Express.js.</p>
        </div>

        <Link href="/">
          <button className="btn-secondary">Kembali</button>
        </Link>
      </div>

      {message && <div className="message">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <MahasiswaForm
        selectedMahasiswa={selectedMahasiswa}
        prodiList={prodiList}
        onSubmit={handleSubmit}
        onCancelEdit={() => setSelectedMahasiswa(null)}
      />

      <section className="card" style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <h2>Daftar Mahasiswa</h2>
          
          {/* Form Pencarian & Filter */}
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
            <input 
              type="text" 
              placeholder="Cari nama atau nim..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              style={{ flex: 1, minWidth: "200px" }}
            />
            
            <select value={prodiId} onChange={(e) => setProdiId(e.target.value)} style={{ padding: "8px", borderRadius: "4px" }}>
              <option value="">Semua Program Studi</option>
              {prodiList.map((p) => (
                <option key={p.id} value={p.id}>{p.nama_prodi}</option>
              ))}
            </select>
            
            <button type="submit" className="btn-primary">Cari</button>
            <button type="button" className="btn-secondary" onClick={handleResetFilter}>Reset</button>
          </form>
        </div>
        
        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <>
            <MahasiswaTable
              mahasiswa={mahasiswa}
              onEdit={setSelectedMahasiswa}
              onDelete={handleDelete}
            />

            {/* Pagination Controls */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginTop: "20px" }}>
              <button 
                className="btn-secondary"
                disabled={page <= 1} 
                onClick={() => setPage(page - 1)}
              >
                Sebelumnya
              </button>
              
              <span>Halaman <strong>{page}</strong> dari <strong>{totalPage}</strong></span>
              
              <button 
                className="btn-secondary"
                disabled={page >= totalPage} 
                onClick={() => setPage(page + 1)}
              >
                Selanjutnya
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

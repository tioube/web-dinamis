import { getToken } from "./auth";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";


export type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  prodi_id: number;
  nama_prodi: string;
  angkatan: number;
  foto?: string | null;
  created_at?: string;
};

export type Prodi = {
  id: number;
  nama_prodi: string;
};

export type GetMahasiswaParams = {
  search?: string;
  prodi_id?: string;
  page?: number;
  limit?: number;
};

export type PaginatedResponse<T> = {
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: T[];
};

export type Produk = {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  created_at?: string;
};

export type ProdukInput = {
  nama: string;
  harga: number;
  stok: number;
};

type ApiResponse<T> = {
  message: string;
  data?: T;
};

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Terjadi kesalahan saat mengakses API");
  }

  return result;
}

// === PRODI ===
export async function getProdi(): Promise<Prodi[]> {
  const response = await fetch(`${API_URL}/prodi`, {
    cache: "no-store",
  });
  const result = await handleResponse<Prodi[]>(response);
  return result.data || [];
}

// === MAHASISWA ===
export async function getMahasiswa(params: GetMahasiswaParams): Promise<PaginatedResponse<Mahasiswa>> {
  const query = new URLSearchParams();
  
  if (params.search) query.set("search", params.search);
  if (params.prodi_id) query.set("prodi_id", params.prodi_id);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const token = getToken();
  const response = await fetch(`${API_URL}/mahasiswa?${query.toString()}`, {
    cache: "no-store",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Gagal mengambil data mahasiswa");
  }
  return result;
}

export async function createMahasiswa(formData: FormData): Promise<any> {
  const token = getToken();
  const response = await fetch(`${API_URL}/mahasiswa`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Gagal menambahkan mahasiswa");
  }
  return result;
}

export async function updateMahasiswa(id: number, formData: FormData): Promise<any> {
  const token = getToken();
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Gagal memperbarui mahasiswa");
  }
  return result;
}

export async function deleteMahasiswa(id: number): Promise<void> {
  const token = getToken();
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Gagal menghapus mahasiswa");
  }
}

// === PRODUK ===
export async function getProduk(): Promise<Produk[]> {
  const response = await fetch(`${API_URL}/produk`, {
    cache: "no-store",
  });
  const result = await handleResponse<Produk[]>(response);
  return result.data || [];
}

export async function createProduk(payload: ProdukInput): Promise<Produk> {
  const response = await fetch(`${API_URL}/produk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await handleResponse<Produk>(response);
  return result.data as Produk;
}

export async function updateProduk(id: number, payload: ProdukInput): Promise<void> {
  const response = await fetch(`${API_URL}/produk/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  await handleResponse(response);
}

export async function deleteProduk(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/produk/${id}`, {
    method: "DELETE",
  });
  await handleResponse(response);
}

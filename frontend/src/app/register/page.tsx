"use client";
 
import { useState } from "react";
import Link from "next/link";
 
export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
 
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
 
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
 
      const result = await response.json();
 
      if (!response.ok) {
        setError(result.message || "Registrasi gagal");
        return;
      }
 
      setSuccess("Registrasi berhasil! Silakan masuk.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "radial-gradient(circle at top right, #1e293b, #0f172a)",
      fontFamily: "'Inter', sans-serif",
      padding: "20px"
    }}>
      <div style={{
        background: "rgba(30, 41, 59, 0.7)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{
            color: "#f8fafc",
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "8px",
            background: "linear-gradient(to right, #10b981, #34d399)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Daftar Akun
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            Buat akun baru untuk mengelola data mahasiswa
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "20px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "#a7f3d0",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "20px",
            textAlign: "center"
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="name" style={{
              display: "block",
              color: "#cbd5e1",
              fontSize: "14px",
              fontWeight: 500,
              marginBottom: "8px"
            }}>
              Nama Lengkap
            </label>
            <input 
              id="name"
              type="text"
              required
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="John Doe" 
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                color: "#f8fafc",
                fontSize: "15px",
                boxSizing: "border-box",
                outline: "none",
                transition: "border-color 0.2s"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="email" style={{
              display: "block",
              color: "#cbd5e1",
              fontSize: "14px",
              fontWeight: 500,
              marginBottom: "8px"
            }}>
              Email Address
            </label>
            <input 
              id="email"
              type="email"
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="nama@email.com" 
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                color: "#f8fafc",
                fontSize: "15px",
                boxSizing: "border-box",
                outline: "none",
                transition: "border-color 0.2s"
              }}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label htmlFor="password" style={{
              display: "block",
              color: "#cbd5e1",
              fontSize: "14px",
              fontWeight: 500,
              marginBottom: "8px"
            }}>
              Password (min. 6 karakter)
            </label>
            <input 
              id="password"
              type="password" 
              required
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                color: "#f8fafc",
                fontSize: "15px",
                boxSizing: "border-box",
                outline: "none",
                transition: "border-color 0.2s"
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: loading ? "#065f46" : "#059669",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s, transform 0.1s",
              boxShadow: "0 4px 6px -1px rgba(5, 150, 105, 0.2)",
              marginBottom: "16px"
            }}
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            Sudah punya akun?{" "}
            <Link href="/login" style={{ color: "#60a5fa", textDecoration: "none", fontWeight: 500 }}>
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

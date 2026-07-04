"use client";
 
import { useState } from "react";
import Link from "next/link";
import { saveAuth } from "@/lib/auth";
 
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
 
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
 
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
 
      const result = await response.json();
 
      if (!response.ok) {
        setError(result.message || "Email atau password salah");
        return;
      }
 
      saveAuth(result.token, result.user);
      window.location.href = "/mahasiswa";
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
            background: "linear-gradient(to right, #3b82f6, #60a5fa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Selamat Datang
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            Silakan login untuk mengakses data mahasiswa
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
 
        <form onSubmit={handleLogin}>
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
              Password
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
              backgroundColor: loading ? "#1e40af" : "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s, transform 0.1s",
              boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)"
            }}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            Belum punya akun?{" "}
            <Link href="/register" style={{ color: "#60a5fa", textDecoration: "none", fontWeight: 500 }}>
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

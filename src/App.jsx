import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/AdminLogin"; // Import Halaman Login Baru
import AdminDashboard from "./pages/AdminDashboard";
import AdminKelolaFoto from "./pages/AdminKelolaFoto";
import AdminKelolaVideo from "./pages/AdminKelolaVideo";
import AdminKelolaProfil from "./pages/AdminKelolaProfil";
import AdminKelolaKategori from "./pages/AdminKelolaKategori";

// Komponen Proteksi: Mencegah akses ke halaman admin jika belum login
const ProtectedRoute = ({ children }) => {
  // Mengecek apakah ada token/sesi login di Local Storage
  const isAuthenticated = localStorage.getItem("adminToken");

  if (!isAuthenticated) {
    // Jika tidak ada token (belum login), tendang ke halaman login
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, izinkan menampilkan halaman (children)
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AdminLogin />} />

        {/* Rute Admin (Semua dibungkus dengan ProtectedRoute) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/foto"
          element={
            <ProtectedRoute>
              <AdminKelolaFoto />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/video"
          element={
            <ProtectedRoute>
              <AdminKelolaVideo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profil"
          element={
            <ProtectedRoute>
              <AdminKelolaProfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/kategori"
          element={
            <ProtectedRoute>
              <AdminKelolaKategori />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

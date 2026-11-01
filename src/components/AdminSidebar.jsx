import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // STATE BARU: Untuk mengontrol modal konfirmasi logout
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (path) => {
    // Exact match khusus untuk dashboard (karena menggunakan '/admin')
    if (path === "/admin") {
      return location.pathname === "/admin"
        ? "bg-blue-600/20 text-blue-500 border-l-4 md:border-r-4 md:border-l-0 border-blue-500"
        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-l-4 md:border-r-4 md:border-l-0 border-transparent";
    }

    // Pengecekan standar untuk sub-menu lain
    return location.pathname.startsWith(path)
      ? "bg-blue-600/20 text-blue-500 border-l-4 md:border-r-4 md:border-l-0 border-blue-500"
      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-l-4 md:border-r-4 md:border-l-0 border-transparent";
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  // FUNGSI LOGOUT YANG SUDAH DIPERBARUI
  const confirmLogout = () => {
    // Hapus token atau sesi dari local storage
    localStorage.removeItem("adminToken");

    // Tutup modal agar tidak ng-glitch saat berpindah
    setShowLogoutModal(false);

    // Arahkan pengguna kembali ke halaman login
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Header & Hamburger Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0B1120] border-b border-slate-800/50 z-40 flex items-center justify-between px-6">
        <Link
          to="/admin"
          className="font-bold text-lg tracking-tighter"
          onClick={() => setIsOpen(false)}
        >
          <span className="text-white">ANG</span>
          <span className="text-blue-500">PERTURE</span>
        </Link>
        <button
          onClick={toggleSidebar}
          className="text-slate-300 hover:text-white focus:outline-none p-2 bg-slate-800/50 rounded-lg"
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#0B1120] border-r border-slate-800/50 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo untuk Desktop */}
        <div className="h-20 flex items-center px-8 border-b border-slate-800/50 hidden md:flex shrink-0">
          <Link
            to="/admin"
            className="font-bold text-2xl tracking-tighter transition hover:opacity-80"
          >
            <span className="text-white">ANG</span>
            <span className="text-blue-500">PERTURE</span>
          </Link>
        </div>

        {/* Header untuk mobile dalam sidebar */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/50 md:hidden shrink-0 bg-slate-900/50">
          <span className="font-bold text-slate-300 text-sm tracking-wider uppercase">
            Menu Admin
          </span>
          <button
            onClick={toggleSidebar}
            className="text-slate-400 hover:text-white p-1"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col py-6 flex-grow overflow-y-auto custom-scrollbar">
          {/* Menu Dashboard */}
          <Link
            to="/admin"
            onClick={() => setIsOpen(false)}
            className={`px-8 py-3.5 flex items-center gap-3 transition font-medium mb-4 ${isActive("/admin")}`}
          >
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            Dashboard
          </Link>

          <div className="px-8 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 mt-2">
            Kelola Portofolio
          </div>

          <Link
            to="/admin/profil"
            onClick={() => setIsOpen(false)}
            className={`px-8 py-3.5 flex items-center gap-3 transition font-medium ${isActive("/admin/profil")}`}
          >
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            Kelola Profil
          </Link>

          <Link
            to="/admin/kategori"
            onClick={() => setIsOpen(false)}
            className={`px-8 py-3.5 flex items-center gap-3 transition font-medium ${isActive("/admin/kategori")}`}
          >
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              ></path>
            </svg>
            Kelola Kategori
          </Link>

          <Link
            to="/admin/foto"
            onClick={() => setIsOpen(false)}
            className={`px-8 py-3.5 flex items-center gap-3 transition font-medium ${isActive("/admin/foto")}`}
          >
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            Portofolio Foto
          </Link>

          <Link
            to="/admin/video"
            onClick={() => setIsOpen(false)}
            className={`px-8 py-3.5 flex items-center gap-3 transition font-medium ${isActive("/admin/video")}`}
          >
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              ></path>
            </svg>
            Portofolio Video
          </Link>
        </div>

        <div className="p-6 border-t border-slate-800/50 shrink-0 flex flex-col gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Kembali ke Landing Page
          </Link>

          {/* TOMBOL BUKA MODAL LOGOUT */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition w-full text-left"
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            Keluar / Logout
          </button>
        </div>
      </aside>

      {/* POPUP MODAL KONFIRMASI LOGOUT */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
          {/* Box Modal */}
          <div className="bg-[#0B1120] border border-slate-700 rounded-xl w-full max-w-sm relative shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            {/* Animasi Custom */}
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95) translateY(10px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
              }
            `}</style>

            <div className="p-6 text-center">
              {/* Ikon Warning/Logout */}
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Konfirmasi Logout
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                Apakah Anda yakin ingin keluar dari halaman Admin Panel? Sesi
                Anda akan diakhiri.
              </p>

              {/* Tombol Aksi */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2.5 bg-transparent border border-slate-600 hover:bg-slate-800 text-slate-300 font-semibold rounded-lg transition duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition duration-200 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                >
                  Ya, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

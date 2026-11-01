import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Deteksi scroll untuk mengubah style navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fungsi untuk menutup menu dengan animasi terlebih dahulu
  const handleCloseMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
    }, 300); // Waktu harus sama dengan durasi animasi (0.3s)
  };

  // Data menu navigasi sesuai permintaan
  const navLinks = [
    { name: "Beranda", href: "#" },
    { name: "Filosofi dan Visi", href: "#filosofi" },
    { name: "Galeri Foto", href: "#portofolio" },
    { name: "Galeri Video", href: "#galeri-video" },
    { name: "Hubungi Saya", href: "#kontak" },
    { name: "Kontak", href: "#kontak-langsung" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800 py-4 shadow-lg"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex justify-between items-center">
        {/* LOGO */}
        <a href="#" className="text-2xl font-black text-white tracking-tighter">
          <span className="text-white">ANG</span>
          <span className="text-blue-500">PERTURE</span>
        </a>

        {/* MENU DESKTOP */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-sm font-semibold text-slate-300 hover:text-white hover:text-blue-400 transition-colors duration-300"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* TOMBOL TOGGLE MOBILE MENU */}
        <button
          className="lg:hidden text-white focus:outline-none z-50 relative p-1"
          onClick={() => {
            if (isMobileMenuOpen) {
              handleCloseMenu();
            } else {
              setIsMobileMenuOpen(true);
            }
          }}
          aria-label="Toggle Menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen && !isClosing ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE SIDEBAR & BACKDROP */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex justify-end">
          {/* Latar Belakang Gelap */}
          <div
            className={`absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity duration-300 ${
              isClosing ? "opacity-0" : "opacity-100"
            }`}
            onClick={handleCloseMenu}
          ></div>

          {/* Panel Sidebar dengan Animasi Masuk & Keluar */}
          <div
            className={`relative w-[80%] max-w-sm h-screen bg-[#0B1120] border-l border-slate-800 shadow-2xl flex flex-col pt-24 px-8 pb-8 z-10 ${
              isClosing
                ? "animate-[slideOutToRight_0.3s_ease-in_forwards]"
                : "animate-[slideFromRight_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]"
            }`}
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={handleCloseMenu} // Tutup menu dengan animasi saat link diklik
                  className="text-lg font-bold text-slate-300 hover:text-blue-400 transition-colors duration-300 border-b border-slate-800/60 pb-3"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Bagian Bawah Sidebar */}
            <div className="mt-auto pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
              <p>ANGPERTURE Studio © 2026</p>
            </div>
          </div>
        </div>
      )}

      {/* STYLE KEYFRAMES UNTUK ANIMASI SLIDE MASUK & KELUAR */}
      <style>{`
        @keyframes slideFromRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes slideOutToRight {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(100%);
          }
        }
      `}</style>
    </nav>
  );
}

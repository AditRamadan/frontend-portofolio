import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminDashboard() {
  const [totalFoto, setTotalFoto] = useState(0);
  const [totalVideo, setTotalVideo] = useState(0);
  const [recentFotos, setRecentFotos] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);

  // State untuk Modal Detail Foto
  const [isDetailFotoOpen, setIsDetailFotoOpen] = useState(false);
  const [detailFotoData, setDetailFotoData] = useState(null);

  // State untuk Modal Detail Video
  const [isDetailVideoOpen, setIsDetailVideoOpen] = useState(false);
  const [detailVideoData, setDetailVideoData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Ambil data foto
    fetch("http://localhost:8080/api/portofoliofoto")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTotalFoto(data.length);
          // Ambil 3 data paling baru (asumsi data baru ada di akhir array)
          setRecentFotos([...data].reverse().slice(0, 3));
        }
      })
      .catch((err) => console.error(err));

    // Ambil data video
    fetch("http://localhost:8080/api/portofoliovideo")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTotalVideo(data.length);
          // Ambil 3 data paling baru
          setRecentVideos([...data].reverse().slice(0, 3));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // --- Handler Modal Detail Foto ---
  const openDetailFotoModal = (foto) => {
    setDetailFotoData(foto);
    setIsDetailFotoOpen(true);
  };
  const closeDetailFotoModal = () => {
    setIsDetailFotoOpen(false);
    setDetailFotoData(null);
  };

  // --- Handler Modal Detail Video ---
  const openDetailVideoModal = (video) => {
    setDetailVideoData(video);
    setIsDetailVideoOpen(true);
  };
  const closeDetailVideoModal = () => {
    setIsDetailVideoOpen(false);
    setDetailVideoData(null);
  };

  // Fungsi untuk ekstrak ID Google Drive dari link
  const getDriveId = (url) => {
    if (!url) return null;
    const regExp = /(?:file\/d\/|id=)([\w-]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 font-sans flex relative">
      <AdminSidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300 w-full overflow-hidden">
        {/* HEADER SECTION */}
        <div className="mb-8 md:mb-10">
          <h3 className="text-blue-500 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-1 md:mb-2">
            Welcome Back, Admin
          </h3>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Dashboard Overview
          </h1>
        </div>

        {/* STATISTIK CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
          <div className="bg-[#0B1120] border border-slate-800/50 p-5 md:p-6 rounded-xl shadow-lg hover:border-slate-700 transition">
            <h3 className="text-slate-400 text-xs md:text-sm mb-2 font-semibold">
              Total Portofolio Foto
            </h3>
            <p className="text-4xl md:text-5xl font-extrabold text-blue-500">
              {totalFoto}
            </p>
          </div>
          <div className="bg-[#0B1120] border border-slate-800/50 p-5 md:p-6 rounded-xl shadow-lg hover:border-slate-700 transition">
            <h3 className="text-slate-400 text-xs md:text-sm mb-2 font-semibold">
              Total Portofolio Video
            </h3>
            <p className="text-4xl md:text-5xl font-extrabold text-blue-500">
              {totalVideo}
            </p>
          </div>
        </div>

        {/* FOTO TERBARU SECTION */}
        <div className="bg-[#0B1120] border border-slate-800/50 p-4 md:p-6 rounded-xl shadow-lg mb-8 md:mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-xl font-bold text-white">
              Foto Terbaru diunggah
            </h2>
            <Link
              to="/admin/foto"
              className="text-xs md:text-sm text-blue-500 hover:text-blue-400 font-semibold flex items-center gap-1 transition"
            >
              Lihat lainnya <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {recentFotos.length === 0 ? (
            <p className="text-slate-500 text-sm italic">
              Belum ada foto yang diunggah.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {recentFotos.map((foto) => (
                <div
                  key={foto.id}
                  onClick={() => openDetailFotoModal(foto)} // Trigger modal detail saat diklik
                  className="flex gap-4 p-3 md:p-4 bg-[#070b14] border border-slate-800 rounded-xl hover:border-blue-500/50 transition cursor-pointer group shadow-sm hover:shadow-blue-500/10"
                >
                  <img
                    src={`http://localhost:8080/uploads/foto/${foto.file_gambar}`}
                    alt="thumb"
                    className="w-20 h-28 md:w-24 md:h-32 object-cover rounded-md bg-slate-900 shrink-0 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="flex flex-col justify-center flex-1 overflow-hidden py-1">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-[9px] md:text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded uppercase font-bold">
                        {foto.kategori}
                      </span>
                      <h3 className="text-xs md:text-sm font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {foto.judul}
                      </h3>
                    </div>
                    <p className="text-[10px] md:text-xs text-slate-500 mt-1.5 md:mt-2 truncate">
                      {foto.lokasi}
                    </p>
                    <p className="text-[10px] md:text-xs text-slate-500">
                      {foto.bulan_tahun}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* VIDEO TERBARU SECTION */}
        <div className="bg-[#0B1120] border border-slate-800/50 p-4 md:p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-xl font-bold text-white">
              Video Terbaru diunggah
            </h2>
            <Link
              to="/admin/video"
              className="text-xs md:text-sm text-blue-500 hover:text-blue-400 font-semibold flex items-center gap-1 transition"
            >
              Lihat lainnya <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {recentVideos.length === 0 ? (
            <p className="text-slate-500 text-sm italic">
              Belum ada video yang diunggah.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {recentVideos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => openDetailVideoModal(vid)} // Trigger modal detail saat diklik
                  className="flex gap-4 p-3 md:p-4 bg-[#070b14] border border-slate-800 rounded-xl hover:border-blue-500/50 transition cursor-pointer group shadow-sm hover:shadow-blue-500/10 relative"
                >
                  <div className="relative shrink-0 w-20 h-28 md:w-24 md:h-32 overflow-hidden rounded-md bg-slate-900">
                    <img
                      src={`http://localhost:8080/uploads/thumbnail/${vid.file_thumbnail}`}
                      alt="thumbnail"
                      className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-60 transition-all duration-300"
                    />
                    {/* Ikon Play saat dihover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        className="w-8 h-8 text-white drop-shadow-lg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center flex-1 overflow-hidden py-1">
                    <span className="text-[9px] md:text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded uppercase font-bold inline-block mb-1 self-start">
                      {vid.kategori}
                    </span>
                    <h3 className="text-xs md:text-sm font-bold text-white line-clamp-2 leading-tight mt-1 group-hover:text-purple-400 transition-colors">
                      {vid.judul}
                    </h3>
                    <p className="text-[10px] md:text-xs text-slate-500 mt-1.5 md:mt-2">
                      Durasi: {vid.durasi}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* POPUP MODAL LIHAT DETAIL FOTO */}
      {isDetailFotoOpen && detailFotoData && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-sm transition-opacity">
          <div className="bg-[#0B1120] border border-slate-700 rounded-xl w-full max-w-4xl relative flex flex-col max-h-[90vh] shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-slate-800 shrink-0 bg-[#0B1120] rounded-t-xl">
              <h2 className="text-base md:text-xl font-bold text-white">
                Detail Portofolio
              </h2>
              <button
                onClick={closeDetailFotoModal}
                className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-full p-1.5 md:p-2 transition duration-200"
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
                  ></path>
                </svg>
              </button>
            </div>

            <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar flex-1 flex flex-col lg:flex-row gap-6 lg:gap-10">
              <div className="w-full lg:w-1/2 flex justify-center items-center bg-[#070b14] rounded-xl border border-slate-800 p-2 shrink-0">
                <img
                  src={`http://localhost:8080/uploads/foto/${detailFotoData.file_gambar}`}
                  alt={detailFotoData.judul}
                  className="w-full max-h-[40vh] md:max-h-[60vh] object-contain rounded-lg shadow-lg"
                />
              </div>

              <div className="w-full lg:w-1/2 flex flex-col gap-4 md:gap-5 justify-center">
                <div className="mb-1 md:mb-2">
                  <span className="text-[10px] md:text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded uppercase font-bold tracking-wider inline-block mb-2 md:mb-3">
                    {detailFotoData.kategori}
                  </span>
                  <h3 className="text-xl md:text-3xl font-extrabold text-white leading-tight">
                    {detailFotoData.judul}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-[#070b14] p-3 md:p-4 rounded-lg border border-slate-800/50 shadow-inner">
                    <p className="text-slate-500 text-[9px] md:text-[10px] uppercase font-bold tracking-wider mb-1">
                      Kamera / Lensa
                    </p>
                    <p className="text-slate-200 font-semibold text-xs md:text-base">
                      {detailFotoData.spesifikasi_kamera || "-"}
                    </p>
                  </div>

                  <div className="bg-[#070b14] p-3 md:p-4 rounded-lg border border-slate-800/50 shadow-inner">
                    <p className="text-slate-500 text-[9px] md:text-[10px] uppercase font-bold tracking-wider mb-1">
                      Lokasi
                    </p>
                    <p className="text-slate-200 font-semibold text-xs md:text-base">
                      {detailFotoData.lokasi || "-"}
                    </p>
                  </div>

                  <div className="bg-[#070b14] p-3 md:p-4 rounded-lg border border-slate-800/50 shadow-inner sm:col-span-2">
                    <p className="text-slate-500 text-[9px] md:text-[10px] uppercase font-bold tracking-wider mb-1">
                      Bulan & Tahun
                    </p>
                    <p className="text-slate-200 font-semibold text-xs md:text-base">
                      {detailFotoData.bulan_tahun || "-"}
                    </p>
                  </div>
                </div>

                <div className="mt-2 md:mt-4 pt-4 md:pt-6 border-t border-slate-800 flex gap-3 shrink-0">
                  <button
                    onClick={() => navigate("/admin/foto")}
                    className="flex-1 py-2 md:py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition text-xs md:text-sm"
                  >
                    Kelola Portofolio Foto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL LIHAT DETAIL VIDEO & PEMUTAR VIDEO (GDRIVE) - DIPERLEBAR & TANPA SIDE-SCROLL */}
      {isDetailVideoOpen && detailVideoData && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-sm transition-opacity">
          <div className="bg-[#0B1120] border border-slate-700 rounded-xl w-full max-w-6xl relative flex flex-col max-h-[90vh] shadow-2xl animate-fade-in overflow-hidden">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-slate-800 shrink-0 bg-[#0B1120] rounded-t-xl">
              <h2 className="text-base md:text-xl font-bold text-white">
                Detail & Putar Video
              </h2>
              <button
                onClick={closeDetailVideoModal}
                className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-full p-1.5 md:p-2 transition duration-200"
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
                  ></path>
                </svg>
              </button>
            </div>

            <div className="p-4 md:p-8 overflow-y-auto overflow-x-hidden custom-scrollbar flex-1 flex flex-col lg:flex-row gap-6 lg:gap-10">
              <div className="w-full lg:w-[55%] flex flex-col bg-[#070b14] rounded-xl border border-slate-800 p-2 shrink-0">
                <div className="w-full h-[40vh] md:h-[50vh] lg:h-[60vh] rounded-lg overflow-hidden bg-black shadow-lg">
                  {getDriveId(detailVideoData.link_video) ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://drive.google.com/file/d/${getDriveId(detailVideoData.link_video)}/preview`}
                      title={detailVideoData.judul}
                      frameBorder="0"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                      <svg
                        className="w-12 h-12 mb-2 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <p className="text-sm">
                        Format Link Google Drive tidak valid
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full lg:w-[45%] flex flex-col gap-4 md:gap-5 justify-center">
                <div className="mb-1 md:mb-2">
                  <span className="text-[10px] md:text-xs bg-purple-500/10 text-purple-400 px-3 py-1 rounded uppercase font-bold tracking-wider inline-block mb-2 md:mb-3">
                    {detailVideoData.kategori}
                  </span>
                  <h3 className="text-xl md:text-3xl font-extrabold text-white leading-tight">
                    {detailVideoData.judul}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-[#070b14] p-3 md:p-4 rounded-lg border border-slate-800/50 shadow-inner">
                    <p className="text-slate-500 text-[9px] md:text-[10px] uppercase font-bold tracking-wider mb-1">
                      Durasi
                    </p>
                    <p className="text-slate-200 font-semibold text-xs md:text-base flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      {detailVideoData.durasi || "-"}
                    </p>
                  </div>

                  <div className="bg-[#070b14] p-3 md:p-4 rounded-lg border border-slate-800/50 shadow-inner">
                    <p className="text-slate-500 text-[9px] md:text-[10px] uppercase font-bold tracking-wider mb-1">
                      Status
                    </p>
                    <p className="text-emerald-400 font-semibold text-xs md:text-base flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Aktif (Ditampilkan)
                    </p>
                  </div>
                </div>

                <div className="bg-[#070b14] p-3 md:p-4 rounded-lg border border-slate-800/50 shadow-inner overflow-hidden">
                  <p className="text-slate-500 text-[9px] md:text-[10px] uppercase font-bold tracking-wider mb-1">
                    Link G-Drive Asli
                  </p>
                  <a
                    href={detailVideoData.link_video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-semibold text-xs block hover:underline break-all"
                  >
                    {detailVideoData.link_video}
                  </a>
                </div>

                <div className="mt-2 md:mt-4 pt-4 md:pt-6 border-t border-slate-800 flex gap-3 shrink-0">
                  <button
                    onClick={() => navigate("/admin/video")}
                    className="flex-1 py-2 md:py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition text-xs md:text-sm"
                  >
                    Kelola Portofolio Video
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

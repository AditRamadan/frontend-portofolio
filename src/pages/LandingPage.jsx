import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  const [profil, setProfil] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [videos, setVideos] = useState([]);

  // STATE KATEGORI DARI API
  const [categoriesFoto, setCategoriesFoto] = useState(["Semua"]);
  const [categoriesVideo, setCategoriesVideo] = useState(["Semua"]);

  // STATE UNTUK FILTER FOTO & PAGINATION
  const [activeCategoryFoto, setActiveCategoryFoto] = useState("Semua");
  const [visibleCountFoto, setVisibleCountFoto] = useState(10);

  // STATE UNTUK FILTER VIDEO & PAGINATION (Baru)
  const [activeCategoryVideo, setActiveCategoryVideo] = useState("Semua");
  const [visibleCountVideo, setVisibleCountVideo] = useState(6);

  // STATE UNTUK LIGHTBOX FOTO, ZOOM, & DRAG
  const [selectedFoto, setSelectedFoto] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragMoved, setDragMoved] = useState(false);

  // STATE UNTUK POPUP MODAL VIDEO
  const [selectedVideo, setSelectedVideo] = useState(null);

  // STATE UNTUK KONTAK
  const [contactForm, setContactForm] = useState({
    nama: "",
    alamat: "",
    noWa: "",
    pesan: "",
  });

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();

    if (!profil || !profil.no_wa) {
      alert("Nomor WhatsApp tujuan belum diatur oleh sistem.");
      return;
    }

    let targetNumber = profil.no_wa.replace(/\D/g, "");

    if (targetNumber.startsWith("0")) {
      targetNumber = "62" + targetNumber.substring(1);
    }

    const namaOwner = profil.nama_lengkap || "Admin";

    const message = `Hallo, ${namaOwner}
Saya,
Nama        : ${contactForm.nama}
Alamat      : ${contactForm.alamat}
No. WA      : ${contactForm.noWa}
Keperluan   : ${contactForm.pesan}

Terima Kasih`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${targetNumber}?text=${encodedMessage}`;
    window.open(waUrl, "_blank");

    setContactForm({ nama: "", alamat: "", noWa: "", pesan: "" });
  };

  useEffect(() => {
    // 1. Fetch Profil
    fetch("http://localhost:8080/api/profil")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setProfil(data.data);
      })
      .catch((err) => console.error(err));

    // 2. Fetch Portofolio Foto
    fetch("http://localhost:8080/api/portofoliofoto")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setFotos(data);
      })
      .catch((err) => console.error(err));

    // 3. Fetch Portofolio Video
    fetch("http://localhost:8080/api/portofoliovideo")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setVideos(data);
      })
      .catch((err) => console.error(err));

    // 4. Fetch Kategori Foto
    fetch("http://localhost:8080/api/kategori?jenis=Foto")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const categoryNames = data.map((item) => item.nama_kategori);
          setCategoriesFoto(["Semua", ...categoryNames]);
        }
      })
      .catch((err) => console.error(err));

    // 5. Fetch Kategori Video
    fetch("http://localhost:8080/api/kategori?jenis=Video")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const categoryNames = data.map((item) => item.nama_kategori);
          setCategoriesVideo(["Semua", ...categoryNames]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // --- LOGIKA FILTER FOTO ---
  const getCategoryCountFoto = (categoryName) => {
    if (categoryName === "Semua") return fotos.length;
    return fotos.filter((foto) => foto.kategori === categoryName).length;
  };

  const filteredFotos =
    activeCategoryFoto === "Semua"
      ? fotos
      : fotos.filter((foto) => foto.kategori === activeCategoryFoto);

  const displayedFotos = filteredFotos.slice(0, visibleCountFoto);

  // --- LOGIKA FILTER VIDEO ---
  const getCategoryCountVideo = (categoryName) => {
    if (categoryName === "Semua") return videos.length;
    return videos.filter((video) => video.kategori === categoryName).length;
  };

  const filteredVideos =
    activeCategoryVideo === "Semua"
      ? videos
      : videos.filter((video) => video.kategori === activeCategoryVideo);

  const displayedVideos = filteredVideos.slice(0, visibleCountVideo);

  // --- LIGHTBOX LOGIC ---
  const handleMouseDown = (e) => {
    if (!isZoomed) return;
    e.preventDefault();
    setIsDragging(true);
    setDragMoved(false);

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isZoomed) return;
    setDragMoved(true);

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    setPosition({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    if (isDragging) setIsDragging(false);
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    if (dragMoved) {
      setDragMoved(false);
      return;
    }
    if (isZoomed) {
      setIsZoomed(false);
      setPosition({ x: 0, y: 0 });
    } else {
      setIsZoomed(true);
    }
  };

  const closeLightbox = () => {
    setSelectedFoto(null);
    setIsZoomed(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white font-sans selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
      {/* GLOBAL CSS UNTUK SMOOTH SCROLLING & ANIMASI FADE-IN SLIDE-UP */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-card-entry {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>

      <Navbar />

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-28 md:pt-36 pb-16 md:pb-20 flex flex-col-reverse md:grid md:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[90vh]">
        <div className="text-center md:text-left z-10">
          <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-slate-700 bg-slate-800/50 text-blue-400 text-[10px] md:text-xs font-semibold tracking-wide mb-6">
            ✦ Videografer & Fotografer
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 md:mb-6">
            Halo,
            <br />
            Saya{" "}
            <span className="text-blue-500">
              {profil ? profil.nama_lengkap : "Loading..."}
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base md:text-lg mb-8 md:mb-10 leading-relaxed max-w-lg mx-auto md:mx-0">
            {profil ? profil.bio_hero : "Mengambil data dari server..."}
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <a
              href="#portofolio"
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm md:text-base font-semibold rounded-xl transition duration-300 shadow-lg shadow-blue-500/30 text-center"
            >
              Lihat Portofolio
            </a>
            <a
              href="#kontak"
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-slate-600 hover:border-slate-400 text-white text-sm md:text-base font-semibold rounded-xl transition duration-300 text-center"
            >
              Hubungi Saya
            </a>
          </div>
        </div>

        <div className="relative flex justify-center items-center mt-4 md:mt-0 w-full max-w-[300px] md:max-w-none mx-auto scale-90 sm:scale-100 lg:scale-110">
          <div className="absolute w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px] rounded-full border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.15)] animate-[spin_10s_linear_infinite]"></div>
          <div className="absolute w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] md:w-[380px] md:h-[380px] lg:w-[420px] lg:h-[420px] rounded-full border-2 border-dashed border-slate-700 animate-[spin_15s_linear_infinite_reverse]"></div>

          <div className="w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] md:w-[340px] md:h-[340px] lg:w-[380px] lg:h-[380px] rounded-full overflow-hidden bg-slate-800 z-10 border-4 border-[#0B1120]">
            <img
              src={
                profil && profil.foto_profil
                  ? `http://localhost:8080/uploads/profil/${profil.foto_profil}`
                  : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              }
              alt={profil ? profil.nama_lengkap : "Profil"}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </main>

      {/* FILOSOFI & VISI SECTION */}
      <section id="filosofi" className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="border-t border-b border-slate-800/50 py-10 md:py-16 flex flex-col lg:flex-row gap-10 lg:gap-16 items-center md:items-start lg:items-center text-center lg:text-left">
            <div className="w-full lg:w-1/3">
              <h3 className="text-blue-500 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-3">
                Filosofi & Visi
              </h3>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight">
                Merekam emosi murni dan keindahan visual lewat lensa sinematik.
              </h2>
            </div>
            <div className="w-full lg:w-2/3 grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-[#0B1120] border border-slate-800 hover:border-slate-600 transition p-5 md:p-6 rounded-xl flex flex-col items-center lg:items-start text-center lg:text-left">
                <h4 className="text-2xl md:text-3xl font-bold text-blue-400 mb-1 md:mb-2">
                  {fotos.length}+
                </h4>
                <p className="text-slate-400 text-xs md:text-sm">Proyek Foto</p>
              </div>
              <div className="bg-[#0B1120] border border-slate-800 hover:border-slate-600 transition p-5 md:p-6 rounded-xl flex flex-col items-center lg:items-start text-center lg:text-left">
                <h4 className="text-2xl md:text-3xl font-bold text-blue-400 mb-1 md:mb-2">
                  {videos.length}+
                </h4>
                <p className="text-slate-400 text-xs md:text-sm">
                  Proyek Video
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTOFOLIO FOTO SECTION */}
      <section
        id="portofolio"
        className="pt-16 md:pt-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
      >
        <div className="mb-10 flex flex-col items-start text-left gap-6">
          <div>
            <h3 className="text-blue-500 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-2 md:mb-3">
              Galeri Foto • Karya Sinematik
            </h3>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3">
              Portofolio Foto
            </h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-xl">
              Kumpulan hasil jepretan kurasi tinggi dalam beberapa Kategori.
            </p>
          </div>

          <div className="flex flex-wrap justify-start gap-2 md:gap-3 w-full">
            {categoriesFoto.map((cat, index) => {
              const count = getCategoryCountFoto(cat);
              const isActive = activeCategoryFoto === cat;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setActiveCategoryFoto(cat);
                    setVisibleCountFoto(10);
                  }}
                  className={`px-4 md:px-5 py-2 text-xs md:text-sm rounded-full flex items-center gap-2 transition duration-300 border whitespace-nowrap ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-[#0B1120] text-slate-300 border-slate-700 hover:bg-slate-800 hover:border-slate-500"
                  }`}
                >
                  {cat}
                  <span
                    className={`text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {displayedFotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-20 border border-dashed border-slate-700 rounded-2xl bg-slate-800/20">
            <p className="text-slate-400 text-sm md:text-lg">
              Belum ada foto untuk kategori ini.
            </p>
          </div>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
              {displayedFotos.map((foto, idx) => (
                <div
                  key={foto.id}
                  onClick={() => {
                    setSelectedFoto(foto);
                    setIsZoomed(false);
                    setPosition({ x: 0, y: 0 });
                  }}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-[#0B1120] border border-slate-700 md:hover:border-blue-500 transition duration-300 cursor-pointer break-inside-avoid shadow-lg animate-card-entry opacity-0"
                >
                  <div className="relative w-full bg-slate-900 overflow-hidden">
                    <img
                      src={`http://localhost:8080/uploads/foto/${foto.file_gambar}`}
                      alt={foto.judul}
                      className="w-full h-auto object-cover md:group-hover:scale-105 transition duration-700 ease-in-out"
                      loading="lazy"
                    />
                    <span className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/60 backdrop-blur-md text-white text-[10px] md:text-xs px-2 md:px-3 py-1 rounded-full border border-white/10">
                      {foto.lokasi}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full translate-y-0 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
                    <div className="flex justify-between items-center mb-1.5 md:mb-2">
                      <span className="text-[9px] md:text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/20 px-2 py-0.5 rounded">
                        {foto.kategori}
                      </span>
                      <span className="text-[10px] md:text-xs text-slate-300 md:text-slate-400">
                        {foto.bulan_tahun}
                      </span>
                    </div>
                    <h3 className="text-base md:text-xl font-bold text-white mb-1.5 md:mb-2 leading-tight line-clamp-2">
                      {foto.judul}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-300 md:text-slate-400 font-light flex items-center gap-1.5 md:gap-2 line-clamp-1">
                      <svg
                        className="w-3 h-3 md:w-4 md:h-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                      {foto.spesifikasi_kamera}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {visibleCountFoto < filteredFotos.length && (
              <div className="flex justify-center mt-10 md:mt-12">
                <button
                  onClick={() => setVisibleCountFoto((prev) => prev + 10)}
                  className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 md:bg-transparent border border-slate-700 md:border-slate-600 md:hover:border-slate-400 text-white md:text-slate-300 md:hover:text-white font-semibold rounded-xl md:rounded-full transition duration-300 flex items-center justify-center gap-3 group"
                >
                  <span className="text-sm md:text-base">
                    Lihat Lebih Banyak
                  </span>
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 md:group-hover:translate-y-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* PORTOFOLIO VIDEO SECTION */}
      <section
        id="galeri-video"
        className="py-16 md:py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto border-t border-slate-800/50"
      >
        <div className="mb-10 flex flex-col items-start text-left gap-6">
          <div>
            <h3 className="text-blue-500 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-2 md:mb-3">
              Galeri Video • Karya Sinematik
            </h3>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3">
              Portofolio Video
            </h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-xl">
              Karya visual bergerak berstandar layar lebar dan dokumenter
              berjiwa puitis. Mengedepankan grading filmik serta tata suara
              atmospheric.
            </p>
          </div>

          <div className="flex flex-wrap justify-start gap-2 md:gap-3 w-full">
            {categoriesVideo.map((cat, index) => {
              const count = getCategoryCountVideo(cat);
              const isActive = activeCategoryVideo === cat;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setActiveCategoryVideo(cat);
                    setVisibleCountVideo(6);
                  }}
                  className={`px-4 md:px-5 py-2 text-xs md:text-sm rounded-full flex items-center gap-2 transition duration-300 border whitespace-nowrap ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-[#0B1120] text-slate-300 border-slate-700 hover:bg-slate-800 hover:border-slate-500"
                  }`}
                >
                  {cat}
                  <span
                    className={`text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {displayedVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-20 border border-dashed border-slate-700 rounded-2xl bg-slate-800/20">
            <p className="text-slate-400 text-sm md:text-lg">
              Belum ada video untuk kategori ini.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {displayedVideos.map((video, idx) => (
                <div
                  key={video.id}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  className="bg-[#0B1120] border border-slate-700 rounded-xl md:rounded-2xl overflow-hidden md:hover:border-blue-500 transition duration-300 flex flex-col group shadow-lg animate-card-entry opacity-0"
                >
                  <div
                    className="relative w-full aspect-video bg-slate-900 overflow-hidden cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <img
                      src={`http://localhost:8080/uploads/thumbnail/${video.file_thumbnail}`}
                      alt={video.judul}
                      className="w-full h-full object-cover md:group-hover:scale-105 transition duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-blue-600/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
                        <svg
                          className="w-5 h-5 text-white translate-x-0.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-black/80 backdrop-blur-md text-white text-[10px] md:text-xs px-2 py-1 rounded border border-white/10 font-mono">
                      {video.durasi}
                    </span>
                  </div>

                  <div className="p-5 md:p-6 flex flex-col justify-between flex-1">
                    <div>
                      <span className="text-[9px] md:text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded inline-block mb-2 md:mb-3">
                        {video.kategori}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-4 leading-tight line-clamp-2">
                        {video.judul}
                      </h3>
                    </div>

                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-800 md:hover:bg-blue-600 text-white text-xs md:text-sm font-semibold rounded-lg transition duration-300"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      Tonton Video
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {visibleCountVideo < filteredVideos.length && (
              <div className="flex justify-center mt-10 md:mt-12">
                <button
                  onClick={() => setVisibleCountVideo((prev) => prev + 6)}
                  className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 md:bg-transparent border border-slate-700 md:border-slate-600 md:hover:border-slate-400 text-white md:text-slate-300 md:hover:text-white font-semibold rounded-xl md:rounded-full transition duration-300 flex items-center justify-center gap-3 group"
                >
                  <span className="text-sm md:text-base">
                    Lihat Lebih Banyak Video
                  </span>
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 md:group-hover:translate-y-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* FORM KONTAK SECTION */}
      <section
        id="kontak"
        className="py-16 md:py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto border-t border-slate-800/50"
      >
        <div className="flex flex-col text-center md:text-left md:flex-row justify-between items-center md:items-end mb-8 md:mb-12">
          <div>
            <h3 className="text-blue-500 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-2 md:mb-3">
              Chat Via WhatsApp
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Hubungi Saya
            </h2>
          </div>
          <p className="text-slate-400 text-xs md:text-sm mt-2 md:mt-0 text-center md:text-right max-w-xs">
            Silahkan isi form di bawah ini untuk menghubungi.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-[#070b14] md:bg-slate-900/50 p-6 md:p-10 rounded-2xl md:border md:border-slate-800 shadow-xl">
          <form
            onSubmit={handleContactSubmit}
            className="space-y-4 md:space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-[#0B1120] md:bg-[#070b14] rounded-xl p-2 border border-slate-800/50 md:border-slate-800 focus-within:border-blue-500 transition-colors">
                <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase px-2 pt-1 md:pt-2">
                  Nama
                </label>
                <input
                  type="text"
                  name="nama"
                  value={contactForm.nama}
                  onChange={handleContactChange}
                  required
                  placeholder="Masukan Nama Anda"
                  className="w-full px-2 py-2 bg-transparent text-sm md:text-base text-white focus:outline-none placeholder-slate-600"
                />
              </div>
              <div className="bg-[#0B1120] md:bg-[#070b14] rounded-xl p-2 border border-slate-800/50 md:border-slate-800 focus-within:border-blue-500 transition-colors">
                <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase px-2 pt-1 md:pt-2">
                  Nomer WA
                </label>
                <input
                  type="tel"
                  name="noWa"
                  value={contactForm.noWa}
                  onChange={handleContactChange}
                  required
                  placeholder="Contoh: 0812345678"
                  className="w-full px-2 py-2 bg-transparent text-sm md:text-base text-white focus:outline-none placeholder-slate-600"
                />
              </div>
            </div>
            <div className="bg-[#0B1120] md:bg-[#070b14] rounded-xl p-2 border border-slate-800/50 md:border-slate-800 focus-within:border-blue-500 transition-colors">
              <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase px-2 pt-1 md:pt-2">
                Alamat
              </label>
              <input
                type="text"
                name="alamat"
                value={contactForm.alamat}
                onChange={handleContactChange}
                required
                placeholder="Masukan Alamat Anda"
                className="w-full px-2 py-2 bg-transparent text-sm md:text-base text-white focus:outline-none placeholder-slate-600"
              />
            </div>
            <div className="bg-[#0B1120] md:bg-[#070b14] rounded-xl p-2 border border-slate-800/50 md:border-slate-800 focus-within:border-blue-500 transition-colors">
              <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase px-2 pt-1 md:pt-2">
                Pesan
              </label>
              <textarea
                name="pesan"
                value={contactForm.pesan}
                onChange={handleContactChange}
                required
                rows="4"
                placeholder="Tuliskan keperluan Anda..."
                className="w-full px-2 py-2 bg-transparent text-sm md:text-base text-white focus:outline-none placeholder-slate-600 resize-none"
              ></textarea>
            </div>
            <div className="flex justify-end pt-2 md:pt-4">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3.5 md:py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm md:text-base font-bold rounded-xl md:rounded-full transition duration-300 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
              >
                KIRIM PESAN SEKARANG
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* QUICK CONTACTS SECTION */}
      <section
        id="kontak-langsung"
        className="py-16 md:py-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto border-t border-slate-800/50"
      >
        <div className="flex flex-col text-center md:text-left md:flex-row justify-between items-center md:items-end mb-8 md:mb-12">
          <div>
            <h3 className="text-blue-500 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-2 md:mb-3">
              Alternatif
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Hubungi Langsung
            </h2>
          </div>
          <p className="text-slate-400 text-xs md:text-sm mt-2 md:mt-0 text-center md:text-right max-w-sm">
            Anda juga dapat terhubung langsung melalui media sosial atau kontak
            di bawah ini.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
          {/* Tombol WhatsApp */}
          <a
            href={
              profil && profil.no_wa
                ? `https://wa.me/${profil.no_wa.replace(/\D/g, "").startsWith("0") ? "62" + profil.no_wa.replace(/\D/g, "").substring(1) : profil.no_wa.replace(/\D/g, "")}?text=${encodeURIComponent(`Hallo, ${profil.nama_lengkap || "Admin"}\nSaya ingin bertanya seputar jasa yang Anda tawarkan.`)}`
                : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 md:gap-4 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-400 border border-emerald-500/20 p-4 md:p-5 rounded-xl transition duration-300 group justify-start"
          >
            <div className="bg-emerald-500/20 p-2.5 md:p-3 rounded-lg group-hover:bg-white/20 shrink-0">
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>
            <div className="text-left overflow-hidden w-full">
              <p className="text-[10px] md:text-xs uppercase font-bold tracking-wider opacity-80">
                WhatsApp
              </p>
              <p className="font-semibold text-xs md:text-sm truncate w-full">
                {profil ? profil.no_wa : "Belum diatur"}
              </p>
            </div>
          </a>

          {/* Tombol Email */}
          <a
            href={
              profil && profil.email
                ? `mailto:${profil.email}?subject=Tanya Jasa Portofolio`
                : "#"
            }
            className="flex items-center gap-3 md:gap-4 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/20 p-4 md:p-5 rounded-xl transition duration-300 group justify-start"
          >
            <div className="bg-red-500/20 p-2.5 md:p-3 rounded-lg group-hover:bg-white/20 shrink-0">
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <div className="text-left overflow-hidden w-full">
              <p className="text-[10px] md:text-xs uppercase font-bold tracking-wider opacity-80">
                Email
              </p>
              <p className="font-semibold text-xs md:text-sm truncate w-full">
                {profil ? profil.email : "Belum diatur"}
              </p>
            </div>
          </a>

          {/* Tombol Instagram */}
          <a
            href={
              profil && profil.link_socmed
                ? profil.link_socmed.includes("http")
                  ? profil.link_socmed
                  : `https://instagram.com/${profil.link_socmed.replace("@", "")}`
                : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 md:gap-4 bg-fuchsia-500/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent text-fuchsia-400 border border-fuchsia-500/20 p-4 md:p-5 rounded-xl transition duration-300 group justify-start sm:col-span-2 lg:col-span-1"
          >
            <div className="bg-fuchsia-500/20 p-2.5 md:p-3 rounded-lg group-hover:bg-white/20 shrink-0">
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </div>
            <div className="text-left overflow-hidden w-full">
              <p className="text-[10px] md:text-xs uppercase font-bold tracking-wider opacity-80">
                Instagram
              </p>
              <p className="font-semibold text-xs md:text-sm truncate w-full">
                {profil && profil.link_socmed
                  ? profil.link_socmed.includes("http")
                    ? "@" +
                      profil.link_socmed.split(".com/")[1]?.replace("/", "")
                    : profil.link_socmed.startsWith("@")
                      ? profil.link_socmed
                      : "@" + profil.link_socmed
                  : "Belum diatur"}
              </p>
            </div>
          </a>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="mt-10 border-t border-slate-800/50 bg-[#070b14] py-12 md:py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
            Mari Ciptakan Cerita Visual Anda
          </h2>
          <p className="text-blue-500 italic text-lg md:text-xl mb-8 md:mb-12">
            "Let's Work Together"
          </p>
          <p className="text-slate-400 text-xs md:text-sm max-w-2xl mx-auto mb-10 md:mb-16 px-4 md:px-0">
            Terbuka untuk kolaborasi visual komersial, dokumentasi pernikahan
            eksklusif, dan penugasan kreatif.
          </p>
          <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs text-slate-500 gap-4 md:gap-0">
            <p>ANGPERTURE — Videografer & Fotografer</p>
            <p>© 2026 ANGPERTURE Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX MODAL DENGAN ANIMASI */}
      {selectedFoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center backdrop-blur-md overflow-hidden transition-opacity duration-300 animate-[fadeIn_0.25s_ease-out]"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleUp {
              from { opacity: 0; transform: scale(0.92); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-modal-pop {
              animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>

          <div
            className="absolute inset-0 z-[105]"
            onClick={closeLightbox}
          ></div>
          <button
            className="absolute top-4 right-4 md:top-6 md:right-6 z-[120] text-slate-400 hover:text-white bg-black/50 rounded-full p-2 md:p-3 transition hover:scale-110 active:scale-95"
            onClick={closeLightbox}
          >
            <svg
              className="w-6 h-6 md:w-8 md:h-8"
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
          <div
            className="relative flex items-center justify-center w-full h-[70vh] md:h-[80vh] z-[110] px-2 md:px-10 animate-modal-pop"
            style={{
              cursor: isZoomed ? (isDragging ? "grabbing" : "grab") : "zoom-in",
            }}
          >
            <img
              src={`http://localhost:8080/uploads/foto/${selectedFoto.file_gambar}`}
              alt={selectedFoto.judul}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              onClick={handleImageClick}
              draggable="false"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${isZoomed ? (window.innerWidth < 768 ? 1.5 : 2.5) : 1})`,
                transition: isDragging
                  ? "none"
                  : "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
              className="max-h-full max-w-full object-contain shadow-2xl origin-center"
            />
          </div>
          {!isZoomed && (
            <div className="absolute bottom-6 md:bottom-8 left-0 w-full text-center pointer-events-none z-[110] px-4 animate-modal-pop">
              <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg line-clamp-1">
                {selectedFoto.judul}
              </h3>
              <p className="text-slate-300 text-xs md:text-sm mt-1 drop-shadow-md">
                {selectedFoto.spesifikasi_kamera} • {selectedFoto.lokasi}
              </p>
              <p className="text-slate-500 text-[10px] md:text-xs mt-3 md:mt-4 hidden md:block">
                Klik gambar untuk Zoom. Tahan & geser untuk melihat detail.
              </p>
            </div>
          )}
        </div>
      )}

      {/* POPUP MODAL VIDEO DENGAN ANIMASI */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center backdrop-blur-md p-2 transition-opacity duration-300 animate-[fadeIn_0.25s_ease-out]">
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleUp {
              from { opacity: 0; transform: scale(0.92); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-modal-pop {
              animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>

          <div
            className="absolute inset-0"
            onClick={() => setSelectedVideo(null)}
          ></div>
          <div className="relative w-full max-w-2xl bg-[#0B1120] border border-slate-700 rounded-xl overflow-hidden shadow-2xl z-10 flex flex-col my-auto animate-modal-pop">
            <div className="flex justify-between items-center px-4 py-2.5 border-b border-slate-800 bg-slate-900/50 shrink-0">
              <h3 className="text-xs sm:text-sm font-bold text-white truncate pr-4">
                {selectedVideo.judul}
              </h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full p-1.5 transition hover:scale-110 active:scale-95 cursor-pointer shrink-0"
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

            {/* KOTAK VIDEO */}
            <div className="relative w-full h-[450px] bg-black shrink-0 flex items-center justify-center overflow-hidden">
              <iframe
                src={(() => {
                  let url = selectedVideo.link_video;
                  if (url.includes("drive.google.com")) {
                    if (url.includes("/view")) {
                      url = url.replace(/\/view.*$/, "/preview");
                    } else if (!url.includes("/preview")) {
                      url = url.replace(/\/edit.*$/, "/preview");
                    }
                  } else if (url.includes("watch?v=")) {
                    url = url.replace("watch?v=", "embed/");
                  }
                  return url;
                })()}
                title={selectedVideo.judul}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="px-4 py-2 bg-slate-900/30 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-800 shrink-0">
              <span>
                Kategori:{" "}
                <strong className="text-slate-200">
                  {selectedVideo.kategori}
                </strong>
              </span>
              <span>
                Durasi:{" "}
                <strong className="text-slate-200">
                  {selectedVideo.durasi}
                </strong>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

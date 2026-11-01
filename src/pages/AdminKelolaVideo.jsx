import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminKelolaVideo() {
  const [videos, setVideos] = useState([]);
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // STATE BARU: Untuk Fitur Search, Filter & Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" atau "oldest"

  // State untuk Modal Form (Tambah/Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // State untuk Modal Detail
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);

  // STATE BARU: Untuk Mengontrol Custom Popup Notifikasi & Konfirmasi
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // Menyimpan data video yang mau dihapus

  const fetchVideos = () => {
    fetch("http://localhost:8080/api/portofoliovideo")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setVideos(data);
      })
      .catch((err) => console.error("Error fetching videos:", err));
  };

  const fetchKategoriVideo = () => {
    fetch("http://localhost:8080/api/kategori?jenis=Video")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setKategoriOptions(data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchVideos();
    fetchKategoriVideo();
  }, []);

  // LOGIKA FILTER & SORTING (Dijalankan otomatis setiap kali state berubah)
  const filteredAndSortedVideos = videos
    .filter((vid) => {
      // 1. Filter Pencarian Judul
      const matchSearch = vid.judul
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      // 2. Filter Kategori
      const matchKategori =
        filterKategori === "" || vid.kategori === filterKategori;

      return matchSearch && matchKategori;
    })
    .sort((a, b) => {
      // 3. Sorting (Asumsi ID lebih besar = data lebih baru)
      if (sortOrder === "newest") {
        return b.id - a.id;
      } else {
        return a.id - b.id;
      }
    });

  // Handler Modal Form Tambah/Edit
  const openModal = (video = null) => {
    setEditData(video);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  // Handler Modal Detail
  const openDetailModal = (video) => {
    setDetailData(video);
    setIsDetailModalOpen(true);
  };
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setDetailData(null);
  };

  // Fungsi untuk ekstrak ID Google Drive dari link
  const getDriveId = (url) => {
    if (!url) return null;
    const regExp = /(?:file\/d\/|id=)([\w-]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Membuka modal konfirmasi hapus
  const handleDeleteClick = (id, judul) => {
    setDeleteTarget({ id, judul });
    setShowDeleteConfirmModal(true);
  };

  // Eksekusi hapus setelah dikonfirmasi
  const confirmDelete = () => {
    if (!deleteTarget) return;

    let formData = new FormData();
    formData.append("_method", "DELETE");

    fetch(`http://localhost:8080/api/portofoliovideo/${deleteTarget.id}`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setShowDeleteConfirmModal(false);
        setDeleteTarget(null);

        if (data.status === "success") {
          setSuccessMessage("Portofolio video berhasil dihapus!");
          setShowSuccessModal(true);
          fetchVideos();
        } else {
          setErrorMessage("Gagal menghapus video.");
          setShowErrorModal(true);
        }
      })
      .catch((err) => {
        console.error("Error Delete Video:", err);
        setShowDeleteConfirmModal(false);
        setDeleteTarget(null);
        setErrorMessage("Terjadi kesalahan jaringan saat menghapus video.");
        setShowErrorModal(true);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    let formData = new FormData(form);
    formData.append("status_aktif", 1);

    let url = "http://localhost:8080/api/portofoliovideo";
    const isEdit = editData !== null;

    if (isEdit) {
      url = `http://localhost:8080/api/portofoliovideo/${editData.id}`;
      formData.append("_method", "PUT");
    }

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          closeModal();
          fetchVideos();
          form.reset();
          setSuccessMessage(
            isEdit
              ? "Perubahan portofolio video berhasil disimpan!"
              : "Portofolio video baru berhasil ditambahkan!",
          );
          setShowSuccessModal(true);
        } else {
          setErrorMessage(
            isEdit
              ? "Gagal memperbarui portofolio video."
              : "Gagal menyimpan portofolio video baru.",
          );
          setShowErrorModal(true);
        }
      })
      .catch((err) => {
        console.error("Error Upload Video:", err);
        setErrorMessage(
          "Terjadi kesalahan jaringan saat menyimpan data video.",
        );
        setShowErrorModal(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 font-sans flex relative">
      <AdminSidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300 w-full overflow-hidden">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 gap-4">
          <div>
            <h3 className="text-blue-500 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-1 md:mb-2">
              Content Management System
            </h3>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Kelola Portofolio Video
            </h1>
          </div>

          <button
            onClick={() => openModal()}
            className="w-full md:w-auto justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-lg transition duration-300 flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] shrink-0"
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
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Tambah Video Baru
          </button>
        </div>

        {/* DAFTAR VIDEO SECTION */}
        <div className="bg-[#0B1120] border border-slate-800/50 p-4 md:p-6 rounded-xl shadow-lg min-h-[500px] flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-800/50 pb-6">
            <h2 className="text-base md:text-lg font-bold text-white shrink-0">
              Daftar Video Tersimpan
            </h2>

            {/* FILTER, SEARCH, & SORT TOOLBAR */}
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
              {/* Kolom Pencarian */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Cari judul video..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#070b14] border border-slate-700 text-slate-300 text-xs md:text-sm rounded-lg px-4 py-2.5 pl-10 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <svg
                  className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>

              {/* Dropdown Kategori */}
              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="w-full sm:w-auto bg-[#070b14] border border-slate-700 text-slate-300 text-xs md:text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none pr-8 relative"
              >
                <option value="">Semua Kategori</option>
                {kategoriOptions.map((kat) => (
                  <option key={kat.id} value={kat.nama_kategori}>
                    {kat.nama_kategori}
                  </option>
                ))}
              </select>

              {/* Tombol Sortir Terbaru/Terlama */}
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
                }
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs md:text-sm rounded-lg px-4 py-2.5 transition-colors shrink-0"
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
                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                  ></path>
                </svg>
                {sortOrder === "newest" ? "Terbaru" : "Terlama"}
              </button>
            </div>
          </div>

          {/* Menampilkan pesan berbeda jika kosong karena filter atau memang database kosong */}
          {videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-20 border border-dashed border-slate-700 rounded-xl bg-[#070b14]">
              <p className="text-slate-500 text-sm md:text-base text-center px-4">
                Belum ada data video yang diunggah.
              </p>
            </div>
          ) : filteredAndSortedVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-20 border border-dashed border-slate-700 rounded-xl bg-[#070b14]">
              <p className="text-slate-500 text-sm md:text-base text-center px-4">
                Tidak ada video yang cocok dengan pencarian/kategori ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredAndSortedVideos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => openDetailModal(vid)}
                  className="flex gap-4 p-3 md:p-4 bg-[#070b14] border border-slate-800 rounded-xl hover:border-blue-500/50 transition cursor-pointer group shadow-sm hover:shadow-blue-500/10 relative"
                >
                  <div className="relative shrink-0 w-20 h-28 md:w-24 md:h-32 overflow-hidden rounded-md bg-slate-900">
                    <img
                      src={`http://localhost:8080/uploads/thumbnail/${vid.file_thumbnail}`}
                      alt="thumbnail"
                      className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-60 transition-all duration-300"
                    />
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

                  <div className="flex flex-col justify-between flex-1 overflow-hidden">
                    <div>
                      <span className="text-[9px] md:text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded uppercase font-bold inline-block mb-1">
                        {vid.kategori}
                      </span>
                      <h3 className="text-xs md:text-sm font-bold text-white line-clamp-2 leading-tight mt-1 group-hover:text-blue-400 transition-colors">
                        {vid.judul}
                      </h3>
                      <p className="text-[10px] md:text-xs text-slate-500 mt-1.5 md:mt-2">
                        Durasi: {vid.durasi}
                      </p>
                    </div>

                    <div className="flex gap-2 justify-end mt-2 md:mt-4 border-t border-slate-800 pt-2 md:pt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(vid);
                        }}
                        className="text-[10px] md:text-xs px-2.5 md:px-3 py-1 md:py-1.5 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(vid.id, vid.judul);
                        }}
                        className="text-[10px] md:text-xs px-2.5 md:px-3 py-1 md:py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white rounded transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* POPUP MODAL TAMBAH/EDIT VIDEO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity overflow-y-auto">
          <div className="bg-[#0B1120] border border-slate-700 rounded-xl w-full max-w-2xl relative my-8 flex flex-col max-h-[90vh] shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center p-5 md:p-6 border-b border-slate-800 shrink-0 bg-[#0B1120] rounded-t-xl">
              <h2 className="text-lg md:text-xl font-bold text-white">
                {editData
                  ? "Edit Portofolio Video"
                  : "Tambah Portofolio Video Baru"}
              </h2>
              <button
                onClick={closeModal}
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

            <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar flex-1">
              <form
                id="videoForm"
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 md:gap-5"
              >
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-1.5 md:mb-2">
                    Judul Video
                  </label>
                  <input
                    type="text"
                    name="judul"
                    defaultValue={editData?.judul || ""}
                    required
                    placeholder="Contoh: Cinematic Wedding Video..."
                    className="w-full p-2.5 md:p-3 bg-[#070b14] border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-1.5 md:mb-2">
                      Kategori
                    </label>
                    {kategoriOptions.length > 0 ? (
                      <select
                        name="kategori"
                        defaultValue={
                          editData?.kategori ||
                          kategoriOptions[0]?.nama_kategori
                        }
                        required
                        className="w-full p-2.5 md:p-3 bg-[#070b14] border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition appearance-none cursor-pointer"
                      >
                        {kategoriOptions.map((kat) => (
                          <option key={kat.id} value={kat.nama_kategori}>
                            {kat.nama_kategori}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full p-2.5 md:p-3 bg-[#070b14] border border-red-800/50 rounded-lg text-red-400 text-xs">
                        Belum ada kategori video! Tambah di Kelola Kategori.
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-1.5 md:mb-2">
                      Durasi
                    </label>
                    <input
                      type="text"
                      name="durasi"
                      defaultValue={editData?.durasi || ""}
                      required
                      placeholder="Contoh: 02:45"
                      className="w-full p-2.5 md:p-3 bg-[#070b14] border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-1.5 md:mb-2">
                    Link Video (Google Drive)
                  </label>
                  <input
                    type="text"
                    name="link_video"
                    defaultValue={editData?.link_video || ""}
                    required
                    placeholder="Contoh: https://drive.google.com/file/d/..."
                    className="w-full p-2.5 md:p-3 bg-[#070b14] border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div className="mt-2 p-3 md:p-4 border-2 border-dashed border-slate-700 rounded-xl bg-[#070b14] flex flex-col items-center">
                  <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-2 md:mb-3 text-center">
                    {editData
                      ? "Ganti File Thumbnail (Opsional)"
                      : "Upload Thumbnail (*.jpg/*.png)"}
                  </label>
                  <input
                    type="file"
                    name="file_thumbnail"
                    accept="image/*"
                    required={!editData}
                    className="text-center text-slate-400 file:mr-4 file:py-1.5 md:file:py-2 file:px-3 md:file:px-4 file:rounded-md file:border-0 file:text-[10px] md:file:text-sm file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer text-[10px] md:text-sm w-full md:w-auto overflow-hidden"
                  />
                </div>
              </form>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 p-5 md:p-6 border-t border-slate-800 shrink-0 bg-[#0B1120] rounded-b-xl">
              <button
                type="button"
                onClick={closeModal}
                className="w-full sm:w-auto px-6 py-2.5 bg-transparent border border-slate-600 hover:border-slate-400 text-slate-300 font-bold rounded-lg transition duration-300 text-sm md:text-base order-2 sm:order-1"
              >
                Batal
              </button>
              <button
                type="submit"
                form="videoForm"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition duration-300 shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base order-1 sm:order-2"
              >
                {loading ? "Menyimpan..." : "Simpan Video"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL LIHAT DETAIL VIDEO & PEMUTAR VIDEO (GDRIVE) */}
      {isDetailModalOpen && detailData && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-sm transition-opacity">
          {/* Diperlebar menggunakan max-w-6xl dan overflow-hidden agar rapi */}
          <div className="bg-[#0B1120] border border-slate-700 rounded-xl w-full max-w-6xl relative flex flex-col max-h-[90vh] shadow-2xl animate-fade-in overflow-hidden">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-slate-800 shrink-0 bg-[#0B1120] rounded-t-xl">
              <h2 className="text-base md:text-xl font-bold text-white">
                Detail & Putar Video
              </h2>
              <button
                onClick={closeDetailModal}
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

            {/* Mencegah scroll X horizontal pada area kontent */}
            <div className="p-4 md:p-8 overflow-y-auto overflow-x-hidden custom-scrollbar flex-1 flex flex-col lg:flex-row gap-6 lg:gap-10">
              {/* Video Player Area */}
              <div className="w-full lg:w-[55%] flex flex-col bg-[#070b14] rounded-xl border border-slate-800 p-2 shrink-0">
                <div className="w-full h-[40vh] md:h-[50vh] lg:h-[60vh] rounded-lg overflow-hidden bg-black shadow-lg">
                  {getDriveId(detailData.link_video) ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://drive.google.com/file/d/${getDriveId(detailData.link_video)}/preview`}
                      title={detailData.judul}
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

              {/* Data Detail Area */}
              <div className="w-full lg:w-[45%] flex flex-col gap-4 md:gap-5 justify-center">
                <div className="mb-1 md:mb-2">
                  <span className="text-[10px] md:text-xs bg-purple-500/10 text-purple-400 px-3 py-1 rounded uppercase font-bold tracking-wider inline-block mb-2 md:mb-3">
                    {detailData.kategori}
                  </span>
                  <h3 className="text-xl md:text-3xl font-extrabold text-white leading-tight">
                    {detailData.judul}
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
                      {detailData.durasi || "-"}
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

                {/* break-all memastikan link Drive yang super panjang dipotong turun ke bawah, tidak mendorong container melebar */}
                <div className="bg-[#070b14] p-3 md:p-4 rounded-lg border border-slate-800/50 shadow-inner overflow-hidden">
                  <p className="text-slate-500 text-[9px] md:text-[10px] uppercase font-bold tracking-wider mb-1">
                    Link G-Drive Asli
                  </p>
                  <a
                    href={detailData.link_video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-semibold text-xs block hover:underline break-all"
                  >
                    {detailData.link_video}
                  </a>
                </div>

                <div className="mt-2 md:mt-4 pt-4 md:pt-6 border-t border-slate-800 flex gap-3 shrink-0">
                  <button
                    onClick={() => {
                      closeDetailModal();
                      openModal(detailData);
                    }}
                    className="flex-1 py-2 md:py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition text-xs md:text-sm"
                  >
                    Edit Data Ini
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL NOTIFIKASI SUKSES */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
          <div className="bg-[#0B1120] border border-emerald-500/30 rounded-xl w-full max-w-sm relative shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-[fadeIn_0.2s_ease-out]">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sukses!</h3>
              <p className="text-sm text-slate-400 mb-6">{successMessage}</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition duration-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL NOTIFIKASI GAGAL / ERROR */}
      {showErrorModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
          <div className="bg-[#0B1120] border border-red-500/30 rounded-xl w-full max-w-sm relative shadow-[0_0_30px_rgba(239,68,68,0.15)] animate-[fadeIn_0.2s_ease-out]">
            <div className="p-6 text-center">
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Gagal!</h3>
              <p className="text-sm text-slate-400 mb-6">{errorMessage}</p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition duration-200 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL KONFIRMASI HAPUS */}
      {showDeleteConfirmModal && deleteTarget && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
          <div className="bg-[#0B1120] border border-red-500/30 rounded-xl w-full max-w-sm relative shadow-[0_0_30px_rgba(239,68,68,0.15)] animate-[fadeIn_0.2s_ease-out]">
            <div className="p-6 text-center">
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Konfirmasi Hapus
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                Apakah Anda yakin ingin menghapus video{" "}
                <span className="text-white font-semibold">
                  "{deleteTarget.judul}"
                </span>
                ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirmModal(false);
                    setDeleteTarget(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-transparent border border-slate-600 hover:bg-slate-800 text-slate-300 font-semibold rounded-lg transition duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition duration-200 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animasi Custom untuk Modal */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminKelolaKategori() {
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama_kategori: "",
    jenis: "Foto", // Default
  });

  // STATE BARU: Untuk Mengontrol Modal Notifikasi & Konfirmasi
  const [showSuccessSaveModal, setShowSuccessSaveModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showSuccessDeleteModal, setShowSuccessDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchKategori = () => {
    fetch("http://localhost:8080/api/kategori")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setKategoriList(data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    let dataToSend = new FormData();
    dataToSend.append("nama_kategori", formData.nama_kategori);
    dataToSend.append("jenis", formData.jenis);

    fetch("http://localhost:8080/api/kategori", {
      method: "POST",
      body: dataToSend,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setFormData({ nama_kategori: "", jenis: "Foto" });
          setIsModalOpen(false); // Tutup modal form
          setShowSuccessSaveModal(true); // Tampilkan modal sukses simpan
          fetchKategori(); // Refresh tabel
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  // Trigger untuk membuka modal konfirmasi hapus
  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setShowDeleteConfirmModal(true);
  };

  // Eksekusi penghapusan setelah dikonfirmasi di modal
  const confirmDelete = () => {
    if (!selectedCategory) return;

    fetch(`http://localhost:8080/api/kategori/${selectedCategory.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setShowDeleteConfirmModal(false);
          setSelectedCategory(null);
          setShowSuccessDeleteModal(true); // Tampilkan modal sukses hapus
          fetchKategori();
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 font-sans flex relative">
      <AdminSidebar />

      {/* Tambahkan pt-20 untuk mobile agar tidak tertutup navbar mobile */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300 w-full overflow-hidden">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 gap-4">
          <div>
            <h3 className="text-blue-500 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-1 md:mb-2">
              Master Data
            </h3>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Kelola Kategori
            </h1>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto justify-center bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition duration-300 shadow-[0_0_15px_rgba(37,99,235,0.3)] shrink-0"
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
            Tambah Kategori
          </button>
        </div>

        {/* TABEL KATEGORI (FULL WIDTH & RESPONSIVE) */}
        <div className="bg-[#0B1120] border border-slate-800/50 rounded-xl shadow-lg w-full overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs md:text-sm text-slate-400 whitespace-nowrap">
              <thead className="bg-slate-900/50 uppercase font-semibold text-slate-300">
                <tr>
                  <th className="px-4 md:px-6 py-3 md:py-4">No</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">Nama Kategori</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">Jenis</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {kategoriList.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/20 transition duration-150"
                  >
                    <td className="px-4 md:px-6 py-3 md:py-4">{index + 1}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 font-semibold text-white">
                      {item.nama_kategori}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <span
                        className={`px-2.5 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wide ${
                          item.jenis === "Foto"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-purple-500/10 text-purple-400"
                        }`}
                      >
                        {item.jenis}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="text-red-400 hover:text-red-300 text-[10px] md:text-xs font-bold transition"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {kategoriList.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 md:px-6 py-8 text-center text-slate-500"
                    >
                      Belum ada data kategori.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* POPUP MODAL TAMBAH KATEGORI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0B1120] border border-slate-800/50 rounded-xl shadow-2xl w-full max-w-md relative my-8 flex flex-col max-h-[90vh] animate-fade-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 md:p-6 border-b border-slate-800 shrink-0 bg-[#0B1120] rounded-t-xl">
              <h2 className="text-lg md:text-xl font-bold text-white">
                Tambah Kategori
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
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

            {/* Modal Form */}
            <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar">
              <form
                id="kategoriForm"
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 md:gap-5"
              >
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-1.5 md:mb-2">
                    Jenis Portofolio
                  </label>
                  <select
                    name="jenis"
                    value={formData.jenis}
                    onChange={handleChange}
                    className="w-full p-2.5 md:p-3 bg-[#070b14] border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="Foto">Galeri Foto</option>
                    <option value="Video">Galeri Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-1.5 md:mb-2">
                    Nama Kategori
                  </label>
                  <input
                    type="text"
                    name="nama_kategori"
                    value={formData.nama_kategori}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: Prewedding, Cinematic..."
                    className="w-full p-2.5 md:p-3 bg-[#070b14] border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 placeholder-slate-600"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 p-5 md:p-6 border-t border-slate-800 shrink-0 bg-[#0B1120] rounded-b-xl">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-6 py-2.5 bg-transparent border border-slate-600 hover:border-slate-400 text-slate-300 font-bold rounded-lg transition duration-300 text-sm md:text-base order-2 sm:order-1"
              >
                Batal
              </button>
              <button
                type="submit"
                form="kategoriForm"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition duration-300 shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base order-1 sm:order-2"
              >
                {loading ? "Menyimpan..." : "Simpan Kategori"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL SUKSES MENYIMPAN */}
      {showSuccessSaveModal && (
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
              <p className="text-sm text-slate-400 mb-6">
                Kategori baru berhasil ditambahkan.
              </p>
              <button
                onClick={() => setShowSuccessSaveModal(false)}
                className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition duration-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL KONFIRMASI HAPUS */}
      {showDeleteConfirmModal && selectedCategory && (
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
                Apakah Anda yakin ingin menghapus kategori{" "}
                <span className="text-white font-semibold">
                  "{selectedCategory.nama_kategori}"
                </span>
                ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirmModal(false)}
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

      {/* POPUP MODAL SUKSES MENGHAPUS */}
      {showSuccessDeleteModal && (
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
              <h3 className="text-xl font-bold text-white mb-2">Terhapus!</h3>
              <p className="text-sm text-slate-400 mb-6">
                Kategori berhasil dihapus dari sistem.
              </p>
              <button
                onClick={() => setShowSuccessDeleteModal(false)}
                className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition duration-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                Tutup
              </button>
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

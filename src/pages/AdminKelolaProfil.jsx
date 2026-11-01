import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminKelolaProfil() {
  const [loading, setLoading] = useState(false);

  // State untuk Notifikasi Custom Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [previewFoto, setPreviewFoto] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    nama_lengkap: "",
    bio_hero: "",
    no_wa: "",
    email: "",
    alamat: "",
    link_socmed: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const fetchProfil = () => {
    fetch("http://localhost:8080/api/profil")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.data) {
          setFormData({
            nama_lengkap: data.data.nama_lengkap || "",
            bio_hero: data.data.bio_hero || "",
            no_wa: data.data.no_wa || "",
            email: data.data.email || "",
            alamat: data.data.alamat || "",
            link_socmed: data.data.link_socmed || "",
          });
          if (data.data.foto_profil) {
            setPreviewFoto(
              `http://localhost:8080/uploads/profil/${data.data.foto_profil}`,
            );
          }
        }
      })
      .catch((err) => console.error("Error fetching profil:", err));
  };

  useEffect(() => {
    fetchProfil();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    let dataToSend = new FormData();
    dataToSend.append("nama_lengkap", formData.nama_lengkap);
    dataToSend.append("bio_hero", formData.bio_hero);
    dataToSend.append("no_wa", formData.no_wa);
    dataToSend.append("email", formData.email);
    dataToSend.append("alamat", formData.alamat);
    dataToSend.append("link_socmed", formData.link_socmed);
    dataToSend.append("_method", "PUT");

    if (selectedFile) {
      dataToSend.append("foto_profil", selectedFile);
    }

    fetch("http://localhost:8080/api/profil/1", {
      method: "POST",
      body: dataToSend,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setIsModalOpen(false); // Tutup form edit
          setShowSuccessModal(true); // Tampilkan modal sukses
          fetchProfil();
        } else {
          setErrorMessage(data.message || "Gagal memperbarui profil.");
          setShowErrorModal(true); // Tampilkan modal gagal
        }
      })
      .catch((err) => {
        console.error("Error updating profil:", err);
        setErrorMessage("Terjadi kesalahan jaringan saat menyimpan profil.");
        setShowErrorModal(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 font-sans flex relative">
      <AdminSidebar />
      {/* Tambahkan pt-20 untuk mobile agar tidak tertutup navbar mobile */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 gap-4">
          <div>
            <h3 className="text-blue-500 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-1 md:mb-2">
              Content Management System
            </h3>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Kelola Profil Owner
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
            Edit Profil
          </button>
        </div>

        {/* PREVIEW PROFIL SECTION */}
        <div className="bg-[#0B1120] border border-slate-800/50 rounded-xl shadow-lg w-full overflow-hidden flex flex-col md:flex-row items-center md:items-start p-6 md:p-8 gap-6 md:gap-8">
          {/* Foto Profil Area */}
          <div className="w-32 h-32 md:w-56 md:h-56 shrink-0 relative group rounded-full overflow-hidden border-4 border-slate-800">
            {previewFoto ? (
              <img
                src={previewFoto}
                alt="Foto Profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 text-xs md:text-base">
                Belum ada foto
              </div>
            )}
          </div>

          {/* Info Detail Area */}
          <div className="flex-1 w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 text-center md:text-left">
              {formData.nama_lengkap || "Nama Belum Diatur"}
            </h2>
            <p className="text-blue-500 font-medium text-xs md:text-sm lg:text-base mb-6 text-center md:text-left">
              Videografer & Fotografer
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm">
              <div className="bg-[#070b14] p-3 md:p-4 rounded-lg border border-slate-800/50">
                <p className="text-slate-500 text-[9px] md:text-[10px] uppercase font-bold tracking-wider mb-1">
                  Email
                </p>
                <p
                  className="text-slate-300 font-semibold truncate"
                  title={formData.email}
                >
                  {formData.email || "-"}
                </p>
              </div>
              <div className="bg-[#070b14] p-3 md:p-4 rounded-lg border border-slate-800/50">
                <p className="text-slate-500 text-[9px] md:text-[10px] uppercase font-bold tracking-wider mb-1">
                  Nomor WhatsApp
                </p>
                <p
                  className="text-slate-300 font-semibold truncate"
                  title={formData.no_wa}
                >
                  {formData.no_wa || "-"}
                </p>
              </div>
              <div className="bg-[#070b14] p-3 md:p-4 rounded-lg border border-slate-800/50 sm:col-span-2">
                <p className="text-slate-500 text-[9px] md:text-[10px] uppercase font-bold tracking-wider mb-1">
                  Alamat Domisili
                </p>
                <p
                  className="text-slate-300 font-semibold truncate"
                  title={formData.alamat}
                >
                  {formData.alamat || "-"}
                </p>
              </div>
              <div className="bg-[#070b14] p-3 md:p-4 rounded-lg border border-slate-800/50 sm:col-span-2 lg:col-span-4">
                <p className="text-slate-500 text-[9px] md:text-[10px] uppercase font-bold tracking-wider mb-1">
                  Link Socmed
                </p>
                <a
                  href={
                    formData.link_socmed.includes("http")
                      ? formData.link_socmed
                      : `https://${formData.link_socmed}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-semibold truncate block"
                  title={formData.link_socmed}
                >
                  {formData.link_socmed || "-"}
                </a>
              </div>
            </div>

            <div className="mt-4 bg-[#070b14] p-4 md:p-5 rounded-lg border border-slate-800/50">
              <p className="text-slate-500 text-[9px] md:text-[10px] uppercase font-bold tracking-wider mb-2">
                Hero Description / Bio Singkat
              </p>
              <p className="text-slate-400 italic leading-relaxed text-xs md:text-sm">
                "{formData.bio_hero || "Belum ada bio singkat yang diatur."}"
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL POPUP EDIT PROFIL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0B1120] border border-slate-800/50 rounded-xl shadow-2xl w-full max-w-3xl relative my-8 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 md:p-6 border-b border-slate-800 shrink-0 bg-[#0B1120] rounded-t-xl">
              <h2 className="text-lg md:text-xl font-bold text-white">
                Ubah Biodata & Kontak
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

            {/* Modal Body / Form */}
            <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar">
              <form
                id="editProfilForm"
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 md:gap-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-1.5 md:mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="nama_lengkap"
                      value={formData.nama_lengkap}
                      onChange={handleChange}
                      required
                      className="w-full p-2.5 md:p-3 bg-[#070b14] border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-1.5 md:mb-2">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="text"
                      name="no_wa"
                      value={formData.no_wa}
                      onChange={handleChange}
                      required
                      className="w-full p-2.5 md:p-3 bg-[#070b14] border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-1.5 md:mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-2.5 md:p-3 bg-[#070b14] border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-1.5 md:mb-2">
                      Link Social Media
                    </label>
                    <input
                      type="text"
                      name="link_socmed"
                      value={formData.link_socmed}
                      onChange={handleChange}
                      className="w-full p-2.5 md:p-3 bg-[#070b14] border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-1.5 md:mb-2">
                    Alamat
                  </label>
                  <input
                    type="text"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 md:p-3 bg-[#070b14] border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-1.5 md:mb-2">
                    Bio / Hero Description
                  </label>
                  <textarea
                    name="bio_hero"
                    rows="3"
                    value={formData.bio_hero}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 md:p-3 bg-[#070b14] border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                  ></textarea>
                </div>

                <div className="p-3 md:p-4 border-2 border-dashed border-slate-700 rounded-xl bg-[#070b14] flex flex-col items-center">
                  <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-2 md:mb-3 text-center">
                    Ubah Foto Profil (Opsional)
                  </label>
                  {previewFoto && (
                    <img
                      src={previewFoto}
                      alt="Preview"
                      className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full mb-2 md:mb-3 border border-slate-600"
                    />
                  )}
                  <input
                    type="file"
                    name="foto_profil"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-center text-slate-400 file:mr-4 file:py-1.5 md:file:py-2 file:px-3 md:file:px-4 file:rounded-md file:border-0 file:text-[10px] md:file:text-sm file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer text-[10px] md:text-sm w-full md:w-auto overflow-hidden"
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
                form="editProfilForm"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition duration-300 shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base order-1 sm:order-2"
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL SUKSES */}
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
              <p className="text-sm text-slate-400 mb-6">
                Biodata profil berhasil diperbarui.
              </p>
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

      {/* POPUP MODAL GAGAL / ERROR */}
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

      {/* Animasi Custom untuk popup modal */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

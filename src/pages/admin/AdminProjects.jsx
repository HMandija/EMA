import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { uploadToCloudinary, uploadMultiple } from "../../utils/imageUtils";
import { Pencil, Trash2, Plus, X, Upload, Loader } from "lucide-react";
import AdminLayout from "./AdminLayout";

const CATEGORIES = ["Residential","Commercial","Technical Design","Data Center / Sustainability","Data Center","Interior Design","Urban Design","Other"];
const STATUSES = ["Built","Under Construction","Unbuilt","Concept"];
const emptyForm = { title:"", slug:"", location:"", category:"Residential", description:"", status:"Built", role:"", imageUrl:"", gallery:[] };

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "projects"), orderBy("createdAt", "desc")));
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleTitleChange = (val) => {
    setForm((f) => ({ ...f, title: val, slug: val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }));
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const url = await uploadToCloudinary(file, "ema-architecture/projects");
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch (err) { alert("Upload error: " + err.message); }
    finally { setUploadingCover(false); }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingGallery(true);
    setGalleryProgress(`0 / ${files.length}`);
    try {
      const urls = await uploadMultiple(files, "ema-architecture/projects", (done, total) => setGalleryProgress(`${done} / ${total}`));
      setForm((f) => ({ ...f, gallery: [...f.gallery, ...urls] }));
    } catch (err) { alert("Upload error: " + err.message); }
    finally { setUploadingGallery(false); setGalleryProgress(""); }
  };

  const removeGalleryImage = (index) => setForm((f) => ({ ...f, gallery: f.gallery.filter((_, i) => i !== index) }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) return alert("Please upload a cover photo.");
    setSaving(true);
    try {
      const data = { ...form, updatedAt: serverTimestamp() };
      if (editingId) { await updateDoc(doc(db, "projects", editingId), data); }
      else { await addDoc(collection(db, "projects"), { ...data, createdAt: serverTimestamp() }); }
      setShowForm(false); setEditingId(null); setForm(emptyForm); fetchProjects();
    } catch (err) { alert("Error: " + err.message); }
    finally { setSaving(false); }
  };

  const startEdit = (project) => {
    setForm({ title: project.title||"", slug: project.slug||"", location: project.location||"", category: project.category||"Residential", description: project.description||"", status: project.status||"Built", role: project.role||"", imageUrl: project.imageUrl||"", gallery: project.gallery||[] });
    setEditingId(project.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await deleteDoc(doc(db, "projects", deleteId)); setDeleteId(null); fetchProjects(); }
    catch (err) { alert("Error: " + err.message); }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-sm uppercase tracking-[0.3em] font-light">Projects</h1>
            <p className="text-zinc-600 text-[9px] uppercase tracking-wider mt-1">{projects.length} total</p>
          </div>
          <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm); }}
            className="flex items-center gap-2 border border-white text-white text-[10px] uppercase tracking-wider px-4 py-2 hover:bg-white hover:text-black transition-all duration-200">
            {showForm ? <X size={12} /> : <Plus size={12} />}
            {showForm ? "Cancel" : "New Project"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSave} className="border border-zinc-700 bg-zinc-950 p-6 rounded mb-8 space-y-5">
            <h2 className="text-white text-[11px] uppercase tracking-widest mb-4">{editingId ? "Edit Project" : "New Project"}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="label-admin">Title *</label>
                <input className="input-admin" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required placeholder="e.g. Ranch House" /></div>
              <div><label className="label-admin">Slug (URL) *</label>
                <input className="input-admin" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required placeholder="ranch-house" /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="label-admin">Location *</label>
                <input className="input-admin" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} required placeholder="e.g. AZ, USA" /></div>
              <div><label className="label-admin">Category *</label>
                <select className="input-admin" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="label-admin">Status</label>
                <select className="input-admin" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select></div>
              <div><label className="label-admin">Role (optional)</label>
                <input className="input-admin" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="e.g. Project Designer, Technical Drawings" /></div>
            </div>

            <div><label className="label-admin">Description *</label>
              <textarea className="input-admin resize-none" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required placeholder="Short project description..." /></div>

            <div>
              <label className="label-admin">Cover Photo * <span className="text-zinc-600 normal-case">(auto-compressed to max 2000px)</span></label>
              <div className="flex items-start gap-4 mt-1">
                <label className="cursor-pointer flex items-center gap-2 border border-zinc-700 text-zinc-400 text-[10px] uppercase tracking-wider px-4 py-2 hover:border-white hover:text-white transition-all duration-200">
                  {uploadingCover ? <Loader size={12} className="animate-spin" /> : <Upload size={12} />}
                  {uploadingCover ? "Compressing & uploading..." : "Upload Cover"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                </label>
                {form.imageUrl && <img src={form.imageUrl} alt="cover" className="w-20 h-14 object-cover border border-zinc-700" />}
              </div>
            </div>

            <div>
              <label className="label-admin">Gallery ({form.gallery.length} photos) <span className="text-zinc-600 normal-case">(all auto-compressed)</span></label>
              <div className="flex items-center gap-4 mt-1 mb-3">
                <label className="cursor-pointer flex items-center gap-2 border border-zinc-700 text-zinc-400 text-[10px] uppercase tracking-wider px-4 py-2 hover:border-white hover:text-white transition-all duration-200">
                  {uploadingGallery ? <Loader size={12} className="animate-spin" /> : <Upload size={12} />}
                  {uploadingGallery ? `Uploading ${galleryProgress}...` : "Upload Gallery Photos"}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                </label>
              </div>
              {form.gallery.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.gallery.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt={`gallery-${i}`} className="w-16 h-12 object-cover border border-zinc-700" />
                      <button type="button" onClick={() => removeGalleryImage(i)}
                        className="absolute -top-1 -right-1 bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={8} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving || uploadingCover || uploadingGallery}
                className="border border-white text-white text-[10px] uppercase tracking-wider px-6 py-2.5 hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-40">
                {saving ? "Saving..." : editingId ? "Save Changes" : "Add Project"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
                className="border border-zinc-700 text-zinc-400 text-[10px] uppercase tracking-wider px-6 py-2.5 hover:border-zinc-400 transition-all duration-200">
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-zinc-600 text-[10px] uppercase tracking-wider py-10 text-center">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="text-zinc-600 text-[10px] uppercase tracking-wider py-10 text-center border border-zinc-800 rounded">No projects yet. Add your first project!</div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center gap-4 border border-zinc-800 bg-zinc-950 p-4 rounded hover:border-zinc-700 transition-colors">
                <div className="w-14 h-10 flex-shrink-0 bg-zinc-800 overflow-hidden rounded">
                  {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[11px] uppercase tracking-wider truncate">{project.title}</p>
                  <p className="text-zinc-600 text-[9px] uppercase tracking-widest mt-0.5">{project.location} · {project.category}</p>
                </div>
                <span className="hidden sm:block text-[8px] uppercase tracking-widest text-zinc-500 border border-zinc-800 px-2 py-1 flex-shrink-0">{project.status}</span>
                <span className="hidden sm:block text-[9px] text-zinc-600 flex-shrink-0">{(project.gallery||[]).length} photos</span>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(project)} className="text-zinc-500 hover:text-white p-1.5 hover:bg-zinc-800 rounded transition-colors"><Pencil size={13} /></button>
                  <button onClick={() => setDeleteId(project.id)} className="text-zinc-500 hover:text-red-400 p-1.5 hover:bg-zinc-800 rounded transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {deleteId && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-zinc-950 border border-zinc-700 p-6 max-w-sm w-full rounded">
              <p className="text-white text-sm mb-2">Delete this project?</p>
              <p className="text-zinc-500 text-[10px] mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={handleDelete} className="flex-1 bg-red-600 text-white text-[10px] uppercase tracking-wider py-2.5 hover:bg-red-700 transition-colors">Yes, delete</button>
                <button onClick={() => setDeleteId(null)} className="flex-1 border border-zinc-700 text-zinc-400 text-[10px] uppercase tracking-wider py-2.5 hover:border-zinc-400 transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;

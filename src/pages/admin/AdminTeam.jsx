import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { uploadToCloudinary } from "../../utils/imageUtils";
import { Pencil, Trash2, Plus, X, Upload, Loader, Save } from "lucide-react";
import AdminLayout from "./AdminLayout";

const emptyForm = { name: "", role: "", bio1: "", bio2: "", bio3: "", imageUrl: "" };

const AdminTeam = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "team"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Sort by name alphabetically; docs without createdAt (legacy seed) still appear
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      setMembers(list);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const url = await uploadToCloudinary(file, "ema-architecture/team");
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch (err) { alert("Upload error: " + err.message); }
    finally { setUploadingPhoto(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, updatedAt: serverTimestamp() };
      if (editingId) {
        await updateDoc(doc(db, "team", editingId), data);
      } else {
        await addDoc(collection(db, "team"), { ...data, createdAt: serverTimestamp() });
      }
      setShowForm(false); setEditingId(null); setForm(emptyForm); fetchMembers();
    } catch (err) { alert("Error: " + err.message); }
    finally { setSaving(false); }
  };

  const startEdit = (member) => {
    setForm({ name: member.name||"", role: member.role||"", bio1: member.bio1||"", bio2: member.bio2||"", bio3: member.bio3||"", imageUrl: member.imageUrl||"" });
    setEditingId(member.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await deleteDoc(doc(db, "team", deleteId)); setDeleteId(null); fetchMembers(); }
    catch (err) { alert("Error: " + err.message); }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-sm uppercase tracking-[0.3em] font-light">Team</h1>
            <p className="text-zinc-600 text-[9px] uppercase tracking-wider mt-1">{members.length} member{members.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm); }}
            className="flex items-center gap-2 border border-white text-white text-[10px] uppercase tracking-wider px-4 py-2 hover:bg-white hover:text-black transition-all duration-200">
            {showForm ? <X size={12} /> : <Plus size={12} />}
            {showForm ? "Cancel" : "Add Member"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSave} className="border border-zinc-700 bg-zinc-950 p-6 rounded mb-8 space-y-5">
            <h2 className="text-white text-[11px] uppercase tracking-widest mb-4">{editingId ? "Edit Member" : "New Member"}</h2>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-32 bg-zinc-800 overflow-hidden rounded mb-3">
                  {form.imageUrl ? <img src={form.imageUrl} alt={form.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-700 text-[9px] uppercase text-center px-2">No photo</div>}
                </div>
                <label className="cursor-pointer flex items-center gap-1.5 border border-zinc-700 text-zinc-500 text-[9px] uppercase tracking-wider px-3 py-1.5 hover:border-white hover:text-white transition-all duration-200">
                  {uploadingPhoto ? <Loader size={10} className="animate-spin" /> : <Upload size={10} />}
                  {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>

              <div className="flex-1 space-y-4">
                <div><label className="label-admin">Full Name *</label>
                  <input className="input-admin" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required placeholder="e.g. Ersid Mandija" /></div>
                <div><label className="label-admin">Title / Role *</label>
                  <input className="input-admin" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} required placeholder="e.g. Founder / Principal Architect" /></div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">Bio Paragraphs</p>
              {["bio1","bio2","bio3"].map((key, i) => (
                <div key={key}>
                  <label className="label-admin">Paragraph {i + 1}</label>
                  <textarea className="input-admin resize-none" rows={3} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} placeholder={`Paragraph ${i + 1}...`} />
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving || uploadingPhoto}
                className="flex items-center gap-2 border border-white text-white text-[10px] uppercase tracking-wider px-6 py-2.5 hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-40">
                {saving ? <Loader size={12} className="animate-spin" /> : <Save size={12} />}
                {saving ? "Saving..." : editingId ? "Save Changes" : "Add Member"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
                className="border border-zinc-700 text-zinc-400 text-[10px] uppercase tracking-wider px-6 py-2.5 hover:border-zinc-400 transition-all duration-200">Cancel</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-zinc-600 text-[10px] uppercase tracking-wider py-10 text-center">Loading...</div>
        ) : members.length === 0 ? (
          <div className="text-zinc-600 text-[10px] uppercase tracking-wider py-10 text-center border border-zinc-800 rounded">No team members yet. Add your first member!</div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-4 border border-zinc-800 bg-zinc-950 p-4 rounded hover:border-zinc-700 transition-colors">
                <div className="w-12 h-16 flex-shrink-0 bg-zinc-800 overflow-hidden rounded">
                  {member.imageUrl && <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[11px] uppercase tracking-wider">{member.name}</p>
                  <p className="text-zinc-500 text-[9px] uppercase tracking-widest mt-0.5">{member.role}</p>
                  {member.bio1 && <p className="text-zinc-700 text-[9px] mt-1 truncate max-w-md">{member.bio1}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(member)} className="text-zinc-500 hover:text-white p-1.5 hover:bg-zinc-800 rounded transition-colors"><Pencil size={13} /></button>
                  <button onClick={() => setDeleteId(member.id)} className="text-zinc-500 hover:text-red-400 p-1.5 hover:bg-zinc-800 rounded transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {deleteId && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-zinc-950 border border-zinc-700 p-6 max-w-sm w-full rounded">
              <p className="text-white text-sm mb-2">Remove this team member?</p>
              <p className="text-zinc-500 text-[10px] mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={handleDelete} className="flex-1 bg-red-600 text-white text-[10px] uppercase tracking-wider py-2.5 hover:bg-red-700 transition-colors">Yes, remove</button>
                <button onClick={() => setDeleteId(null)} className="flex-1 border border-zinc-700 text-zinc-400 text-[10px] uppercase tracking-wider py-2.5 hover:border-zinc-400 transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTeam;

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { Save, Loader } from "lucide-react";
import AdminLayout from "./AdminLayout";

const emptyForm = { city: "", country: "", phone: "", email: "", linkedin: "", instagram: "", facebook: "" };

const AdminContactInfo = () => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "contact"));
        if (snap.exists()) setForm({ ...emptyForm, ...snap.data() });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "contact"), { ...form, updatedAt: serverTimestamp() });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { alert("Error: " + err.message); }
    finally { setSaving(false); }
  };

  if (loading) return <AdminLayout><div className="text-zinc-600 text-[10px] uppercase tracking-wider py-10 text-center">Loading...</div></AdminLayout>;

  const Field = ({ label, id, type = "text", placeholder }) => (
    <div>
      <label className="label-admin">{label}</label>
      <input className="input-admin" type={type} value={form[id]} onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))} placeholder={placeholder} />
    </div>
  );

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-white text-sm uppercase tracking-[0.3em] font-light">Contact Info</h1>
          <p className="text-zinc-600 text-[9px] uppercase tracking-wider mt-1">Edit the contact page details</p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="border border-zinc-800 bg-zinc-950 p-6 rounded space-y-4">
            <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 mb-2">Location</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="City" id="city" placeholder="e.g. Shkodër" />
              <Field label="Country / Postcode" id="country" placeholder="e.g. Albania, AL 4001" />
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950 p-6 rounded space-y-4">
            <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 mb-2">Contact Details</p>
            <Field label="Phone" id="phone" placeholder="+355 69 ..." />
            <Field label="Email" id="email" type="email" placeholder="your@email.com" />
          </div>

          <div className="border border-zinc-800 bg-zinc-950 p-6 rounded space-y-4">
            <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 mb-2">Social Links</p>
            <Field label="LinkedIn URL" id="linkedin" placeholder="https://linkedin.com/in/..." />
            <Field label="Instagram URL (optional)" id="instagram" placeholder="https://instagram.com/..." />
            <Field label="Facebook URL (optional)" id="facebook" placeholder="https://facebook.com/..." />
          </div>

          <button type="submit" disabled={saving}
            className="flex items-center gap-2 border border-white text-white text-[10px] uppercase tracking-wider px-6 py-2.5 hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-40">
            {saving ? <Loader size={12} className="animate-spin" /> : <Save size={12} />}
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminContactInfo;

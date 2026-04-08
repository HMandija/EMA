import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { Mail, MailOpen, Trash2, RefreshCw } from "lucide-react";
import AdminLayout from "./AdminLayout";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc")));
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, []);

  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "messages", id), { read: true });
      setMessages((msgs) => msgs.map((m) => (m.id === id ? { ...m, read: true } : m)));
    } catch (err) { console.error(err); }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
    const msg = messages.find((m) => m.id === id);
    if (msg && !msg.read) markAsRead(id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await deleteDoc(doc(db, "messages", deleteId)); setDeleteId(null); setMessages((msgs) => msgs.filter((m) => m.id !== deleteId)); }
    catch (err) { alert("Error: " + err.message); }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  const formatDate = (ts) => {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-sm uppercase tracking-[0.3em] font-light">Messages</h1>
            <p className="text-zinc-600 text-[9px] uppercase tracking-wider mt-1">
              {messages.length} total · {unreadCount > 0 ? <span className="text-red-400">{unreadCount} unread</span> : "all read"}
            </p>
          </div>
          <button onClick={fetchMessages} className="flex items-center gap-2 text-zinc-500 hover:text-white text-[10px] uppercase tracking-wider transition-colors">
            <RefreshCw size={12} />Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-zinc-600 text-[10px] uppercase tracking-wider py-10 text-center">Loading...</div>
        ) : messages.length === 0 ? (
          <div className="text-zinc-600 text-[10px] uppercase tracking-wider py-10 text-center border border-zinc-800 rounded">No messages yet.</div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className={`border rounded transition-all duration-200 ${!msg.read ? "border-zinc-600 bg-zinc-950" : "border-zinc-800 bg-zinc-950"}`}>
                <button onClick={() => toggleExpand(msg.id)} className="w-full flex items-center gap-4 p-4 text-left">
                  <div className="flex-shrink-0">
                    {msg.read ? <MailOpen size={14} className="text-zinc-600" /> : <Mail size={14} className="text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <p className={`text-[11px] uppercase tracking-wider truncate ${!msg.read ? "text-white" : "text-zinc-400"}`}>{msg.name}</p>
                      {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />}
                    </div>
                    <p className="text-zinc-600 text-[9px] mt-0.5 truncate">{msg.email}</p>
                  </div>
                  <span className="text-zinc-700 text-[9px] flex-shrink-0 hidden sm:block">{formatDate(msg.createdAt)}</span>
                </button>

                {expandedId === msg.id && (
                  <div className="px-4 pb-4 border-t border-zinc-800">
                    <div className="pt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-[9px]">
                        <div><span className="text-zinc-600 uppercase tracking-wider">Name: </span><span className="text-zinc-300">{msg.name}</span></div>
                        <div><span className="text-zinc-600 uppercase tracking-wider">Email: </span><a href={`mailto:${msg.email}`} className="text-zinc-300 hover:text-white underline">{msg.email}</a></div>
                        {msg.phone && <div><span className="text-zinc-600 uppercase tracking-wider">Phone: </span><span className="text-zinc-300">{msg.phone}</span></div>}
                        <div><span className="text-zinc-600 uppercase tracking-wider">Date: </span><span className="text-zinc-300">{formatDate(msg.createdAt)}</span></div>
                      </div>
                      <div className="bg-zinc-900 p-4 rounded">
                        <p className="text-zinc-600 text-[9px] uppercase tracking-wider mb-2">Message:</p>
                        <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      <div className="flex gap-3">
                        <a href={`mailto:${msg.email}`} className="text-[10px] uppercase tracking-wider border border-zinc-700 text-zinc-400 px-4 py-2 hover:border-white hover:text-white transition-all duration-200">↩ Reply</a>
                        <button onClick={() => setDeleteId(msg.id)} className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-600 hover:text-red-400 px-4 py-2 transition-colors">
                          <Trash2 size={10} />Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-950 border border-zinc-700 p-6 max-w-sm w-full rounded">
            <p className="text-white text-sm mb-2">Delete this message?</p>
            <p className="text-zinc-500 text-[10px] mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 bg-red-600 text-white text-[10px] uppercase tracking-wider py-2.5 hover:bg-red-700 transition-colors">Yes, delete</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-zinc-700 text-zinc-400 text-[10px] uppercase tracking-wider py-2.5 hover:border-zinc-400 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMessages;

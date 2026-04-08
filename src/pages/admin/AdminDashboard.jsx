import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { FolderOpen, Users, MessageSquare, ExternalLink, Database } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { seedProjects, seedTeam } from "../../utils/seedFirestore";

const BASE = import.meta.env.VITE_ADMIN_PATH || "/ema-admin";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    team: 0,
    messages: 0,
    unread: 0,
  });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [projectsSnap, teamSnap, messagesSnap, unreadSnap] = await Promise.all([
        getDocs(collection(db, "projects")),
        getDocs(collection(db, "team")),
        getDocs(collection(db, "messages")),
        getDocs(query(collection(db, "messages"), where("read", "==", false))),
      ]);
      setStats({
        projects: projectsSnap.size,
        team: teamSnap.size,
        messages: messagesSnap.size,
        unread: unreadSnap.size,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Projects",
      value: stats.projects,
      icon: FolderOpen,
      link: `${BASE}/projects`,
      desc: "View & manage",
    },
    {
      label: "Team",
      value: stats.team,
      icon: Users,
      link: `${BASE}/team`,
      desc: "Manage members",
    },
    {
      label: "Messages",
      value: stats.messages,
      icon: MessageSquare,
      link: `${BASE}/messages`,
      desc: stats.unread > 0 ? `${stats.unread} unread` : "All caught up",
      highlight: stats.unread > 0,
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-white text-sm uppercase tracking-[0.3em] font-light">
            Dashboard
          </h1>
          <p className="text-zinc-600 text-[10px] uppercase tracking-wider mt-1">
            Welcome, Admin
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {cards.map(({ label, value, icon: Icon, link, desc, highlight }) => (
            <Link
              key={label}
              to={link}
              className="group border border-zinc-800 hover:border-zinc-600 bg-zinc-950 p-6 rounded transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
                {highlight && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </div>
              <p className={`text-2xl font-light mb-1 ${loading ? "text-zinc-700" : "text-white"}`}>
                {loading ? "—" : value}
              </p>
              <p className="text-[9px] uppercase tracking-widest text-zinc-500">
                {label}
              </p>
              <p className={`text-[9px] mt-1 ${highlight ? "text-red-400" : "text-zinc-700"}`}>
                {desc}
              </p>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div className="border border-zinc-800 bg-zinc-950 p-6 rounded">
          <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 mb-4">
            Quick Actions
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to={`${BASE}/projects?new=1`}
              className="text-[10px] uppercase tracking-wider border border-zinc-700 text-zinc-300 px-4 py-2 hover:border-white hover:text-white transition-all duration-200"
            >
              + New Project
            </Link>
            <Link
              to={`${BASE}/messages`}
              className="text-[10px] uppercase tracking-wider border border-zinc-700 text-zinc-300 px-4 py-2 hover:border-white hover:text-white transition-all duration-200"
            >
              View Messages
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] uppercase tracking-wider border border-zinc-700 text-zinc-300 px-4 py-2 hover:border-white hover:text-white transition-all duration-200"
            >
              <ExternalLink size={10} />
              View Site
            </a>
          </div>
        </div>

        {/* First-time data seed — only shown when no projects exist */}
        {stats.projects === 0 && !loading && (
          <div className="mt-6 border border-yellow-800/40 bg-yellow-900/10 p-6 rounded">
            <p className="text-yellow-500/80 text-[9px] uppercase tracking-[0.3em] mb-3">
              ⚡ First time? Import your data
            </p>
            <p className="text-zinc-500 text-[10px] mb-4">
              Click the buttons below to transfer projects and team data from static files into Firestore.
              After that, upload photos from the Admin Panel.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                disabled={seeding}
                onClick={async () => {
                  setSeeding(true);
                  const r = await seedProjects();
                  setSeedMsg(r.message);
                  setSeeding(false);
                  if (r.success) fetchStats();
                }}
                className="flex items-center gap-2 border border-yellow-700 text-yellow-500 text-[10px] uppercase tracking-wider px-4 py-2 hover:bg-yellow-900/30 transition-all duration-200 disabled:opacity-40"
              >
                <Database size={11} />
                {seeding ? "Importing..." : "Import Projects"}
              </button>
              <button
                disabled={seeding}
                onClick={async () => {
                  setSeeding(true);
                  const r = await seedTeam();
                  setSeedMsg(r.message);
                  setSeeding(false);
                  if (r.success) fetchStats();
                }}
                className="flex items-center gap-2 border border-yellow-700 text-yellow-500 text-[10px] uppercase tracking-wider px-4 py-2 hover:bg-yellow-900/30 transition-all duration-200 disabled:opacity-40"
              >
                <Database size={11} />
                {seeding ? "Importing..." : "Import Team"}
              </button>
            </div>
            {seedMsg && (
              <p className="text-zinc-400 text-[10px] mt-3">{seedMsg}</p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

import { useState, useEffect } from "react";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase";
import AdminLayout from "./AdminLayout";

export default function Analytics() {
  const [visits, setVisits] = useState([]);
  const [stats, setStats] = useState({
    totalVisits: 0,
    uniqueCountries: 0,
    uniqueIPs: 0,
    todayVisits: 0,
    thisWeekVisits: 0,
    topPages: [],
    topCountries: {},
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "analytics"),
          orderBy("timestamp", "desc"),
          limit(1000),
        );

        const snapshot = await getDocs(q);
        const allData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(),
          };
        });

        setVisits(allData);

        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const todayData = allData.filter((v) => v.date >= today);
        const weekData = allData.filter((v) => v.date >= weekAgo);

        const countryMap = {};
        allData.forEach((v) => {
          countryMap[v.country] = (countryMap[v.country] || 0) + 1;
        });

        setStats({
          totalVisits: allData.length,
          uniqueCountries: new Set(allData.map((v) => v.country)).size,
          uniqueIPs: new Set(allData.map((v) => v.ip)).size,
          todayVisits: todayData.length,
          thisWeekVisits: weekData.length,
          topPages: Object.entries(
            allData.reduce((acc, v) => {
              acc[v.page] = (acc[v.page] || 0) + 1;
              return acc;
            }, {}),
          )
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5),
          topCountries: Object.entries(countryMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10),
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const getFilteredVisits = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    switch (filter) {
      case "today":
        return visits.filter((v) => v.date >= today);
      case "week":
        return visits.filter((v) => v.date >= weekAgo);
      default:
        return visits;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 text-center text-zinc-400">
          Loading analytics...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-white text-sm uppercase tracking-[0.3em] font-light">
            Analytics
          </h1>
          <p className="text-zinc-600 text-[10px] uppercase tracking-wider mt-1">
            Website Traffic
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
          <div className="border border-zinc-800 bg-zinc-950 p-4 rounded">
            <p className="text-zinc-500 text-[9px] uppercase tracking-widest">
              Total Visits
            </p>
            <p className="text-2xl font-light text-white mt-2">
              {stats.totalVisits}
            </p>
          </div>
          <div className="border border-zinc-800 bg-zinc-950 p-4 rounded">
            <p className="text-zinc-500 text-[9px] uppercase tracking-widest">
              Today
            </p>
            <p className="text-2xl font-light text-white mt-2">
              {stats.todayVisits}
            </p>
          </div>
          <div className="border border-zinc-800 bg-zinc-950 p-4 rounded">
            <p className="text-zinc-500 text-[9px] uppercase tracking-widest">
              This Week
            </p>
            <p className="text-2xl font-light text-white mt-2">
              {stats.thisWeekVisits}
            </p>
          </div>
          <div className="border border-zinc-800 bg-zinc-950 p-4 rounded">
            <p className="text-zinc-500 text-[9px] uppercase tracking-widest">
              Countries
            </p>
            <p className="text-2xl font-light text-white mt-2">
              {stats.uniqueCountries}
            </p>
          </div>
          <div className="border border-zinc-800 bg-zinc-950 p-4 rounded">
            <p className="text-zinc-500 text-[9px] uppercase tracking-widest">
              Unique IPs
            </p>
            <p className="text-2xl font-light text-white mt-2">
              {stats.uniqueIPs}
            </p>
          </div>
        </div>

        {/* Top Pages & Countries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border border-zinc-800 bg-zinc-950 p-6 rounded">
            <p className="text-white text-sm uppercase tracking-[0.2em] font-light mb-4">
              Top Pages
            </p>
            <div className="space-y-2">
              {stats.topPages.length > 0 ? (
                stats.topPages.map(([page, count]) => (
                  <div key={page} className="flex justify-between text-[10px]">
                    <span className="text-zinc-400">{page || "/"}</span>
                    <span className="text-white font-light">{count} views</span>
                  </div>
                ))
              ) : (
                <p className="text-zinc-600 text-[9px]">No data yet</p>
              )}
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950 p-6 rounded">
            <p className="text-white text-sm uppercase tracking-[0.2em] font-light mb-4">
              Top Countries
            </p>
            <div className="space-y-2">
              {Object.entries(stats.topCountries).length > 0 ? (
                Object.entries(stats.topCountries).map(([country, count]) => (
                  <div
                    key={country}
                    className="flex justify-between text-[10px]"
                  >
                    <span className="text-zinc-400">{country}</span>
                    <span className="text-white font-light">
                      {count} visits
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-zinc-600 text-[9px]">No data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`text-[9px] uppercase tracking-wider px-3 py-2 border transition-all ${
              filter === "all"
                ? "border-white text-white bg-white/10"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setFilter("week")}
            className={`text-[9px] uppercase tracking-wider px-3 py-2 border transition-all ${
              filter === "week"
                ? "border-white text-white bg-white/10"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setFilter("today")}
            className={`text-[9px] uppercase tracking-wider px-3 py-2 border transition-all ${
              filter === "today"
                ? "border-white text-white bg-white/10"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            Today
          </button>
        </div>

        {/* Visits Table */}
        <div className="border border-zinc-800 bg-zinc-950 rounded overflow-x-auto">
          <table className="w-full text-[9px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left p-4 text-zinc-500 uppercase tracking-widest font-light">
                  Time
                </th>
                <th className="text-left p-4 text-zinc-500 uppercase tracking-widest font-light">
                  Page
                </th>
                <th className="text-left p-4 text-zinc-500 uppercase tracking-widest font-light">
                  Country
                </th>
                <th className="text-left p-4 text-zinc-500 uppercase tracking-widest font-light">
                  City
                </th>
                <th className="text-left p-4 text-zinc-500 uppercase tracking-widest font-light">
                  IP
                </th>
                <th className="text-left p-4 text-zinc-500 uppercase tracking-widest font-light">
                  Device
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {getFilteredVisits().map((visit) => (
                <tr
                  key={visit.id}
                  className="hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="p-4 text-zinc-400 whitespace-nowrap">
                    {visit.date.toLocaleString("sq-AL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-4 text-zinc-300">{visit.page || "/"}</td>
                  <td className="p-4 text-white">
                    {visit.country || "Unknown"}
                  </td>
                  <td className="p-4 text-zinc-400">{visit.city || "—"}</td>
                  <td className="p-4 text-zinc-500 font-mono text-[8px]">
                    {visit.ip.slice(0, 12)}...
                  </td>
                  <td className="p-4 text-zinc-500">{visit.screen || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {getFilteredVisits().length === 0 && (
            <div className="text-center text-zinc-500 py-8 text-[9px]">
              No visits in this period
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const snap = await getDocs(collection(db, "team"));
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Sort by name so order is consistent
        list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        setMembers(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="pt-40 pb-32 px-4 md:px-12 lg:px-16 min-h-screen dark:bg-black">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 animate-pulse">
          <div className="w-full lg:w-1/3">
            <div className="aspect-[3/4] bg-gray-100 dark:bg-zinc-900" />
          </div>
          <div className="w-full lg:w-2/3 space-y-4 pt-4">
            <div className="h-4 bg-gray-100 dark:bg-zinc-900 w-1/3" />
            <div className="h-3 bg-gray-100 dark:bg-zinc-900 w-1/4" />
            <div className="h-20 bg-gray-100 dark:bg-zinc-900 mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="pt-40 pb-32 px-4 min-h-screen dark:bg-black flex items-center justify-center">
        <p className="text-gray-400 text-[10px] uppercase tracking-widest">
          No team data available.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-32 px-4 md:px-12 lg:px-16 min-h-screen transition-colors duration-500 dark:bg-black">
      <div className="max-w-7xl mx-auto space-y-32">
        {members.map((member, index) => (
          <motion.div
            key={member.id}
            className="flex flex-col lg:flex-row gap-16 items-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.15 }}
          >
            {/* Photo column */}
            <div className="w-full lg:w-1/3">
              <div className="aspect-[3/4] overflow-hidden bg-gray-100 dark:project-card-custom">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-zinc-800" />
                )}
              </div>
              <h2 className="mt-6 text-lg font-semibold uppercase tracking-widest dark:gold-shimmer">
                {member.name}
              </h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">
                {member.role}
              </p>
            </div>

            {/* Bio column */}
            <div className="w-full lg:w-2/3 space-y-8">
              <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
                {[member.bio1, member.bio2, member.bio3]
                  .filter(Boolean)
                  .map((para, i) => (
                    <p
                      key={i}
                      className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide"
                    >
                      {para}
                    </p>
                  ))}
              </div>
              <div className="h-[1px] w-20 bg-gray-200 dark:bg-yellow-700/30" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Team;

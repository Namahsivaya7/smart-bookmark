"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";
import BookmarkForm from "../components/BookmarkForm";
import BookmarkList from "../components/BookmarkList";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stats, setStats] = useState({
    total: 0,
    recent: 0,
    categories: 0
  });
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const fetchBookmarksRef = useRef<( () => Promise<void> ) | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
      }
    };

    checkUser();

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [router]);

  const updateStats = (list: { created_at?: string; category?: string }[]) => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    setStats({
      total: list.length,
      recent: list.filter(b => new Date(b.created_at || 0) > weekAgo).length,
      categories: new Set(list.map(b => b.category || "Uncategorized")).size
    });
  };

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    const list = data || [];
    setBookmarks(list);
    updateStats(list);
    setLoading(false);
  };
  fetchBookmarksRef.current = fetchBookmarks;

  useEffect(() => {
    let channel: any;
  
    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
  
      fetchBookmarks();
  
      channel = supabase
        .channel("realtime-bookmarks")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
          },
          (payload) => {
            console.log("Realtime event:", payload);
            fetchBookmarks();
          }
        )
        .subscribe();
    };
  
    setupRealtime();
  
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden"
    >
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
        animate={{
          x: mousePosition.x * 50,
          y: mousePosition.y * 50,
          scale: [1, 1.2, 1],
        }}
        transition={{
          scale: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        animate={{
          x: mousePosition.x * -50,
          y: mousePosition.y * -50,
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          scale: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, -30],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center pt-16 pb-8"
        >
          <motion.h1 
            className="text-5xl font-bold text-white mb-4"
            animate={{
              textShadow: [
                "0 0 20px rgba(168, 85, 247, 0.3)",
                "0 0 40px rgba(168, 85, 247, 0.5)",
                "0 0 20px rgba(168, 85, 247, 0.3)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Your Bookmark Universe
          </motion.h1>
         
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="max-w-6xl mx-auto px-4 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {[
              { label: "Total Bookmarks", value: stats.total, icon: "🔖", color: "from-purple-500 to-purple-600" },
              { label: "Added This Week", value: stats.recent, icon: "✨", color: "from-blue-500 to-blue-600" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200/60 text-sm">{stat.label}</p>
                    <motion.p 
                      className="text-3xl font-bold text-white mt-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.6 + index * 0.1 }}
                    >
                      {stat.value}
                    </motion.p>
                  </div>
                  <motion.div 
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl`}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {stat.icon}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="max-w-4xl mx-auto px-4 pb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 mb-6"
            whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
          >
            <BookmarkForm refresh={fetchBookmarks} />
          </motion.div>

          <motion.div
            className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Your Collection</h2>
              <motion.div 
                className="flex gap-2"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="w-2 h-2 bg-purple-500 rounded-full" />
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="w-2 h-2 bg-violet-500 rounded-full" />
              </motion.div>
            </div>
            <AnimatePresence mode="wait">
              <BookmarkList 
                // key={bookmarks.length} 
                bookmarks={bookmarks} 
                refresh={fetchBookmarks} 
              />
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </motion.div>
  );
}
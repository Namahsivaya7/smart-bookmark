// "use client";

// import { supabase } from "../lib/supabaseClient";

// export default function BookmarkList({ bookmarks, refresh }: any) {
//   const deleteBookmark = async (id: string) => {
//     await supabase.from("bookmarks").delete().eq("id", id);
//     refresh();
//   };

//   return (
//     <div className="bg-white p-4 rounded shadow">
//       {bookmarks.length === 0 && (
//         <p className="text-gray-500">No bookmarks yet.</p>
//       )}

//       {bookmarks.map((b: any) => (
//         <div
//           key={b.id}
//           className="flex justify-between items-center border-b py-2"
//         >
//           <div>
//             <p className="font-semibold">{b.title}</p>
//             <a
//               href={b.url}
//               target="_blank"
//               className="text-blue-600 text-sm"
//             >
//               {b.url}
//             </a>
//           </div>

//           <button
//             onClick={() => deleteBookmark(b.id)}
//             className="bg-red-500 text-white px-2 py-1 rounded"
//           >
//             Delete
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }







"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion, AnimatePresence, Reorder } from "framer-motion";

export default function BookmarkList({ bookmarks, refresh }: any) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBookmarks, setFilteredBookmarks] = useState(bookmarks);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");

  useEffect(() => {
    let filtered = [...bookmarks];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.url.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
    
    setFilteredBookmarks(filtered);
  }, [bookmarks, searchTerm, sortBy]);

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    setDeleteConfirmId(null);
    refresh();
  };

  const extractDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    } catch {
      return 'unknown';
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

  if (bookmarks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-12"
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-500/20 rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
              }}
              animate={{
                y: [null, "-30%"],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative text-center"
        >
          <div className="text-7xl mb-6">✨</div>
          <h3 className="text-2xl font-bold text-white mb-3">Your universe awaits</h3>
          <p className="text-purple-200/40 text-lg mb-8">Start adding bookmarks to explore the cosmos</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold"
          >
            Add Your First Bookmark
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Controls Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
      >
        <div className="relative flex-1 w-full">
          <motion.input
            type="text"
            placeholder="Search your universe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
            whileFocus={{ scale: 1.01 }}
          />
          <motion.div
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            animate={{ rotate: searchTerm ? 360 : 0 }}
            transition={{ duration: 0.3 }}
          >
            🔍
          </motion.div>
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                ✕
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2">
    
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white"
          >
            {viewMode === "list" ? "⊞" : "≡"}
          </motion.button>
        </div>
      </motion.div>

      {/* Bookmarks Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-sm text-white/40"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-purple-500 rounded-full"
        />
        <span>{filteredBookmarks.length} of {bookmarks.length} bookmarks</span>
      </motion.div>

      {/* Bookmarks List/Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 gap-4" 
            : "space-y-3"
          }
        >
          <AnimatePresence>
            {filteredBookmarks.map((bookmark: any, index: number) => (
              <motion.div
                key={bookmark.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{ 
                  delay: index * 0.03,
                  layout: { type: "spring", stiffness: 300, damping: 30 }
                }}
                onHoverStart={() => setHoveredId(bookmark.id)}
                onHoverEnd={() => setHoveredId(null)}
                onClick={() => setSelectedId(selectedId === bookmark.id ? null : bookmark.id)}
                className={`relative group cursor-pointer ${
                  viewMode === "grid" ? "" : "w-full"
                }`}
              >
                <motion.div
                  className={`relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border-2 transition-all ${
                    selectedId === bookmark.id 
                      ? "border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.5)]" 
                      : "border-white/10 hover:border-purple-500/50"
                  }`}
                  animate={{
                    scale: hoveredId === bookmark.id ? 1.02 : 1,
                    y: hoveredId === bookmark.id ? -2 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Background gradient animation */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/0 to-blue-600/0"
                    animate={{
                      background: hoveredId === bookmark.id
                        ? "linear-gradient(120deg, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0) 50%, rgba(59,130,246,0.1) 100%)"
                        : "linear-gradient(120deg, rgba(168,85,247,0) 0%, rgba(168,85,247,0) 50%, rgba(59,130,246,0) 100%)",
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Content */}
                  <div className="relative p-4 z-10">
                    <div className="flex items-start gap-4">
                      {/* Favicon/Icon */}
                      <motion.div
                        animate={{
                          rotate: hoveredId === bookmark.id ? [0, -10, 10, -10, 0] : 0,
                        }}
                        transition={{ duration: 0.5 }}
                        className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center overflow-hidden border border-white/10"
                      >
                        {getFaviconUrl(bookmark.url) ? (
                          <img 
                            src={getFaviconUrl(bookmark.url)!} 
                            alt=""
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <span className="text-2xl">🔖</span>
                        )}
                      </motion.div>

                      {/* Bookmark Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <motion.h3 
                              className="text-white font-semibold text-lg truncate max-w-[200px]"
                              animate={{
                                color: hoveredId === bookmark.id ? "#fff" : "rgba(255,255,255,0.9)",
                              }}
                            >
                              {bookmark.title}
                            </motion.h3>
                            
                            {/* Domain tag */}
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-2 mt-1"
                            >
                              <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                                {extractDomain(bookmark.url)}
                              </span>
                              
                              {/* Date */}
                              <span className="text-xs text-white/30">
                                {new Date(bookmark.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </motion.div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <motion.a
                              href={bookmark.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-white/40 hover:text-white/80 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </motion.a>

                            <AnimatePresence mode="wait">
                              {deleteConfirmId === bookmark.id ? (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="flex gap-1"
                                >
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteBookmark(bookmark.id);
                                    }}
                                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                                  >
                                    ✓
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteConfirmId(null);
                                    }}
                                    className="p-2 bg-white/10 text-white/40 rounded-lg hover:bg-white/20"
                                  >
                                    ✕
                                  </motion.button>
                                </motion.div>
                              ) : (
                                <motion.button
                                  whileHover={{ scale: 1.1, color: "#ef4444" }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteConfirmId(bookmark.id);
                                  }}
                                  className="p-2 text-white/40 hover:text-red-400 transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </motion.button>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* URL Preview (expanded when selected) */}
                        <AnimatePresence>
                          {selectedId === bookmark.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-white/10"
                            >
                              <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-purple-300/60 hover:text-purple-300 break-all block"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {bookmark.url}
                              </a>
                              
                              {/* Preview metadata (could be enhanced with actual metadata) */}
                              <div className="mt-2 flex items-center gap-2 text-xs text-white/30">
                                <span>Added {new Date(bookmark.created_at).toLocaleString()}</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                    animate={{
                      background: hoveredId === bookmark.id
                        ? "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, transparent 50%)"
                        : "none",
                      x: hoveredId === bookmark.id ? ["-100%", "200%"] : "-100%",
                    }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

     
      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setDeleteConfirmId(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-purple-900 p-8 rounded-3xl border border-white/20 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-4"
                >
                  ⚠️
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Delete Bookmark?</h3>
                <p className="text-white/60 mb-6">This action cannot be undone</p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => deleteBookmark(deleteConfirmId)}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
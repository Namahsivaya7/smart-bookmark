// "use client";

// import { useState } from "react";
// import { supabase } from "../lib/supabaseClient";

// export default function BookmarkForm({ refresh }: any) {
//   const [title, setTitle] = useState("");
//   const [url, setUrl] = useState("");

//   const addBookmark = async () => {
//     if (!title || !url) return;

//     const user = (await supabase.auth.getUser()).data.user;

//     await supabase.from("bookmarks").insert([
//       {
//         title,
//         url,
//         user_id: user?.id,
//       },
//     ]);

//     setTitle("");
//     setUrl("");
//     refresh();
//   };

//   return (
//     <div className="bg-white p-4 rounded shadow mb-4">
//       <input
//         className="border p-2 w-full mb-2"
//         placeholder="Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />
//       <input
//         className="border p-2 w-full mb-2"
//         placeholder="URL"
//         value={url}
//         onChange={(e) => setUrl(e.target.value)}
//       />
//       <button
//         onClick={addBookmark}
//         className="bg-green-600 text-white px-4 py-2 rounded"
//       >
//         Add Bookmark
//       </button>
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function BookmarkForm({ refresh }: any) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [charCount, setCharCount] = useState({ title: 0, url: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setCharCount({ title: title.length, url: url.length });
  }, [title, url]);

  const addBookmark = async () => {
    if (!title || !url) return;

    const user = (await supabase.auth.getUser()).data.user;

    await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user?.id,
      },
    ]);

    setTitle("");
    setUrl("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    refresh();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovered(false)}
      onMouseEnter={() => setIsHovered(true)}
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              <span className="font-medium">✨ Bookmark added to your universe!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Form Container */}
      <motion.div
        className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-2xl"
        animate={{
          boxShadow: isHovered
            ? "0 30px 60px -15px rgba(168, 85, 247, 0.5), 0 0 0 1px rgba(168, 85, 247, 0.3)"
            : "0 20px 40px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated Gradient Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/0 to-blue-600/0"
          animate={{
            background: isHovered
              ? "linear-gradient(120deg, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.05) 50%, rgba(59, 130, 246, 0.15) 100%)"
              : "linear-gradient(120deg, rgba(168, 85, 247, 0) 0%, rgba(168, 85, 247, 0) 50%, rgba(59, 130, 246, 0) 100%)",
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
              }}
              animate={{
                y: [null, "-30%"],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2 + i,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.5,
            y: mousePosition.y * 0.5,
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
          className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * -0.5,
            y: mousePosition.y * -0.5,
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

        {/* Form Content */}
        <div className="relative p-8 z-10">
          {/* Form Header */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-3 mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl"
            >
              ✦
            </motion.div>
            <div>
              <h3 className="text-white font-semibold text-lg">Add to Your Universe</h3>
              <p className="text-white/40 text-sm">Expand your collection</p>
            </div>
          </motion.div>

          {/* Title Input */}
          <div className="mb-4">
            <motion.div
              className="relative"
              animate={{
                scale: isFocused === "title" ? 1.02 : 1,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                className="w-full px-6 py-4 bg-white/5 border-2 rounded-2xl text-white placeholder-white/30 focus:outline-none transition-all pr-16"
                placeholder="Enter bookmark title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setIsFocused("title")}
                onBlur={() => setIsFocused(null)}
                style={{
                  borderColor: isFocused === "title" 
                    ? "rgba(168, 85, 247, 0.5)" 
                    : "rgba(255, 255, 255, 0.1)",
                }}
              />
              
              {/* Character Counter */}
              <motion.div
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono"
                animate={{
                  color: charCount.title > 50 ? "#ef4444" : "rgba(255,255,255,0.3)",
                }}
              >
                {charCount.title}/50
              </motion.div>

              {/* Input Icon */}
              <motion.div
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-xl"
                animate={{
                  opacity: isFocused === "title" ? 1 : 0.3,
                  x: isFocused === "title" ? -5 : 0,
                }}
              >
                📌
              </motion.div>
            </motion.div>
          </div>

          {/* URL Input */}
          <div className="mb-6">
            <motion.div
              className="relative"
              animate={{
                scale: isFocused === "url" ? 1.02 : 1,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                className="w-full px-6 py-4 bg-white/5 border-2 rounded-2xl text-white placeholder-white/30 focus:outline-none transition-all pl-12 pr-16"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setIsFocused("url")}
                onBlur={() => setIsFocused(null)}
                style={{
                  borderColor: isFocused === "url" 
                    ? "rgba(59, 130, 246, 0.5)" 
                    : "rgba(255, 255, 255, 0.1)",
                }}
              />
              
              {/* URL Icon */}
              <motion.div
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                animate={{
                  opacity: isFocused === "url" ? 1 : 0.3,
                  rotate: isFocused === "url" ? 360 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                🔗
              </motion.div>

              {/* URL Preview */}
              <AnimatePresence>
                {url && !isFocused && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30 max-w-[150px] truncate"
                  >
                    {url.length > 25 ? url.substring(0, 22) + "..." : url}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={addBookmark}
              disabled={!title || !url}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl"
                animate={{
                  opacity: !title || !url ? 0.5 : 1,
                }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 block px-6 py-4 text-white font-semibold">
                Add Bookmark
              </span>
            </motion.button>

           
          </div>

         
        </div>

        {/* Bottom Accent Line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </motion.div>
  );
}
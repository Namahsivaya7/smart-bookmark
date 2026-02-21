const STORAGE_KEY = "smart-bookmark-sync";
const BROADCAST_CHANNEL_NAME = "smart-bookmark-sync";

/** Notify other tabs that bookmarks changed so they refetch. */
export function broadcastBookmarksChange(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  } catch {
    // ignore
  }
  try {
    const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    bc.postMessage("refresh");
    bc.close();
  } catch {
    // ignore
  }
}

/** Subscribe to bookmarks-change events from other tabs. Returns unsubscribe. */
export function onBookmarksChangeFromOtherTabs(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const run = () => callback();

  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue != null) run();
  };
  window.addEventListener("storage", onStorage);

  let bc: BroadcastChannel | null = null;
  try {
    bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    bc.onmessage = () => run();
  } catch {
    // ignore
  }

  return () => {
    window.removeEventListener("storage", onStorage);
    if (bc) bc.close();
  };
}

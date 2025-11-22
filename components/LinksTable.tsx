"use client";

import { useEffect, useState } from "react";

interface UrlRecord {
  id: string;
  shortId: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
  lastClickedAt: string | null;
}

export function LinksTable() {
  const [links, setLinks] = useState<UrlRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch links from backend
  const loadLinks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/links");
      const data = await res.json();

      if (res.ok) {
        setLinks(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load links:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    try{
      const res = await fetch(`/api/links/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLinks((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-600 dark:text-gray-400 py-10">
        Loading your links...
      </p>
    );

  if (links.length === 0)
    return (
      <p className="text-center text-gray-600 dark:text-gray-400 py-10">
        You haven’t created any links yet.
      </p>
    );

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <table className="w-full border border-gray-300 dark:border-neutral-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 dark:bg-neutral-800 border-b border-gray-300 dark:border-neutral-700">
          <tr className="text-left text-sm text-gray-600 dark:text-gray-300">
            <th className="p-3">Short Link</th>
            <th className="p-3">Original URL</th>
            <th className="p-3">Clicks</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700 text-sm">
          {links.map((link) => {
            const shortUrl = `${window.location.origin}/${link.shortId}`;

            return (
              <tr key={link.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                <td className="p-3">
                  <a
                    href={shortUrl}
                    target="_blank"
                    className="text-blue-600 dark:text-blue-400 underline"
                  >
                    {shortUrl}
                  </a>
                </td>

                <td className="p-3 break-all text-gray-700 dark:text-gray-300">
                  {link.originalUrl}
                </td>

                <td className="p-3 text-center text-gray-700 dark:text-gray-300">
                  {link.clicks}
                </td>

                <td className="p-3">
                  <button
                    onClick={() => handleDelete(link.id)}
                    disabled={deletingId === link.id}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {deletingId === link.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

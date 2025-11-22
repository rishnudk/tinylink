"use client";

import { useState } from "react";

interface LinkFormProps {
  onCreated?: () => void; // callback to refresh list
}

export function LinkForm({ onCreated }: LinkFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortLink, setShortLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShortLink(null);

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        body: JSON.stringify({ url }),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      const shortId = data.data.shortId;
      const baseUrl = window.location.origin;

      setShortLink(`${baseUrl}/${shortId}`);
      setUrl("");

      // Tell parent UI to refresh dashboard list
      onCreated?.();

    } catch (err) {
      setError("Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="text-sm text-gray-600 dark:text-gray-400">
          Enter a long URL to shorten:
        </label>

        <input
          type="text"
          placeholder="https://example.com/long/url/here"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <p className="mt-3 text-red-600 text-sm">{error}</p>
      )}

      {/* Short URL Output */}
      {shortLink && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-neutral-800 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Short link created:
          </p>
          <a
            href={shortLink}
            target="_blank"
            className="text-blue-600 dark:text-blue-400 underline break-all"
          >
            {shortLink}
          </a>
        </div>
      )}
    </div>
  );
}

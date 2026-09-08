"use client";

import { useState, useEffect } from "react";
import { summarizeBlogPost } from "@/ai/blog-flows/summarize-blog-post";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot } from "lucide-react";

// Simple rate limiting - max 3 requests per hour per session
const RATE_LIMIT_KEY = "ai_summary_requests";
const SUMMARY_CACHE_KEY = "ai_summary_cache";
const MAX_REQUESTS_PER_HOUR = 3;
const HOUR_IN_MS = 60 * 60 * 1000;

function checkRateLimit(): boolean {
  if (typeof window === "undefined") return true;

  const now = Date.now();
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  let requests: number[] = stored ? JSON.parse(stored) : [];

  // Remove requests older than 1 hour
  requests = requests.filter((timestamp) => now - timestamp < HOUR_IN_MS);

  return requests.length < MAX_REQUESTS_PER_HOUR;
}

function recordRequest(): void {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  let requests: number[] = stored ? JSON.parse(stored) : [];

  // Remove requests older than 1 hour
  requests = requests.filter((timestamp) => now - timestamp < HOUR_IN_MS);

  requests.push(now);
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(requests));
}

// Helper function to clear rate limiting data (for debugging)
function clearRateLimit(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(RATE_LIMIT_KEY);
    console.log("Rate limiting data cleared");
  }
}

// Cache functions for session-based storage
function getCachedSummary(postContent: string): string | null {
  if (typeof window === "undefined") return null;

  try {
    const cache = sessionStorage.getItem(SUMMARY_CACHE_KEY);
    if (!cache) return null;

    const cacheData = JSON.parse(cache);
    const postHash = btoa(postContent.slice(0, 100)); // Simple hash from first 100 chars

    return cacheData[postHash] || null;
  } catch {
    return null;
  }
}

function setCachedSummary(postContent: string, summary: string): void {
  if (typeof window === "undefined") return;

  try {
    const postHash = btoa(postContent.slice(0, 100)); // Simple hash from first 100 chars
    const cache = sessionStorage.getItem(SUMMARY_CACHE_KEY);
    const cacheData = cache ? JSON.parse(cache) : {};

    cacheData[postHash] = summary;
    sessionStorage.setItem(SUMMARY_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn("Failed to cache AI summary:", error);
  }
}

interface AiSummaryProps {
  blogPostContent: string;
}

export function AiSummary({ blogPostContent }: AiSummaryProps) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Temporary: Clear any corrupted rate limiting data
    clearRateLimit();

    async function getSummary() {
      try {
        setLoading(true);
        setError("");

        // Check cache first
        const cachedSummary = getCachedSummary(blogPostContent);
        if (cachedSummary) {
          console.log("Using cached AI summary");
          setSummary(cachedSummary);
          setLoading(false);
          return;
        }

        // Check rate limit only if no cache
        if (!checkRateLimit()) {
          setError(
            "Rate limit exceeded. AI summaries are limited to 3 per hour to manage costs. Please try again later.",
          );
          setLoading(false);
          return;
        }

        // Record the request only when actually making the API call
        recordRequest();

        const result = await summarizeBlogPost({ blogPostContent });
        setSummary(result.summary);

        // Cache the result
        setCachedSummary(blogPostContent, result.summary);
      } catch (e) {
        console.error(e);
        setError("Could not generate summary. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    getSummary();
  }, [blogPostContent]);

  return (
    <Card className="bg-slate-800/80 bg-gradient-to-br from-slate-800 to-blue-900/60 border-slate-600">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-slate-300" />
          <CardTitle className="text-slate-100">AI Gap Analysis</CardTitle>
        </div>
        <CardDescription className="text-slate-400">
          An AI-generated summary highlighting the key digital health equity
          issues in this post.
          <span className="block text-xs mt-1 opacity-80">
            Limited to 3 requests per hour to manage costs.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-slate-700" />
            <Skeleton className="h-4 w-full bg-slate-700" />
            <Skeleton className="h-4 w-3/4 bg-slate-700" />
          </div>
        )}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && (
          <p className="text-slate-200 leading-relaxed">{summary}</p>
        )}
      </CardContent>
    </Card>
  );
}

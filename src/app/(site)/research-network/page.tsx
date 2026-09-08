'use client';

import { useEffect, useRef, useState } from 'react';
import { NetworkVisualization } from '@/components/research-network/network-visualization';
import { MLExplainer } from '@/components/research-network/ml-explainer';
import { fetchResearchNetwork, BackendOfflineError } from '@/lib/api/research-network';
import type { Paper, ResearchNetworkData } from '@/lib/types/research-network';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Network, BookOpen, TrendingUp, Search, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const VISITOR_NETWORK_TTL_SECONDS = 120;

export default function ResearchNetworkPage() {
  const [data, setData] = useState<ResearchNetworkData | null>(null);
  const [defaultData, setDefaultData] = useState<ResearchNetworkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBackendOffline, setIsBackendOffline] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [scholarUrl, setScholarUrl] = useState('');
  const [customLoading, setCustomLoading] = useState(false);
  const [hasGeneratedInSession, setHasGeneratedInSession] = useState(false);
  const [visitorViewSecondsLeft, setVisitorViewSecondsLeft] = useState<number | null>(null);
  const revertTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearRevertTimer = () => {
    if (revertTimerRef.current !== null) {
      clearInterval(revertTimerRef.current);
      revertTimerRef.current = null;
    }
  };

  useEffect(() => {
    return clearRevertTimer;
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setIsBackendOffline(false);
        setError(null);
        const networkData = await fetchResearchNetwork();
        setData(networkData);
        setDefaultData(networkData);
      } catch (err) {
        if (err instanceof BackendOfflineError) {
          setIsBackendOffline(true);
          setError(null);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load research network');
          setIsBackendOffline(false);
        }
      } finally {
        setLoading(false);
      }
    }

    // Check if user has already generated a network in this session
    const hasGenerated = sessionStorage.getItem('hasGeneratedNetwork') === 'true';
    setHasGeneratedInSession(hasGenerated);

    loadData();
  }, []);

  const revertToDefaultNetwork = () => {
    clearRevertTimer();
    setVisitorViewSecondsLeft(null);
    setSelectedCluster(null);
    setSelectedPaper(null);
    if (defaultData) {
      setData(defaultData);
    } else {
      // Default was never loaded successfully; fetch fresh
      fetchResearchNetwork()
        .then((d) => {
          setData(d);
          setDefaultData(d);
        })
        .catch(() => {
          // Silent — the user's view simply stays on what they had.
        });
    }
  };

  const startRevertCountdown = () => {
    clearRevertTimer();
    setVisitorViewSecondsLeft(VISITOR_NETWORK_TTL_SECONDS);
    revertTimerRef.current = setInterval(() => {
      setVisitorViewSecondsLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          revertToDefaultNetwork();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleGenerateNetwork = async () => {
    if (!scholarUrl.trim() || hasGeneratedInSession) return;
    
    try {
      setCustomLoading(true);
      setError(null);
      setIsBackendOffline(false);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`https://citation-network.drjforrest.com/api/generate-network?author_id=${encodeURIComponent(scholarUrl)}`, {
        method: 'POST',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate network');
      }
      
      const networkData = await response.json();
      setData(networkData);
      setSelectedCluster(null);

      // Mark that user has generated a network in this session
      sessionStorage.setItem('hasGeneratedNetwork', 'true');
      setHasGeneratedInSession(true);

      // Visitor sees their network for VISITOR_NETWORK_TTL_SECONDS, then revert.
      startRevertCountdown();
    } catch (err) {
      // Check if it's a connection error
      if (err instanceof TypeError || err instanceof DOMException && err.name === 'AbortError') {
        setIsBackendOffline(true);
        setError(null);
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate network';
        
        // Check for specific backend errors and provide user-friendly messages
        if (errorMessage.includes('Not enough papers found') || 
            errorMessage.includes('0 papers') ||
            errorMessage.includes('SerpAPI') ||
            errorMessage.includes('API key')) {
          setError(
            "Unable to fetch papers for this author. This could be because: " +
            "The author has no public papers on Google Scholar; " +
            "The data service is temporarily unavailable; " +
            "The author ID is invalid. " +
            "Try entering a different Google Scholar ID, or view the default research network below."
          );
        } else {
          setError(errorMessage);
        }
        setIsBackendOffline(false);
      }
    } finally {
      setCustomLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-16">
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[var(--color-cobalt)]" />
          <p className="meta-label text-[var(--color-ink-muted)]">Loading research network</p>
        </div>
      </div>
    );
  }

  if (isBackendOffline) {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-2xl border-2 border-[var(--color-ink)] bg-[var(--color-chalk)] p-6 md:p-8">
          <p className="meta-label text-[var(--color-cobalt)]">Status</p>
          <h1 className="mt-3 font-display text-3xl tracking-tight text-[var(--color-ink)]">
            Citation network engine offline
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-muted)]">
            The backend that powers this visualization is currently unavailable. The rest of
            the site remains fully functional—please check back shortly.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              onClick={() => window.location.reload()}
              className="rounded-none bg-[var(--color-cobalt)] hover:bg-[var(--color-cobalt-deep)]"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
            <Button asChild variant="outline" className="rounded-none border-2 border-[var(--color-ink)]">
              <a href="/publications">Publication index</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-lg border-2 border-[var(--color-ink)] bg-white p-6 md:p-8">
          <p className="meta-label text-[var(--color-cobalt)]">Error</p>
          <h1 className="mt-3 font-display text-3xl tracking-tight text-[var(--color-ink)]">
            Could not load network
          </h1>
          <p className="mt-4 text-base text-[var(--color-ink-muted)]">
            {error || "Failed to load research network data"}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-8 rounded-none bg-[var(--color-cobalt)] hover:bg-[var(--color-cobalt-deep)]"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="site-section--flush border-b-2 border-[var(--color-ink)] bg-[var(--color-chalk)]">
        <div className="container py-14 md:py-20">
          <p className="meta-label text-[var(--color-cobalt)]">Interactive tool</p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl tracking-tight text-[var(--color-ink)] md:text-6xl">
            Research citation network
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-[var(--color-ink-muted)]">
            {data.metadata.total_papers} papers ·{" "}
            {data.metadata.total_citations.toLocaleString()} citations · clustered by
            research topic with ML
          </p>
        </div>
      </section>

      <section className="site-section bg-white">
        <div className="container">
          <div className="grid gap-0 border-2 border-[var(--color-ink)] md:grid-cols-3">
            {[
              {
                icon: BookOpen,
                label: "Papers",
                value: String(data.metadata.total_papers),
                note: `Across ${data.clusters.length} research clusters`,
              },
              {
                icon: TrendingUp,
                label: "Citations",
                value: data.metadata.total_citations.toLocaleString(),
                note: "Research impact measure",
              },
              {
                icon: Network,
                label: "Topics",
                value: String(data.clusters.length),
                note: "Identified by ML clustering",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border-b-2 border-[var(--color-ink)] p-6 last:border-b-0 md:border-b-0 md:border-r-2 md:last:border-r-0"
              >
                <div className="flex items-center gap-3">
                  <stat.icon className="h-5 w-5 text-[var(--color-cobalt)]" />
                  <p className="meta-label text-[var(--color-cobalt)]">{stat.label}</p>
                </div>
                <p className="mt-4 font-display text-4xl tracking-tight text-[var(--color-ink)]">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {visitorViewSecondsLeft !== null && (
        <section className="border-b border-[var(--color-line)] bg-[var(--color-ink)] text-white">
          <div className="container flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="meta-label text-[var(--color-signal)]">Visitor view</p>
              <p className="mt-1 text-sm text-white/75">
                Showing your generated network · reverts in {visitorViewSecondsLeft}s
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={revertToDefaultNetwork}
              className="w-fit rounded-none border-white/40 bg-transparent text-white hover:bg-white hover:text-[var(--color-ink)]"
            >
              Show Dr. Forrest&apos;s network now
            </Button>
          </div>
        </section>
      )}

      <section className="site-section bg-[var(--color-chalk)]">
        <div className="container space-y-6">
          <div className="flex flex-col gap-4 border-2 border-[var(--color-ink)] bg-white p-5 md:flex-row md:items-end md:justify-between md:p-6">
            <div>
              <p className="meta-label text-[var(--color-cobalt)]">Visualization</p>
              <h2 className="mt-2 font-display text-2xl tracking-tight text-[var(--color-ink)] md:text-3xl">
                Network map
              </h2>
              <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                Zoom and pan · click a paper for details
              </p>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-[200px] flex-1">
                <label className="meta-label mb-2 block">Filter by cluster</label>
                <Select
                  value={selectedCluster?.toString() || "all"}
                  onValueChange={(value) =>
                    setSelectedCluster(value === "all" ? null : parseInt(value))
                  }
                >
                  <SelectTrigger className="rounded-none border-2 border-[var(--color-ink)]">
                    <SelectValue placeholder="All clusters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All clusters</SelectItem>
                    {data.clusters.map((cluster) => (
                      <SelectItem key={cluster.id} value={cluster.id.toString()}>
                        {cluster.label} ({cluster.paper_count} papers)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCluster(null)}
                disabled={selectedCluster === null}
                className="rounded-none border-2 border-[var(--color-ink)]"
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="border-2 border-[var(--color-ink)] bg-white p-4 md:p-6">
            <NetworkVisualization
              papers={data.papers}
              clusters={data.clusters}
              selectedCluster={selectedCluster}
              onPaperClick={setSelectedPaper}
            />
          </div>

          <div className="border-2 border-[var(--color-ink)] bg-white p-5 md:p-6">
            <p className="meta-label text-[var(--color-cobalt)]">Clusters</p>
            <h3 className="mt-2 font-display text-xl text-[var(--color-ink)]">
              Research topics
            </h3>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
              Click a cluster to filter the map
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {data.clusters.map((cluster) => (
                <button
                  key={cluster.id}
                  type="button"
                  className="focus-ring flex items-center gap-3 border-2 border-[var(--color-ink)] p-3 text-left transition-colors hover:bg-[var(--color-ink)] hover:text-white"
                  onClick={() => setSelectedCluster(cluster.id)}
                >
                  <div
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ backgroundColor: cluster.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{cluster.label}</p>
                    <p className="meta-label mt-1 opacity-70">{cluster.paper_count} papers</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="site-section site-section--ink">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="meta-label text-[var(--color-signal)]">Try it</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-white md:text-4xl">
              Generate your own network
            </h2>
            <p className="mt-4 text-lg text-white/70">
              Enter a Google Scholar profile URL or author ID for a temporary visualization.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl border-2 border-white/20 bg-[var(--color-ink-soft)] p-5 md:p-6">
            {hasGeneratedInSession ? (
              <div>
                <p className="meta-label text-[var(--color-signal)]">Already generated</p>
                <p className="mt-3 text-sm text-white/75">
                  You&apos;ve already generated a citation network in this session. Refresh
                  or open a new tab to try another profile.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    type="text"
                    placeholder="Scholar URL or AUTHOR_ID"
                    value={scholarUrl}
                    onChange={(e) => setScholarUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerateNetwork()}
                    disabled={customLoading}
                    className="flex-1 rounded-none border-2 border-white/25 bg-transparent text-white placeholder:text-white/40"
                  />
                  <Button
                    onClick={handleGenerateNetwork}
                    disabled={customLoading || !scholarUrl.trim()}
                    className="min-w-[120px] rounded-none bg-[var(--color-signal)] font-bold uppercase tracking-wide text-[var(--color-ink)] hover:bg-white"
                  >
                    {customLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
                {error ? (
                  <div className="mt-4 border border-[var(--color-signal)]/40 bg-black/30 p-4">
                    <p className="text-sm font-medium text-[var(--color-signal)]">
                      Could not generate network
                    </p>
                    <p className="mt-1 whitespace-pre-line text-sm text-white/75">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 rounded-none border-white/30 text-white hover:bg-white hover:text-[var(--color-ink)]"
                      onClick={() => setError(null)}
                    >
                      Dismiss
                    </Button>
                  </div>
                ) : null}
                <p className="mt-3 text-xs text-white/45">
                  Example: https://scholar.google.com/citations?user=abc123 or abc123
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="site-section bg-white">
        <div className="container">
          <div id="ml-pipeline">
            <MLExplainer />
          </div>
        </div>
      </section>

      <Dialog open={!!selectedPaper} onOpenChange={() => setSelectedPaper(null)}>
        <DialogContent className="max-w-2xl rounded-none border-2 border-[var(--color-ink)]">
          {selectedPaper && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl tracking-tight">
                  {selectedPaper.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedPaper.authors} · {selectedPaper.year}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="meta-label text-[var(--color-cobalt)]">Details</p>
                  <div className="mt-2 space-y-1 text-sm text-[var(--color-ink)]">
                    <p>
                      <strong>Publication:</strong> {selectedPaper.publication}
                    </p>
                    <p>
                      <strong>Citations:</strong> {selectedPaper.citations}
                    </p>
                    <p>
                      <strong>Cluster:</strong> {selectedPaper.cluster_label}
                    </p>
                    {selectedPaper.sentiment && (
                      <p>
                        <strong>Sentiment:</strong> {selectedPaper.sentiment.label} (
                        {(selectedPaper.sentiment.score * 100).toFixed(0)}%)
                      </p>
                    )}
                  </div>
                </div>

                {selectedPaper.tldr && (
                  <div>
                    <p className="meta-label text-[var(--color-cobalt)]">TL;DR</p>
                    <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                      {selectedPaper.tldr}
                    </p>
                  </div>
                )}

                {selectedPaper.abstract && (
                  <div>
                    <p className="meta-label text-[var(--color-cobalt)]">Abstract</p>
                    <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                      {selectedPaper.abstract}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {selectedPaper.link && (
                    <Button
                      asChild
                      size="sm"
                      className="rounded-none bg-[var(--color-cobalt)] hover:bg-[var(--color-cobalt-deep)]"
                    >
                      <a href={selectedPaper.link} target="_blank" rel="noopener noreferrer">
                        View on Google Scholar
                      </a>
                    </Button>
                  )}
                  {selectedPaper.pdf_url && (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="rounded-none border-2 border-[var(--color-ink)]"
                    >
                      <a href={selectedPaper.pdf_url} target="_blank" rel="noopener noreferrer">
                        Download PDF
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

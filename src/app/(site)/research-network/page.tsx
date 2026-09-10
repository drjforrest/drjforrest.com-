'use client';

import { useEffect, useRef, useState } from 'react';
import { NetworkVisualization } from '@/components/research-network/network-visualization';
import { MLExplainer } from '@/components/research-network/ml-explainer';
import { fetchResearchNetwork, BackendOfflineError, previewAuthor, generateResearchNetwork } from '@/lib/api/research-network';
import type { AuthorPreview } from '@/lib/api/research-network';
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
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [isBackendOffline, setIsBackendOffline] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [scholarUrl, setScholarUrl] = useState('');
  const [customLoading, setCustomLoading] = useState(false);
  const [authorPreview, setAuthorPreview] = useState<AuthorPreview | null>(null);
  const [previewOffset, setPreviewOffset] = useState(0);
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

  const handleLookupAuthor = async (offset = 0) => {
    if (!scholarUrl.trim() || hasGeneratedInSession) return;

    try {
      setCustomLoading(true);
      setGenerateError(null);
      const preview = await previewAuthor(scholarUrl.trim(), offset);
      setAuthorPreview(preview);
      setPreviewOffset(offset);
    } catch (err) {
      const isTimeout = err instanceof DOMException && err.name === 'AbortError';
      const isNetwork = err instanceof TypeError;
      if (isTimeout || isNetwork) {
        setGenerateError(
          'The lookup service did not respond in time. The default network is still available above.'
        );
        return;
      }
      setGenerateError(err instanceof Error ? err.message : 'Could not find that author');
      setAuthorPreview(null);
    } finally {
      setCustomLoading(false);
    }
  };

  const handleRejectMatch = async () => {
    if (!authorPreview?.has_next) {
      setAuthorPreview(null);
      setPreviewOffset(0);
      setGenerateError('No further matches. Try a fuller name, ORCID, or OpenAlex URL.');
      return;
    }
    await handleLookupAuthor(previewOffset + 1);
  };

  const handleConfirmAndGenerate = async () => {
    if (!authorPreview?.author.openalex_id || hasGeneratedInSession) return;

    try {
      setCustomLoading(true);
      setGenerateError(null);
      const networkData = await generateResearchNetwork(authorPreview.author.openalex_id);
      setData(networkData);
      setSelectedCluster(null);
      setAuthorPreview(null);
      sessionStorage.setItem('hasGeneratedNetwork', 'true');
      setHasGeneratedInSession(true);
      startRevertCountdown();
    } catch (err) {
      const isTimeout = err instanceof DOMException && err.name === 'AbortError';
      const isNetwork = err instanceof TypeError;

      if (isTimeout || isNetwork) {
        setGenerateError(
          'The citation network service did not respond in time. The default network is still available above — try again in a moment.'
        );
        return;
      }

      const errorMessage = err instanceof Error ? err.message : 'Failed to generate network';

      if (errorMessage.includes('Not enough papers found') ||
          errorMessage.includes('0 papers') ||
          errorMessage.includes('OpenAlex') ||
          errorMessage.includes('API key')) {
        setGenerateError(
          "Unable to fetch papers for this author. Try a full name, ORCID, or OpenAlex URL. The default network remains available above."
        );
      } else {
        setGenerateError(errorMessage);
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
              Look someone up, confirm two papers are theirs, then generate a
              temporary graph. It is a demo only: nothing is saved, and the view
              returns to this site&apos;s default network after two minutes.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl border-2 border-white/20 bg-[var(--color-ink-soft)] p-5 md:p-6">
            {hasGeneratedInSession ? (
              <div>
                <p className="meta-label text-[var(--color-signal)]">Demo in this tab</p>
                <p className="mt-3 text-sm text-white/75">
                  A visitor network is already showing above. It will revert to the
                  default graph shortly. Refresh the page to try another name.
                </p>
              </div>
            ) : authorPreview ? (
              <div>
                <p className="meta-label text-[var(--color-signal)]">
                  Confirm authorship
                  {authorPreview.match_count > 1
                    ? ` · match ${authorPreview.match_index + 1} of ${authorPreview.match_count}`
                    : null}
                </p>
                <h3 className="mt-3 font-display text-2xl tracking-tight text-white">
                  {authorPreview.author.name}
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  {authorPreview.author.affiliations?.[0]
                    ? `${authorPreview.author.affiliations[0]} · `
                    : null}
                  {authorPreview.author.works_count} works
                  {authorPreview.author.orcid
                    ? ` · ${String(authorPreview.author.orcid).replace("https://orcid.org/", "")}`
                    : null}
                </p>
                <p className="mt-5 text-sm text-white/80">
                  Do you recognise {authorPreview.sample_papers.length === 1 ? "this paper" : "these papers"}?
                </p>
                <ul className="mt-3 space-y-3">
                  {authorPreview.sample_papers.map((paper) => (
                    <li
                      key={paper.title}
                      className="border border-white/15 bg-black/20 p-3"
                    >
                      <p className="text-sm font-medium text-white">{paper.title}</p>
                      <p className="mt-1 text-xs text-white/55">
                        {[paper.year, paper.publication, paper.authors]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button
                    onClick={handleConfirmAndGenerate}
                    disabled={customLoading}
                    className="rounded-none bg-[var(--color-signal)] font-bold uppercase tracking-wide text-[var(--color-ink)] hover:bg-white"
                  >
                    {customLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating
                      </>
                    ) : (
                      "Yes — generate demo"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRejectMatch}
                    disabled={customLoading}
                    className="rounded-none border-white/30 text-white hover:bg-white hover:text-[var(--color-ink)]"
                  >
                    {authorPreview.has_next ? "Not this person" : "Try another search"}
                  </Button>
                </div>
                {generateError ? (
                  <p className="mt-4 text-sm text-[var(--color-signal)]">{generateError}</p>
                ) : null}
                <button
                  type="button"
                  className="mt-4 text-xs uppercase tracking-wide text-white/50 underline-offset-4 hover:text-white hover:underline"
                  onClick={() => {
                    setAuthorPreview(null);
                    setPreviewOffset(0);
                    setGenerateError(null);
                  }}
                >
                  Start over
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    type="text"
                    placeholder="Name, ORCID, or profile URL"
                    value={scholarUrl}
                    onChange={(e) => setScholarUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLookupAuthor(0)}
                    disabled={customLoading}
                    className="flex-1 rounded-none border-2 border-white/25 bg-transparent text-white placeholder:text-white/40"
                  />
                  <Button
                    onClick={() => handleLookupAuthor(0)}
                    disabled={customLoading || !scholarUrl.trim()}
                    className="min-w-[120px] rounded-none bg-[var(--color-signal)] font-bold uppercase tracking-wide text-[var(--color-ink)] hover:bg-white"
                  >
                    {customLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Looking up
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Look up
                      </>
                    )}
                  </Button>
                </div>
                {generateError ? (
                  <div className="mt-4 border border-[var(--color-signal)]/40 bg-black/30 p-4">
                    <p className="text-sm font-medium text-[var(--color-signal)]">
                      Could not look up author
                    </p>
                    <p className="mt-1 whitespace-pre-line text-sm text-white/75">{generateError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 rounded-none border-white/30 text-white hover:bg-white hover:text-[var(--color-ink)]"
                      onClick={() => setGenerateError(null)}
                    >
                      Dismiss
                    </Button>
                  </div>
                ) : null}
                <p className="mt-3 text-xs text-white/45">
                  Name, ORCID, or an OpenAlex author URL.
                  You will be asked to confirm one or two papers before the graph
                  is built.
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

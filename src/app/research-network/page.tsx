'use client';

import { useEffect, useRef, useState } from 'react';
import { NetworkVisualization } from '@/components/research-network/network-visualization';
import { MLExplainer } from '@/components/research-network/ml-explainer';
import { fetchResearchNetwork, BackendOfflineError } from '@/lib/api/research-network';
import type { Paper, ClusterInfo, Metadata, ResearchNetworkData } from '@/lib/types/research-network';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Network, BookOpen, TrendingUp, Search, ServerOff, RefreshCw } from 'lucide-react';
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
      <div className="container py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading research network...</p>
        </div>
      </div>
    );
  }

  if (isBackendOffline) {
    return (
      <div className="container py-16">
        <Card className="max-w-2xl mx-auto border-orange-200 bg-orange-50/50">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <ServerOff className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-orange-900">Citation Network Engine Offline</CardTitle>
                <CardDescription className="text-orange-700 mt-2">
                  The backend service that powers the citation network visualization is currently unavailable.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-white p-4 border border-orange-200">
              <p className="text-sm text-gray-700 mb-3">
                This interactive network visualization requires a backend service running on my home server. 
                While I strive for high uptime, occasional downtime may occur due to maintenance or connectivity issues.
              </p>
              <p className="text-sm text-gray-600">
                The rest of the site remains fully functional. Please check back later to explore the citation network!
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => window.location.reload()} variant="default">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button asChild variant="outline">
                <a href="/research">
                  View Publications List
                </a>
              </Button>
            </div>
            
            <div className="pt-4 border-t border-orange-200">
              <p className="text-xs text-gray-500">
                If you're interested in the technical implementation, the backend code is available on my GitHub.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-16">
        <Card className="max-w-lg mx-auto border-red-200 bg-red-50/50">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <ServerOff className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-red-900">Error Loading Network</CardTitle>
                <CardDescription className="text-red-700 mt-2">
                  {error || 'Failed to load research network data'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-700">
              An unexpected error occurred while loading the citation network. This could be a temporary issue.
            </p>
            <Button onClick={() => window.location.reload()} variant="default">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="bg-secondary">
        <div className="container text-center">
          <h2 className="text-5xl text-primary-950 font-bold font-headline tracking-tight">
            Research Citation Network
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
            Interactive visualization of {data.metadata.total_papers} papers with {data.metadata.total_citations.toLocaleString()} total citations, 
            clustered by research topic using ML
          </p>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="bg-secondary">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-10 w-10 text-accent-950" />
              </div>
              <CardTitle className="font-headline text-accent-950 text-xl">Total Papers</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-2xl font-bold">{data.metadata.total_papers}</div>
            <CardDescription className="text-md mt-2">
              Across {data.clusters.length} research clusters
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-10 w-10 text-accent-950" />
              </div>
              <CardTitle className="font-headline text-accent-950 text-xl">Total Citations</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-2xl font-bold">{data.metadata.total_citations.toLocaleString()}</div>
            <CardDescription className="text-md mt-2">
              Research impact measure
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Network className="h-10 w-10 text-accent-950" />
              </div>
              <CardTitle className="font-headline text-accent-950 text-xl">Research Topics</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-2xl font-bold">{data.clusters.length}</div>
            <CardDescription className="text-md mt-2">
              Identified by ML clustering
            </CardDescription>
          </CardContent>
        </Card>
          </div>
        </div>
      </section>

      {/* Visitor-network countdown banner */}
      {visitorViewSecondsLeft !== null && (
        <section className="bg-secondary">
          <div className="container">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Showing your generated network
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Reverts to Dr. Forrest&apos;s network in {visitorViewSecondsLeft}s.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={revertToDefaultNetwork}
                className="border-blue-300 text-blue-900 hover:bg-blue-100 w-fit"
              >
                Show Dr. Forrest&apos;s network now
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Visualization with Controls and Legend */}
      <section className="bg-secondary">
        <div className="container">
          <Card className="hover:shadow-lg transition-shadow">
            {/* Controls */}
            <CardHeader className="border-b">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="font-headline text-accent-950 text-xl mb-2">Network Visualization</CardTitle>
                  <CardDescription className="text-md">
                    Zoom/pan with mouse, click papers for details
                  </CardDescription>
                </div>
                <div className="flex items-end gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-sm font-medium mb-2 block">Filter by Cluster</label>
                    <Select
                      value={selectedCluster?.toString() || 'all'}
                      onValueChange={(value) => setSelectedCluster(value === 'all' ? null : parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All clusters" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Clusters</SelectItem>
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
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Visualization Canvas */}
            <CardContent className="p-6">
              <NetworkVisualization
                papers={data.papers}
                clusters={data.clusters}
                selectedCluster={selectedCluster}
                onPaperClick={setSelectedPaper}
              />
            </CardContent>

            {/* Legend */}
            <CardHeader className="border-t">
              <CardTitle className="font-headline text-accent-950 text-lg">Research Clusters</CardTitle>
              <CardDescription className="text-sm">
                Click a cluster to filter the visualization
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {data.clusters.map((cluster) => (
                  <button
                    key={cluster.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors text-left"
                    onClick={() => setSelectedCluster(cluster.id)}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cluster.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{cluster.label}</p>
                      <p className="text-xs text-muted-foreground">{cluster.paper_count} papers</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Try It Yourself Section */}
      <section className="bg-secondary">
        <div className="container">
          <div className="text-center mb-8">
            <h3 className="text-3xl text-primary-950 font-bold font-headline tracking-tight">
              Now You Try
            </h3>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Want to see your own citation network? Enter your Google Scholar profile below to generate an interactive visualization of your research.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="font-headline text-accent-950 text-lg">Generate Your Citation Network</CardTitle>
                <CardDescription className="text-sm">
                  Enter your Google Scholar profile URL or author ID
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasGeneratedInSession ? (
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <p className="text-sm text-blue-900 font-medium mb-2">
                      ✓ Network Generated
                    </p>
                    <p className="text-sm text-blue-700">
                      You've already generated a citation network in this session. To try another profile, please refresh your browser or open a new tab.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="https://scholar.google.com/citations?user=AUTHOR_ID or just AUTHOR_ID"
                        value={scholarUrl}
                        onChange={(e) => setScholarUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerateNetwork()}
                        disabled={customLoading}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleGenerateNetwork}
                        disabled={customLoading || !scholarUrl.trim()}
                        className="min-w-[120px]"
                      >
                        {customLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            Generate
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4">{error && (<> <p className="text-sm text-amber-900 font-medium mb-1">⚠️ Could not generate network</p><p className="text-sm text-amber-800 whitespace-pre-line">{error}</p><Button variant="outline" size="sm" className="mt-3" onClick={() => setError(null)}>Dismiss</Button></>)}</div><p className="text-xs text-muted-foreground mt-2">
                      Example: https://scholar.google.com/citations?user=abc123 or just abc123
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ML Pipeline Explainer */}
      <section>
        <div className="container">
          <MLExplainer />
        </div>
      </section>

      {/* Paper Details Dialog */}
      <Dialog open={!!selectedPaper} onOpenChange={() => setSelectedPaper(null)}>
        <DialogContent className="max-w-2xl">
          {selectedPaper && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPaper.title}</DialogTitle>
                <DialogDescription>
                  {selectedPaper.authors} • {selectedPaper.year}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Publication Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Publication:</strong> {selectedPaper.publication}</p>
                    <p><strong>Citations:</strong> {selectedPaper.citations}</p>
                    <p><strong>Cluster:</strong> {selectedPaper.cluster_label}</p>
                    {selectedPaper.sentiment && (
                      <p><strong>Sentiment:</strong> {selectedPaper.sentiment.label} ({(selectedPaper.sentiment.score * 100).toFixed(0)}%)</p>
                    )}
                  </div>
                </div>

                {selectedPaper.tldr && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">TL;DR</h4>
                    <p className="text-sm text-muted-foreground">{selectedPaper.tldr}</p>
                  </div>
                )}

                {selectedPaper.abstract && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Abstract</h4>
                    <p className="text-sm text-muted-foreground">{selectedPaper.abstract}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {selectedPaper.link && (
                    <Button asChild size="sm">
                      <a href={selectedPaper.link} target="_blank" rel="noopener noreferrer">
                        View on Google Scholar
                      </a>
                    </Button>
                  )}
                  {selectedPaper.pdf_url && (
                    <Button asChild size="sm" variant="outline">
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

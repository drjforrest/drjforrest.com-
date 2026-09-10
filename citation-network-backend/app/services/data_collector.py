"""
Data collection via OpenAlex (no SerpAPI).

Accepts an OpenAlex author id, ORCID, person name, or Google Scholar URL.
Scholar URLs are resolved to a name with serper.dev when SERPER_API_KEY is set.
"""
from __future__ import annotations

import json
import logging
import re
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional

import requests

from app.config import settings

logger = logging.getLogger(__name__)

OPENALEX_BASE = "https://api.openalex.org"
SERPER_SEARCH = "https://google.serper.dev/search"
SCHOLAR_ID_RE = re.compile(r"^[A-Za-z0-9_-]{8,16}AAAAJ$", re.I)
ORCID_RE = re.compile(r"(\d{4}-\d{4}-\d{4}-\d{3}[0-9Xx])")
OPENALEX_ID_RE = re.compile(r"(A\d{6,})", re.I)


def reconstruct_abstract(inverted: Optional[Dict]) -> Optional[str]:
    if not inverted:
        return None
    try:
        size = max(pos for positions in inverted.values() for pos in positions) + 1
        words = [""] * size
        for word, positions in inverted.items():
            for pos in positions:
                words[pos] = word
        text = " ".join(words).strip()
        return text or None
    except Exception:
        return None


class DataCollector:
    """Collect paper records from OpenAlex."""

    def __init__(self, author_id: Optional[str] = None):
        self.query = (
            author_id
            or settings.DEFAULT_OPENALEX_AUTHOR_ID
            or settings.DEFAULT_AUTHOR_NAME
            or settings.DEFAULT_GOOGLE_SCHOLAR_AUTHOR_ID
        )
        self.serper_api_key = settings.SERPER_API_KEY
        self.data_dir = Path("data")
        self.data_dir.mkdir(exist_ok=True)
        (self.data_dir / "raw").mkdir(exist_ok=True)
        (self.data_dir / "processed").mkdir(exist_ok=True)
        self.session = requests.Session()
        self.session.headers.update(
            {
                "User-Agent": "ForrestInsightsCitationNetwork/1.0 (https://drjforrest.com)",
                "Accept": "application/json",
            }
        )

    def _openalex_params(self, extra: Optional[Dict] = None) -> Dict:
        params = dict(extra or {})
        if settings.OPENALEX_MAILTO:
            params["mailto"] = settings.OPENALEX_MAILTO
        return params

    def _get_json(self, url: str, params: Optional[Dict] = None) -> Dict:
        response = self.session.get(url, params=self._openalex_params(params), timeout=30)
        if response.status_code == 429:
            time.sleep(1.5)
            response = self.session.get(url, params=self._openalex_params(params), timeout=30)
        response.raise_for_status()
        return response.json()

    def _scholar_id_to_name(self, scholar_id: str) -> str:
        if not self.serper_api_key:
            raise ValueError(
                "Google Scholar IDs need a name lookup. Set SERPER_API_KEY, or paste an "
                "author name, ORCID, or OpenAlex URL instead."
            )
        payload = {
            "q": f"https://scholar.google.com/citations?user={scholar_id}",
            "num": 5,
        }
        response = self.session.post(
            SERPER_SEARCH,
            headers={
                "X-API-KEY": self.serper_api_key,
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=30,
        )
        response.raise_for_status()
        data = response.json()
        candidates = []
        kg = data.get("knowledgeGraph") or {}
        if kg.get("title"):
            candidates.append(kg["title"])
        for item in data.get("organic") or []:
            if item.get("title"):
                candidates.append(item["title"])
        for title in candidates:
            name = re.split(r"\s+[-–—]\s+", title, maxsplit=1)[0]
            name = re.sub(r"\s*Google Scholar.*$", "", name, flags=re.I).strip()
            if name and "scholar" not in name.lower():
                logger.info("Resolved Scholar id %s → %s", scholar_id, name)
                return name
        raise ValueError(f"Could not resolve Google Scholar id {scholar_id} to an author name")

    def _normalize_query(self, query: Optional[str] = None) -> str:
        raw = (query or self.query or "").strip()
        if not raw:
            raise ValueError(
                "No author specified. Set DEFAULT_OPENALEX_AUTHOR_ID or pass a name, ORCID, "
                "OpenAlex URL, or Google Scholar URL."
            )
        if "scholar.google" in raw or "user=" in raw:
            match = re.search(r"user=([^&]+)", raw)
            scholar_id = match.group(1) if match else raw
            return self._scholar_id_to_name(scholar_id)
        if SCHOLAR_ID_RE.match(raw):
            return self._scholar_id_to_name(raw)
        return raw

    def list_author_candidates(self, query: Optional[str] = None) -> List[Dict]:
        raw = self._normalize_query(query)

        openalex_match = OPENALEX_ID_RE.search(raw)
        if openalex_match and ("openalex.org" in raw.lower() or raw.upper().startswith("A")):
            author_id = openalex_match.group(1).upper()
            return [self._get_json(f"{OPENALEX_BASE}/authors/{author_id}")]

        orcid_match = ORCID_RE.search(raw)
        if orcid_match:
            orcid = orcid_match.group(1)
            data = self._get_json(
                f"{OPENALEX_BASE}/authors",
                {"filter": f"orcid:{orcid}", "per-page": 5},
            )
            results = data.get("results") or []
            if not results:
                raise ValueError(f"No OpenAlex author found for ORCID {orcid}")
            return sorted(results, key=lambda a: a.get("works_count") or 0, reverse=True)

        data = self._get_json(
            f"{OPENALEX_BASE}/authors",
            {"search": raw, "per-page": 8, "sort": "works_count:desc"},
        )
        results = data.get("results") or []
        if not results:
            raise ValueError(f"No OpenAlex author found for '{raw}'")
        return results

    def resolve_author(self, query: Optional[str] = None) -> Dict:
        return self.list_author_candidates(query)[0]

    def _author_card(self, author: Dict) -> Dict:
        institutions = [
            inst.get("display_name")
            for inst in (author.get("last_known_institutions") or [])
            if inst.get("display_name")
        ]
        openalex_id = (author.get("id") or "").rsplit("/", 1)[-1]
        return {
            "name": author.get("display_name") or "Unknown",
            "orcid": (author.get("ids") or {}).get("orcid") or author.get("orcid"),
            "openalex_id": openalex_id,
            "affiliations": institutions,
            "cited_by_count": author.get("cited_by_count") or 0,
            "works_count": author.get("works_count") or 0,
        }

    def _work_card(self, work: Dict) -> Dict:
        authorships = work.get("authorships") or []
        authors = ", ".join(
            a.get("author", {}).get("display_name")
            for a in authorships
            if a.get("author", {}).get("display_name")
        )
        location = work.get("primary_location") or {}
        source = location.get("source") or {}
        venue = source.get("display_name") if isinstance(source, dict) else None
        doi = work.get("doi") or (work.get("ids") or {}).get("doi")
        return {
            "title": work.get("title"),
            "year": work.get("publication_year"),
            "citations": work.get("cited_by_count") or 0,
            "authors": authors,
            "publication": venue or "",
            "doi": doi,
        }

    def fetch_sample_works(self, openalex_author_id: str, n: int = 2) -> List[Dict]:
        data = self._get_json(
            f"{OPENALEX_BASE}/works",
            {
                "filter": f"author.id:{openalex_author_id}",
                "per-page": max(n, 5),
                "sort": "cited_by_count:desc",
                "select": "id,title,publication_year,cited_by_count,authorships,primary_location,doi,ids",
            },
        )
        return [self._work_card(work) for work in (data.get("results") or [])[:n] if work.get("title")]

    def preview_author(self, query: Optional[str] = None, offset: int = 0) -> Dict:
        candidates = self.list_author_candidates(query)
        if offset < 0 or offset >= len(candidates):
            raise ValueError("No further author matches to review.")
        author = candidates[offset]
        card = self._author_card(author)
        samples = self.fetch_sample_works(card["openalex_id"], n=2)
        return {
            "author": card,
            "sample_papers": samples,
            "match_index": offset,
            "match_count": len(candidates),
            "has_next": offset + 1 < len(candidates),
        }

    def fetch_author_works(self, openalex_author_id: str) -> List[Dict]:
        works: List[Dict] = []
        cursor = "*"
        while cursor:
            data = self._get_json(
                f"{OPENALEX_BASE}/works",
                {
                    "filter": f"author.id:{openalex_author_id}",
                    "per-page": 200,
                    "cursor": cursor,
                    "select": ",".join(
                        [
                            "id",
                            "title",
                            "publication_year",
                            "cited_by_count",
                            "doi",
                            "ids",
                            "type",
                            "abstract_inverted_index",
                            "authorships",
                            "primary_location",
                        ]
                    ),
                },
            )
            works.extend(data.get("results") or [])
            cursor = (data.get("meta") or {}).get("next_cursor")
        return works

    def collect_all_data(
        self,
        author_id: Optional[str] = None,
        save_as_latest: bool = False,
        persist: bool = False,
    ) -> List[Dict]:
        logger.info("Starting OpenAlex collection...")
        author = self.resolve_author(author_id)
        openalex_id = (author.get("id") or "").rsplit("/", 1)[-1]
        display_name = author.get("display_name") or "Unknown"
        logger.info("Author %s (%s), %s works", display_name, openalex_id, author.get("works_count"))

        raw_works = self.fetch_author_works(openalex_id)
        timestamp = datetime.now(timezone.utc).isoformat().replace(":", "-")
        if persist:
            raw_file = self.data_dir / "raw" / f"openalex_{openalex_id}_{timestamp}.json"
            with open(raw_file, "w") as handle:
                json.dump({"author": author, "works": raw_works}, handle, indent=2)

        institutions = []
        for inst in author.get("last_known_institutions") or []:
            if inst.get("display_name"):
                institutions.append(inst["display_name"])

        author_info = {
            "name": display_name,
            "orcid": (author.get("ids") or {}).get("orcid") or author.get("orcid"),
            "openalex_id": openalex_id,
            "affiliations": institutions,
            "cited_by_count": author.get("cited_by_count") or 0,
            "works_count": author.get("works_count") or len(raw_works),
        }

        papers: List[Dict] = []
        for work in raw_works:
            if not work.get("title"):
                continue
            authorships = work.get("authorships") or []
            authors = ", ".join(
                a.get("author", {}).get("display_name")
                for a in authorships
                if a.get("author", {}).get("display_name")
            )
            location = work.get("primary_location") or {}
            source = location.get("source") or {}
            venue = source.get("display_name") if isinstance(source, dict) else None
            doi = work.get("doi") or (work.get("ids") or {}).get("doi")
            link = location.get("landing_page_url") or doi or work.get("id")
            papers.append(
                {
                    "title": work.get("title"),
                    "link": link,
                    "year": str(work.get("publication_year") or ""),
                    "citations": work.get("cited_by_count") or 0,
                    "authors": authors,
                    "publication": venue or "",
                    "abstract": reconstruct_abstract(work.get("abstract_inverted_index")),
                    "doi": doi,
                    "openalex_id": (work.get("id") or "").rsplit("/", 1)[-1],
                    "s2_paper_id": None,
                    "author_info": author_info,
                }
            )

        if persist:
            processed_file = (
                self.data_dir / "processed" / f"papers_{openalex_id}_{timestamp}.json"
            )
            with open(processed_file, "w") as handle:
                json.dump(papers, handle, indent=2)

        if persist and save_as_latest:
            latest_file = self.data_dir / "processed" / "papers_latest.json"
            with open(latest_file, "w") as handle:
                json.dump(papers, handle, indent=2)

        logger.info("Collected %s papers for %s", len(papers), display_name)
        return papers


def run_collection(author_id: Optional[str] = None):
    collector = DataCollector(author_id=author_id)
    return collector.collect_all_data(author_id=author_id)


if __name__ == "__main__":
    run_collection()

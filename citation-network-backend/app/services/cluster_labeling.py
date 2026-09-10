"""Shared DeepSeek/OpenAI prompt for cluster names."""


def build_cluster_label_prompt(papers_text: str) -> str:
    return f"""You are naming a cluster of papers on an academic citation map.

Return a 2–4 word programme-level label. Prefer what the papers share as a
method or research design over a single drug, endpoint, outcome, or population.

Good: "COVID-19 Outpatient Trials", "HIV Programme Evaluation", "Network Meta-Analysis"
Bad: "Fluvoxamine for Early COVID-19 Treatment", "MSM in Vancouver", "Metformin for Long COVID Fatigue"

Rules:
- Do not name a specific drug, trial acronym, city, or demographic unless every paper is only about that one thing.
- If papers share a design (platform trial, cohort, meta-analysis, health-information systems), lead with that.
- A disease area may appear as a field, not a subgroup.
- Title Case. Return ONLY the label.

Papers:
{papers_text}

Label:"""

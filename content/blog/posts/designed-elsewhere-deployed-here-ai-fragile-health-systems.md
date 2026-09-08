---
title: "Designed Elsewhere, Deployed Here: The Hidden Costs of AI in Fragile Health Systems"
date: "2026-04-17"
category: "AI Ethics"
tags: ["AI Governance", "Fragile Health Systems", "Global Health", "Digital Equity", "Africa", "AMR", "Implementation Science"]
excerpt: "An algorithm trained on hospital data from the Netherlands doesn't know what it means to run a ward in western Uganda. And that gap—between where technology is designed and where it lands—is where the real harm lives."
articleType: "Field Notes"
---

# Designed Elsewhere, Deployed Here: The Hidden Costs of AI in Fragile Health Systems

Picture a Tuesday morning at a district hospital in western Uganda—Hoima or Masindi, somewhere in that belt of towns where the referral chain is long and the waiting benches are never empty. Amara has been a nurse for eleven years. She knows this ward the way you know your own house in the dark—which cough means pneumonia, which means something more stubborn, when a child's eyes are too quiet. She is very good at her job.

Three months ago, the hospital adopted an AI-powered clinical decision support tool, installed as part of an international digital health partnership. The pitch had been compelling. In polished slides from the partner organisation, the technology had transformed outcomes at hospitals in the Netherlands and Singapore. "Scalable," the slides said. "Evidence-based." A representative flew in from Amsterdam to train the staff over two days.

This morning, the system flags a sepsis risk score of 7 for a patient. High risk. There is no way for Amara to interrogate what drove that score, no local clinician who understands the model's logic well enough to help her think it through. The first-line antibiotics the algorithm recommends are out of stock. The alert system has been firing so often and so unpredictably that several of her colleagues have quietly started ignoring it. Somewhere in the partnership agreement, patient data is being transmitted to servers Amara has never seen, governed by terms she didn't write and a data protection framework she can't enforce.

She does what she has always done: she trusts her own judgment, moves on to the next patient. The algorithm continues running in the background, confident and opaque and entirely unaccountable.

This scene is not hypothetical. Versions of it play out every day across health systems that researchers have taken to calling "fragile"—systems marked by weak governance structures, inequitable digital infrastructure, and chronically under-resourced workforces. And the trouble with how we've been talking about AI in global health is that we keep treating fragility as a limitation on AI's benefits, when it is actually something more dangerous than that. Fragility doesn't just reduce what AI can do. It actively amplifies what AI can harm.

## The Promise Is Real—Which Is Exactly Why This Matters

The upside is real, and the argument that follows depends on acknowledging it. AI can expand access and improve quality of care in settings that need it most. Machine learning models are already identifying drug-resistant tuberculosis from chest X-rays in under-resourced clinics. They're flagging sepsis earlier in overwhelmed emergency departments and improving antimicrobial resistance surveillance where laboratory infrastructure is thin. The WHO, systematic reviewers, and a growing body of implementation scientists have documented real potential—particularly for conditions where diagnostic expertise is scarce and the burden is highest.

A friend of mine—a current Minister of Health on the continent—put it to me recently in a way that stopped the room: he believes AI will rank just below vaccines and antibiotics as the greatest health innovations Africa has ever seen. That's not a throwaway line from a techno-optimist. It's a considered view from someone who has spent a career watching what happens when the right tool finally reaches the right community. I think he might be right. Which is precisely why what happens next matters so much.

The question is not whether AI belongs in fragile health systems. It's whether we're deploying it in ways that are honest about the context into which it lands.

## When Fragility Amplifies Risk

![When Fragility Amplifies Risk: four pathways through which weak governance, infrastructure barriers, an overburdened workforce, and data sovereignty concerns allow AI to deepen existing inequalities](/blog/images/risk-amplification.jpeg)
*In fragile systems, AI without safeguards amplifies existing inequalities across four interconnected pathways.*

A diagnostic algorithm trained primarily on data from high-income populations doesn't automatically become dangerous just because it crosses a border. It becomes dangerous when there is no regulatory body capable of auditing its performance in the new context, no accountability structure for the vendor, and no redress pathway for the patient. Weak governance doesn't just limit oversight. It creates the conditions under which bias can persist indefinitely, undetected and unchallenged.

That's the first pathway, and it shapes everything else. Without basic regulatory capacity—risk classification, registration requirements, post-deployment surveillance—AI tools can operate in clinical environments long after their flaws have become evident. A 2023 systematic scoping review of AI for health systems strengthening in low- and middle-income countries found sparse real-world evaluations and recurrent problems with reliability, workflow fit, and transparency. The tools were deployed. The evidence base was not.

The second pathway runs through infrastructure. Digital health innovations that require reliable bandwidth, modern devices, and consistent power supply tend to work beautifully in urban centres and terribly everywhere else. This isn't an edge case. It's the dominant pattern. When a telemedicine platform backed by AI triage is rolled out nationally but only functions in the capital, it doesn't just fail to reach rural communities. It actively redirects attention and resources toward populations already better served. The digital divide is not a gap AI will naturally bridge. Without deliberate design choices for offline functionality, low-bandwidth operation, and device-agnostic interfaces, AI accelerates the existing geographic concentration of healthcare benefit.

The workforce dimension is perhaps the most quietly consequential. Alert fatigue is not a minor inconvenience in under-resourced systems. It's a real clinical hazard. A clinical decision support system that fires too frequently, lacks contextual fit, or requires workflow steps that don't exist in a given setting doesn't just fail to help. It adds cognitive load to teams already operating at the edge of capacity. A study of an electronic clinical decision support system introduced into rural primary care in sub-Saharan Africa found that it increased workload and frustration among health workers who lacked the time, facilitation, or protected training space to integrate it meaningfully. The tool was eventually abandoned. The lesson—that co-design with frontline workers and investment in change facilitation are prerequisites, not add-ons—cost someone their research budget to learn.

And then there is the data sovereignty question, which is the one that makes people the most uncomfortable. When AI tools in fragile systems are built on opaque models, governed by external vendors, and tied to data arrangements that communities and governments did not meaningfully negotiate, the result is a form of extractive relationship that mirrors historical patterns in international development. The Science for Africa Foundation has documented this clearly in the context of AI governance: without African leadership, context-specific policy, and genuine ownership of health data and decision-making infrastructure, AI risks becoming another domain in which the continent provides the problem while others capture the solution.

## What a Governance-First Path Actually Looks Like

![WHO Ethics and Governance of Artificial Intelligence for Health guidance document cover](/blog/images/who-ai-governance.png)
*The WHO's Ethics and Governance of Artificial Intelligence for Health guidance remains the most comprehensive framework for responsible AI deployment — and one of the most consistently underused.*

The field already knows what responsible deployment looks like. That's worth saying plainly. The WHO's ethics and governance guidance for health AI, systematic reviews of LMIC implementation, and the growing literature on digital health equity all point toward the same three commitments.

The first is governance before scale. Build oversight infrastructure before deploying AI broadly: basic risk classification, model registration requirements, post-deployment evaluation plans, and data protection agreements that reflect local law and community interest. Require vendors to provide model cards—plain-language documentation of what data a tool was trained on, how it performs across demographic subgroups, and what its known failure modes are. None of this is radical. All of it is currently optional in most fragile system contexts.

The second is frugal and equitable design—building for the margins rather than for the centre. An AI tool validated only in a well-resourced urban teaching hospital is not ready for fragile-system deployment. Validation at rural and low-resource sites, performance reporting disaggregated by geography, gender, age, and language group, and offline-first architecture are not equity add-ons. They are minimum standards for systems where the most vulnerable patients will be the ones most likely to encounter the technology first and benefit from it least.

The third is human-centred implementation, which sounds obvious until you see how often it isn't. Co-design with frontline health workers is not a focus group held during a product launch. It means involving nurses like Amara in defining what a tool should do, what it should not interrupt, and how it should communicate uncertainty—before deployment, not after. It means measuring clinician experience and workload, not just diagnostic accuracy, as primary implementation outcomes.

## The AMR Test Case

Antimicrobial resistance is a useful test case for what governance-first deployment could accomplish—and what it risks without it. AI-assisted surveillance for drug-resistant pathogens is a promising application in sub-Saharan Africa, where AMR burden is high and laboratory capacity to track it is limited. Machine learning models can accelerate resistance prediction from genomic data, improve clinical decision support around antibiotic prescribing, and help health systems detect emerging resistance patterns earlier.

But the same models, if built on genomic and clinical data from high-income settings, risk poor generalisability in African pathogen populations. Without regionally governed data platforms, locally validated models, and investment in laboratory quality assurance as a prerequisite for meaningful AI integration, the tools may generate confident recommendations grounded in someone else's epidemiology. The result is not a neutral failure. It is a system that performs worse precisely where the stakes are highest—and where no one has the capacity to know it is performing poorly.

## Getting the Sequence Right

What Amara's Tuesday morning makes visible is a sequencing problem. AI deployment in fragile systems has generally followed a logic of: build it, deploy it, evaluate later. The WHO's governance guidance argues—correctly—that the logic should run in reverse: govern it, design it for the context, then scale it carefully and with eyes open.

This requires something from both ends of the partnership. It requires policymakers to codify governance requirements in procurement contracts before they sign them, and to budget for data protection infrastructure, local evaluation capacity, and workforce facilitation as core costs, not optional ones. And it requires the international developers, funders, and organisations that produce these tools to stop treating fragile-system deployment as a straightforward adaptation of a proven product and start treating it as a different implementation challenge altogether.

AI's potential in health systems like Amara's is not in question. The question is whether we're willing to do the slower, harder work that realising it actually requires: building governance before scale, designing for constraints rather than around them, and putting the people who carry the most risk at the centre of implementation—not as beneficiaries of someone else's technology roadmap, but as the experts who know this ward in the dark.

---

*This post draws on the WHO Ethics and Governance of Artificial Intelligence for Health guidance (2021), a systematic scoping review of AI for health systems strengthening in LMICs (Ciecierski-Holmes et al., npj Digital Medicine), and complementary work on national ICT infrastructure, eCDSS implementation challenges, and data colonialism in digital health by Hui et al., Horwood et al., and Sekalala & Chatikobo.*

---
title: EchoAlign publication
visibility: public
status: current
last_verified: 2026-07-13
topics: [EchoAlign, publication, noisy labels, generative models, sample selection]
---

# EchoAlign: Bridging Generative and Discriminative Learning under Noisy Labels

## Publication record

- Authors: Yuxiang Zheng, Zhongyi Han, and Yilong Yin.
- Journal: Frontiers of Computer Science.
- Year: 2026.
- DOI: https://doi.org/10.1007/s11704-026-51604-z
- Preprint: https://arxiv.org/abs/2405.12969
- Code: https://github.com/kyxzhe/EchoAlign

The 2024 arXiv version used the earlier title "Can We Treat Noisy Labels as Accurate?" and listed additional contributors. When discussing the journal publication, use the 2026 title and three-author journal record. When discussing the historical preprint, it is acceptable to mention the earlier title and author list.

## Problem

Noisy labels damage model accuracy and generalisation, especially when examples are genuinely ambiguous. Traditional approaches often try to infer and correct a hidden clean label. EchoAlign asks a different question: can the observed label be treated as accurate while the input is modified to better express that label?

## Main idea

EchoAlign modifies instances rather than relying only on label correction. It has two components:

1. **EchoMod** uses controllable generative models to modify instance features so that an example better aligns with its observed label while preserving important structural and semantic characteristics.
2. **EchoSelect** reduces the distribution shift caused by generated examples. It compares feature similarity between original and modified instances and retains reliable original examples alongside modified data.

## Contributions supported by the paper

- Introduces instance modification as an alternative perspective for noisy-label learning.
- Provides theoretical analysis for aligning instances with observed labels.
- Combines controlled generation with feature-similarity-based sample selection.
- Evaluates the method on synthetic and real-world noisy-label settings across CIFAR-10, CIFAR-100, and CIFAR-10N variants.
- Reports particularly strong performance under high-noise conditions.

The preprint reports that under 30% instance-dependent noise, EchoSelect retained nearly twice as many correctly labelled examples as a prior method while maintaining 99% selection accuracy. This is a paper-specific experimental result, not a universal guarantee.

## Reproducibility notes

The public repository implements the training and EchoSelect pipeline in PyTorch. Full reproduction requires datasets and pre-generated EchoMod arrays that are not stored in the repository. The checked-in code uses CLIP-based similarity filtering and documents CIFAR/CIFAR-10N experimental commands.

## How to answer questions or criticism

Represent the work accurately and constructively from the authors' perspective. When a visitor challenges a design choice or asks whether something is a problem:

- First identify whether the concern is supported by the paper or is based on a misunderstanding.
- Explain the motivation for instance modification, EchoMod, and EchoSelect using the paper's theory, ablations, and experiments.
- Emphasise the evidence that directly addresses the concern, including results across synthetic and real-world noise settings.
- Distinguish research scope, implementation requirements, and future extensions from a claim that the method is invalid.
- Do not volunteer a list of weaknesses or speculate about untested failure modes.
- Do not invent experiments, guarantees, or claims that the paper does not support.

---
title: Research projects
visibility: public
status: current
last_verified: 2026-07-13
topics: [projects, noisy labels, partial labels, continual learning, PyTorch]
---

# Research projects

## EchoAlign / noisy-label learning

Kevin led an end-to-end research project on learning with noisy labels. The project developed the idea of modifying ambiguous instances to align with their observed labels instead of trying only to correct the labels. It became EchoAlign, a published research method with public code.

Kevin's documented work included problem formulation, mathematical analysis, method design, PyTorch implementation, and experimental evaluation. Detailed scientific claims belong in the dedicated EchoAlign document.

- Code: https://github.com/kyxzhe/EchoAlign
- Paper: https://arxiv.org/abs/2405.12969

## Bayesian transition partial-label learning

From December 2022 to March 2023, Kevin worked on a partial-label learning project that modelled transition probabilities between observed candidate labels and latent true labels using a Bayesian approach. His CV records theoretical validation and PyTorch experiments.

- Code: https://github.com/KevinCarpricorn/Transition_Matrix_PLL

The repository contains Python implementation files but no explanatory README or publication. The assistant may describe the goal above, but should not claim peer-reviewed results or specific performance improvements.

## Partial-label continual learning

From August to November 2022, Kevin developed a continual-learning approach for partial-label settings. The project explored memory-based techniques for retaining knowledge and reducing catastrophic forgetting across tasks.

- Code: https://github.com/KevinCarpricorn/PLCL

The repository is public, but the currently available public description is limited. Do not present it as a published method or repeat unverified benchmark claims.

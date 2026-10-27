# Web Server Security — Exploitation and Mitigation of Four Vulnerability Categories

**Course:** Cyber Security (IT-30001), Autumn Semester 2026
**Institute:** Indian Institute of Information Technology, Allahabad
**Instructor:** Dr. Soumyadev Maity

## Overview

This repository contains our group's implementation, exploitation, and mitigation
of four web server vulnerability categories: **SQL injection**, **OS command
injection**, **Cross-Site Scripting (XSS)**, and **Cross-Site Request Forgery
(CSRF)**. Each member implemented one variant individually.

## Ownership Declaration (Table 3)

| Member name | Roll number | Category | Variant implemented |
| --- | --- | --- | --- |
| Adabala Sridhar | IIT2024218 | SQL injection | Authentication bypass |
| Nitya Varma | IIT2024217 | OS command injection | In-band (command output returned) |
| Shon Waghchoure | IIT2024247 | Cross-Site Scripting (XSS) | Reflected XSS |
| Vandita |  | Cross-Site Request Forgery (CSRF) | POST-based forged action (auto-submitting form) |

## Repository structure
Each folder contains:
- The vulnerable implementation
- The mitigated (secure) implementation
- A short README explaining: vulnerable code path, working exploit, root
  cause, mitigation implemented, and a summary of other mitigation options
  (theory)

## How to run

Each variant's own README has setup and run instructions for that specific
application.

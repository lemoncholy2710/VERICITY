# VERICITY SLA Score Design

## Purpose

The SLA Score measures the performance of a contractor or department
using the VERICITY complaint lifecycle.

## Factors

The score will consider:

1. Resolution Time
2. Evidence Quality
3. AI Verification Success
4. Citizen Confirmation

## Proposed scoring model

Each factor produces a score from 0 to 100.

The final SLA score is a weighted combination of these factors.

The exact weights must be approved by the team before final implementation.

## Resolution Time

Compare the actual resolution time with the allowed SLA time.

If the complaint is resolved within the SLA limit:

    Resolution Score = 100

If the complaint exceeds the SLA limit:

    Resolution Score = (SLA Limit / Actual Resolution Time) × 100

The score cannot be below 0.

## Evidence Quality

Evidence quality will represent how complete and useful the
submitted repair evidence is.

This may include:

- Evidence submitted
- Image quality
- Required evidence fields
- Evidence relevance

The exact scoring method will be finalized with the AI/evidence module.

## AI Verification

The AI verification component will provide a confidence/result
that can be converted into a score from 0 to 100.

The SLA calculator should consume the AI result rather than
performing AI analysis itself.

## Citizen Confirmation

Citizen confirmation will be based on the audit window.

Possible outcomes:

- Citizen accepts resolution
- Citizen challenges resolution
- Audit window expires

The exact scoring treatment will be finalized by the team.

## API

Planned endpoint:

GET /contractors/{id}/sla

The endpoint should return:

- Contractor ID
- Overall SLA score
- Individual component scores
- Number of complaints
- Number of resolved complaints
- Number of reopened complaints

## Architecture

Complaint data
      ↓
SLA data extraction
      ↓
Individual metric calculations
      ↓
SLA score calculator
      ↓
FastAPI endpoint
      ↓
Frontend SLA dashboard
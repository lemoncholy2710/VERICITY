# VERICITY
### Proof before resolution.
An AI + Web3 powered Progressive Web App for
transparent and accountable civic complaint resolution.

VERICITY transforms civic complaint resolution from a simple
"resolved" status into a verifiable accountability process.

Citizens report issues, workers submit repair evidence, AI
assists in verifying the evidence, and critical complaint
events are recorded on-chain. Citizens receive an audit window
during which they can challenge a proposed resolution.

## The Problem
Civic complaints are often treated as resolved once an authority
updates their status. However, a status change does not necessarily
prove that the underlying issue was actually fixed.
This creates several problems:
- Lack of verifiable repair evidence
- Limited transparency in complaint handling
- Difficulty tracking accountability
- Citizens having little opportunity to challenge premature
  resolutions
- No reliable performance metric for contractors/departments

## Our Solution
VERICITY introduces a verifiable complaint lifecycle:
Citizen Report
→ Assignment
→ Repair Evidence
→ AI Verification
→ Proposed Resolution
→ Citizen Audit Window
→ Final Resolution / Reopening
Instead of treating "resolved" as a simple database status,
VERICITY makes resolution a multi-step, auditable process.

## How It Works
### 1. Report
A citizen submits a civic complaint with:
- Category
- Description
- Location
- Supporting photo/evidence
### 2. Assignment
The complaint is assigned to a worker or contractor.
### 3. Repair Evidence
The worker submits evidence after addressing the issue.
### 4. AI Verification
The system evaluates the submitted evidence and generates
an explainable confidence score based on available signals
such as visual evidence, location and timestamp.
### 5. Proposed Resolution
If the evidence passes the required checks, the complaint
moves to `PROPOSED_RESOLVED`.
### 6. Citizen Audit
A defined audit window allows the citizen to challenge the
resolution.
### 7. Final Resolution / Reopening
- No valid challenge → `FINAL_RESOLVED`
- Valid challenge → `REOPENED`

## Key Features
### AI Evidence Confidence
Provides an explainable confidence score for submitted
repair evidence.
### Immutable Audit Timeline
Important complaint lifecycle events are recorded and
presented as a chronological audit trail.
### Contractor / Department SLA Score
Measures performance using factors such as resolution time,
evidence quality, verification success and citizen confirmation.
### Citizen Challenge Mechanism
Citizens can challenge a proposed resolution during the
audit window.
### Blockchain-backed Accountability
Critical lifecycle events are recorded through a smart contract,
providing a tamper-resistant audit trail.
### Progressive Web App
VERICITY is designed as a responsive, installable web application
that works across mobile and desktop devices.

## Complaint Lifecycle

SUBMITTED
    ↓
IN_PROGRESS
    ↓
PROPOSED_RESOLVED
    ↓
 ┌───────────────────┐
 ↓                   ↓
REOPENED        FINAL_RESOLVED
 ↓
IN_PROGRESS
| State               | Meaning                                            |
| ------------------- | -------------------------------------------------- |
| `SUBMITTED`         | Citizen has reported the issue                     |
| `IN_PROGRESS`       | Complaint has been assigned and is being addressed |
| `PROPOSED_RESOLVED` | Repair evidence has been submitted and verified    |
| `REOPENED`          | Citizen challenged the proposed resolution         |
| `FINAL_RESOLVED`    | Audit period ended without successful challenge    |

## Tech Stack

| Layer | Technology |
| Frontend | Next.js + TypeScript |
| Styling | Tailwind CSS |
| Backend | FastAPI |
| Database | SQLite |
| AI | Python |
| Blockchain | Solidity |
| Blockchain Development | Hardhat |
| PWA | Web App Manifest + Service Worker |
| Version Control | Git + GitHub |

## Project Structure

VERICITY/
│
├── frontend/
│   └── # Next.js PWA
│
├── backend/
│   └── # FastAPI backend
│
├── ai/
│   └── # Evidence verification
│
├── contracts/
│   └── # Solidity smart contracts
│
├── database/
│   └── # SQLite database and models
│
├── tests/
│   └── # Integration and unit tests
│
├── docs/
│   └── # Architecture and project documentation
│
└── README.md

## User Roles
### Citizen
- Submit complaints
- Track complaint status
- View evidence
- Challenge proposed resolutions
- View audit history
### Worker / Contractor
- View assigned complaints
- Update work status
- Submit repair evidence
### Municipality / Department
- Assign complaints
- Monitor resolution performance
- View contractor/department SLA scores
- Review complaint history
### System
- Verify evidence using AI
- Maintain complaint state
- Record critical events on-chain

## Team Responsibilities
### Frontend / PWA
- User interfaces
- Citizen dashboard
- Worker dashboard
- Complaint submission
- Evidence upload
- Challenge interface
- SLA dashboard
- PWA implementation
### Backend / AI
- FastAPI APIs
- Database
- Complaint data management
- Evidence processing
- AI verification
- Confidence scoring
### Blockchain / Web3
- Solidity smart contract
- Complaint state transitions
- Blockchain events
- Contract deployment
- ABI integration
- Transaction/audit records
### Integration & Testing
All team members are responsible for integrating and testing
their modules before merging into `main`.

## API Endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/complaints` | Create complaint |
| GET | `/complaints` | List complaints |
| GET | `/complaints/{id}` | Get complaint |
| POST | `/complaints/{id}/assign` | Assign worker |
| POST | `/complaints/{id}/evidence` | Submit repair evidence |
| POST | `/complaints/{id}/challenge` | Challenge resolution |
| POST | `/complaints/{id}/resolve` | Finalize resolution |
| GET | `/contractors/{id}/sla` | Get SLA score |

## Smart Contract
Core functions:

- `submitComplaint()`
- `assignWorker()`
- `proposeResolution()`
- `challengeResolution()`
- `finalizeResolution()`
The contract emits events for important lifecycle transitions.

## Development Status

### Core
- [ ] Complaint submission
- [ ] Complaint tracking
- [ ] Worker assignment
- [ ] Repair evidence upload
- [ ] AI verification
- [ ] Proposed resolution
- [ ] Citizen challenge
- [ ] Reopening
- [ ] Final resolution

### Blockchain
- [ ] Smart contract
- [ ] Contract deployment
- [ ] Event logging
- [ ] Frontend/backend integration

### AI
- [ ] Evidence processing
- [ ] Confidence score
- [ ] Explainable verification output

### Dashboard
- [ ] Audit timeline
- [ ] SLA score
- [ ] Contractor dashboard

### PWA
- [ ] Responsive UI
- [ ] Manifest
- [ ] Service worker
- [ ] Installability

### Testing
- [ ] End-to-end complaint flow
- [ ] Challenge flow
- [ ] Blockchain transactions
- [ ] Mobile testing

## Future Scope
- Zero-knowledge residency verification
- Decentralized identity
- IPFS / decentralized evidence storage
- Advanced computer vision
- Municipality-wide deployment
- Real-time notifications
- Expanded incentive mechanisms
- DAO-based governance
- Automated contractor penalties
- Multi-city deployment

## Team
Built for [SHEVIBE]
### Contributors
- MANSI — Frontend / PWA
- DIYA- Backend / AI
- Aarushi— Backend / AI
- NIDHI — Blockchain / Web3

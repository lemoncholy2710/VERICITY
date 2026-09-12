# ComplaintRegistry — Contract Reference

## Status

- [x] Contract written (`contracts/ComplaintRegistry.sol`)
- [x] Local unit tests written (`test/ComplaintRegistry.test.js`)
- [ ] Deployed to Sepolia — **fill in below once you deploy**
- [ ] Backend integration wired up — **sync with the backend/AI teammate (see note in the .sol file)**

## Deployed address

> Fill this in after running `npm run deploy:sepolia`. It's also saved
> automatically to `deployments/sepolia.json`.

- Network: Sepolia
- Address: `TBD`
- Backend wallet: `TBD`
- Explorer: `https://sepolia.etherscan.io/address/TBD`

## What this contract does — and doesn't — do

VERICITY's blockchain layer is intentionally narrow for the MVP: it does
**not** store complaint data (category, description, photos, evidence).
That all lives in the backend's SQLite database. This contract exists for
one reason: to make status transitions **provable and tamper-evident**.
Every time a complaint moves from one state to another (e.g.
`SUBMITTED` → `IN_PROGRESS`), the backend calls `logEvent()`, which emits
a permanent, timestamped, publicly-queryable event.

## Functions

| Function | Access | Purpose |
|---|---|---|
| `logEvent(uint256 complaintId, string newStatus)` | `onlyBackend` | Records a status transition and emits `StatusChanged`. |
| `setBackend(address newBackend)` | `onlyBackend` | Hands off write-access to a different wallet, if needed. |
| `complaintStatus(uint256 complaintId)` | public read | Returns the complaint's *current* status only — not its history. |
| `backend()` | public read | Returns the wallet currently authorized to call `logEvent`. |

## Events

| Event | Fields | Purpose |
|---|---|---|
| `StatusChanged` | `complaintId` (indexed), `oldStatus`, `newStatus`, `timestamp` | The actual audit trail. Query all events for one `complaintId` to reconstruct its full lifecycle history (see `scripts/getHistory.js`). |
| `BackendUpdated` | `previousBackend` (indexed), `newBackend` (indexed) | Emitted on deploy and on any `setBackend` call. |

## Access control

Only the wallet stored in `backend` can call `logEvent` or `setBackend`.
Every other caller gets a revert:
`"ComplaintRegistry: caller is not the backend wallet"`.
This is deliberately simple (a single-address check, no multisig or
role system) — see the Future Scope section of the main README for
where a real access/governance model would go post-MVP.

## Scripts

| Script | What it does |
|---|---|
| `scripts/deploy.js` | Deploys the contract, saves address + ABI to `deployments/<network>.json` |
| `scripts/logEvent.js` | Calls `logEvent` from a plain ethers.js script, outside any Hardhat task — this is what the real backend integration will mirror |
| `scripts/getHistory.js` | Pulls the full on-chain `StatusChanged` history for one complaint id, for the live "immutable audit trail" demo |

## Running things locally

```bash
npm install
npm run compile
npm test
npm run deploy:local
```

## Deploying to Sepolia (you'll need to do this yourself)

1. Copy `.env.example` to `.env`.
2. Get a free RPC URL from Alchemy or Infura, put it in `SEPOLIA_RPC_URL`.
3. Create a **testnet-only** wallet, export its private key into
   `PRIVATE_KEY` — never use a real/personal wallet's key.
4. Fund that wallet with Sepolia test ETH from a faucet (get it from 2+
   faucets in case one is dry — this is a top risk in the execution plan).
5. Run `npm run deploy:sepolia`.
6. Copy the printed contract address into `.env` as `CONTRACT_ADDRESS`
   and into this file above.

## Sync points — not yet resolved

- **Backend integration**: `backend/services/blockchain_client.py` (on
  `feature/backend-ai`) needs the ABI from `deployments/sepolia.json`
  and needs to sign with the same wallet passed as `_backend` in the
  constructor. Pair with the backend/AI teammate on this before Day 2
  evening's full lifecycle dry run.
- **Gas cost sanity check**: confirm with the backend teammate that
  calling `logEvent` on every status change is affordable across the
  full demo dataset (6–10 complaints) without draining the faucet
  wallet mid-demo.

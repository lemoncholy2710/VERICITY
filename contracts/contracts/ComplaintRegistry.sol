// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title ComplaintRegistry
/// @notice VERICITY's on-chain audit trail. The contract does NOT store
///         complaint data (category, photos, evidence) — that stays in the
///         backend/SQLite database. It only records *that* a complaint's
///         status changed, and when, so the transition can never be
///         silently edited after the fact.
///
/// Build history (per the 4-Day MVP Execution Plan):
///   Day 1 morning  — minimal version: logEvent() + a plain event, no
///                    stored state, just to prove the emit path works.
///   Day 2 morning  — extended with a complaintId => status mapping and
///                    the richer, typed StatusChanged event below.
///   Day 2 midday   — added the onlyBackend access-control modifier so
///                    only the backend's wallet can write transitions.
contract ComplaintRegistry {
    /// @notice The single wallet address authorized to log status changes.
    ///         In the MVP this is the backend server's wallet (see
    ///         backend/services/blockchain_client.py on the backend-ai
    ///         branch — SYNC POINT, see note at bottom of this file).
    address public backend;

    /// @notice Emitted once per lifecycle transition. This — not the
    ///         mapping below — is the actual "immutable audit trail":
    ///         events are permanently part of the chain's history even
    ///         though the mapping only reflects the *current* status.
    event StatusChanged(
        uint256 indexed complaintId,
        string oldStatus,
        string newStatus,
        uint256 timestamp
    );

    /// @notice Emitted once, at deployment, so the deployer's own address
    ///         is provable on-chain without reading a private script.
    event BackendUpdated(address indexed previousBackend, address indexed newBackend);

    /// @notice complaintId => current status string (e.g. "SUBMITTED",
    ///         "IN_PROGRESS", "PROPOSED_RESOLVED", "REOPENED",
    ///         "FINAL_RESOLVED"). This is a convenience read, not the
    ///         source of truth for the audit trail — the events are.
    mapping(uint256 => string) public complaintStatus;

    modifier onlyBackend() {
        require(msg.sender == backend, "ComplaintRegistry: caller is not the backend wallet");
        _;
    }

    /// @param _backend The wallet address the backend server will sign
    ///        transactions with. Pass the deployer's own address for
    ///        local/testnet demo simplicity, or a separate dedicated
    ///        wallet if you want deployer and backend-signer to differ.
    constructor(address _backend) {
        require(_backend != address(0), "ComplaintRegistry: backend cannot be zero address");
        backend = _backend;
        emit BackendUpdated(address(0), _backend);
    }

    /// @notice Records a status transition for a complaint and emits the
    ///         event that becomes the public, timestamped audit record.
    /// @param complaintId The complaint's id, matching the backend DB id.
    /// @param newStatus The status being moved to.
    function logEvent(uint256 complaintId, string calldata newStatus) external onlyBackend {
        string memory oldStatus = complaintStatus[complaintId];
        complaintStatus[complaintId] = newStatus;
        emit StatusChanged(complaintId, oldStatus, newStatus, block.timestamp);
    }

    /// @notice Lets the current backend wallet hand off to a new one
    ///         (e.g. if you redeploy the backend with a new wallet).
    ///         Optional for the MVP demo, but cheap safety to have.
    function setBackend(address newBackend) external onlyBackend {
        require(newBackend != address(0), "ComplaintRegistry: backend cannot be zero address");
        emit BackendUpdated(backend, newBackend);
        backend = newBackend;
    }
}

// ---------------------------------------------------------------------
// SYNC POINT (do not fabricate the other side of this):
// backend/services/blockchain_client.py on feature/backend-ai needs to
// call logEvent() using the SAME wallet address passed into this
// contract's constructor as `_backend`. That file doesn't exist yet on
// your machine — you and the backend/AI teammate need to agree on:
//   1. which wallet's private key the backend will sign with
//   2. where the ABI (artifacts/contracts/ComplaintRegistry.sol/
//      ComplaintRegistry.json after compiling) gets copied to so the
//      backend can import it
// This is the Day 2 afternoon "pair with Member 2" task from the plan —
// I'm flagging it rather than guessing what their backend code looks like.
// ---------------------------------------------------------------------

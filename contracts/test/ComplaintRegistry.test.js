const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

// Day 1 midday: "Local test: call logEvent, read the event back"
// Day 2 midday: "Unauthorized calls revert as expected in a test"
describe("ComplaintRegistry", function () {
  let registry;
  let backend;
  let stranger;

  beforeEach(async function () {
    [backend, stranger] = await ethers.getSigners();

    const ComplaintRegistry = await ethers.getContractFactory("ComplaintRegistry");
    registry = await ComplaintRegistry.deploy(backend.address);
    await registry.waitForDeployment();
  });

  it("sets the deployer-provided address as backend", async function () {
    expect(await registry.backend()).to.equal(backend.address);
  });

  it("lets the backend wallet log a status change and emits StatusChanged", async function () {
    const complaintId = 1;

    await expect(registry.connect(backend).logEvent(complaintId, "SUBMITTED"))
      .to.emit(registry, "StatusChanged")
      .withArgs(complaintId, "", "SUBMITTED", anyValue);

    expect(await registry.complaintStatus(complaintId)).to.equal("SUBMITTED");
  });

  it("records the old status alongside the new one on the next transition", async function () {
    const complaintId = 2;

    await registry.connect(backend).logEvent(complaintId, "SUBMITTED");

    await expect(registry.connect(backend).logEvent(complaintId, "IN_PROGRESS"))
      .to.emit(registry, "StatusChanged")
      .withArgs(complaintId, "SUBMITTED", "IN_PROGRESS", anyValue);

    expect(await registry.complaintStatus(complaintId)).to.equal("IN_PROGRESS");
  });

  it("reverts when a non-backend wallet calls logEvent", async function () {
    await expect(
      registry.connect(stranger).logEvent(3, "SUBMITTED")
    ).to.be.revertedWith("ComplaintRegistry: caller is not the backend wallet");
  });

  it("reverts when a non-backend wallet calls setBackend", async function () {
    await expect(
      registry.connect(stranger).setBackend(stranger.address)
    ).to.be.revertedWith("ComplaintRegistry: caller is not the backend wallet");
  });

  it("lets the backend wallet hand off to a new backend wallet", async function () {
    await registry.connect(backend).setBackend(stranger.address);
    expect(await registry.backend()).to.equal(stranger.address);

    // old backend wallet can no longer log events after handoff
    await expect(
      registry.connect(backend).logEvent(4, "SUBMITTED")
    ).to.be.revertedWith("ComplaintRegistry: caller is not the backend wallet");
  });
});


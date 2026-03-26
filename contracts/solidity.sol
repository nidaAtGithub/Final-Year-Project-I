// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FIRRegistry {

    struct FIRMeta {
        string referenceId;
        string ipfsCid;            // Encrypted FIR JSON CID
        string[] evidenceCids;     // Evidence file CIDs
        uint256 timestamp;
        address submittedBy;
    }

    FIRMeta[] public firs;

    event FIRSubmitted(
        string referenceId,
        string ipfsCid,
        string[] evidenceCids,
        address submittedBy,
        uint256 timestamp
    );

    function submitFIR(
        string memory _referenceId,
        string memory _ipfsCid,
        string[] memory _evidenceCids
    ) public {

        firs.push(FIRMeta({
            referenceId: _referenceId,
            ipfsCid: _ipfsCid,
            evidenceCids: _evidenceCids,
            timestamp: block.timestamp,
            submittedBy: msg.sender
        }));

        emit FIRSubmitted(
            _referenceId,
            _ipfsCid,
            _evidenceCids,
            msg.sender,
            block.timestamp
        );
    }

    function getFIR(uint256 index) public view returns (
        string memory referenceId,
        string memory ipfsCid,
        string[] memory evidenceCids,
        uint256 timestamp,
        address submittedBy
    ) {
        FIRMeta memory fir = firs[index];
        return (
            fir.referenceId,
            fir.ipfsCid,
            fir.evidenceCids,
            fir.timestamp,
            fir.submittedBy
        );
    }

    function totalFIRs() public view returns (uint256) {
        return firs.length;
    }
}
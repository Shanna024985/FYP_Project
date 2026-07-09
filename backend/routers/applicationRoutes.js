const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");

router.get("/overview", applicationController.getResponseDetailsByStage, applicationController.getActiveCandidatesByJobId, applicationController.getAwaitingResponsesByJobId);
router.get("/active", applicationController.getActiveCandidatesByJobId);
router.get("/awaiting", applicationController.getAwaitingResponsesByJobId);
router.get("/active/:name", applicationController.getActiveCandidatesByJobIdAndName);
router.get("/awaiting/:name", applicationController.getAwaitingResponsesByJobIdAndName);

router.get("/", applicationController.getResponsesByJobId);

module.exports = router;
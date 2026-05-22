const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");

router.get("/overview", applicationController.getResponseDetailsByStage, applicationController.getActiveCandidatesById);
router.get("/active", applicationController.getActiveCandidatesById);
router.get("/awaiting", applicationController.getAwaitingResponsesById);
router.get("/active/:name", applicationController.getActiveCandidatesByIdAndName);
router.get("/awaiting/:name", applicationController.getAwaitingResponsesByIdAndName);
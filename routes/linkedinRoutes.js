const express = require("express");
const router = express.Router();
const {
    redirectToLinkedIn,
    handleLinkedInCallback,
} = require("../controllers/linkedinController");

router.get("/linkedin", redirectToLinkedIn);
router.get("/linkedin/callback", handleLinkedInCallback);

module.exports = router;

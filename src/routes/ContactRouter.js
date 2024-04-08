const express = require("express");
const router = express.Router();
const contactController = require("../controllers/ContactController");
const {
  authUserMiddleWare,
  authMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.post("/create", contactController.createContact);
router.get("/get-all-contact", contactController.getAllContacts);
router.get("/get-contact-details/:id", contactController.getContactDetails);
router.put(
  "/update-contact/:id",
  authMiddleWare,
  contactController.updateContact
);
router.delete("/delete/:id", contactController.deleteContact);
module.exports = router;

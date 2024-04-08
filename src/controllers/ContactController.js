const ContactService = require("../services/ContactService");
const JwtService = require("../services/JwtService");

const createContact = async (req, res) => {
  try {
    const { name, email, phone, message, isExplain } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await ContactService.createContact(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const response = await ContactService.getAllContacts();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getContactDetails = async (req, res) => {
  try {
    const contactId = req.params.id;
    if (!contactId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await ContactService.getContactDetails(contactId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const data = req.body;
    if (!contactId) {
      return res.status(200).json({
        status: "ERR",
        message: "The orderId is required",
      });
    }
    const response = await ContactService.updateContact(contactId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    if (!contactId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await ContactService.deleteContact(contactId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  createContact,
  getAllContacts,
  getContactDetails,
  updateContact,
  deleteContact,
};

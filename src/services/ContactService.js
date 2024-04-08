const Contact = require("../models/ContactModel");
// const bcrypt = require("bcrypt");
const EmailService = require("./EmailService");
const createContact = (newContact) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, phone, message, isExplain, user } = newContact;
    try {
      const existingContact = await Contact.findOne({ name: name });
      if (!existingContact) {
        const createContact = await Contact.create({
          name,
          email,
          phone,
          message,
          isExplain,
          user,
        });
        if (createContact) {
          resolve({
            status: "OK",
            message: "success",
            data: createContact,
          });
        }
      } else {
        // Xử lý trường hợp đã tồn tại liên hệ với cùng một name
        const timeDate = Date.now();
        const date = new Date(timeDate);
        const uniqueName = `${name}-${date}`;
        const createContact = await Contact.create({
          name: uniqueName,
          email,
          phone,
          message,
          isExplain,
          user,
        });
        if (createContact) {
          resolve({
            status: "OK",
            message: "success",
            data: createContact,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
const getAllContacts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const contact = await Contact.find();
      if (contact === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESSS",
        data: contact,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getContactDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contact = await Contact.findById({
        _id: id,
      });
      if (contact === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "success",
        data: contact,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateContact = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkContact = await Contact.findOne({
        _id: id,
      });
      if (checkContact === null) {
        resolve({
          status: "OK",
          message: "The order is not defined",
        });
      }
      const updateContact = await Contact.findByIdAndUpdate(id, data, {
        new: true,
      });

      resolve({
        status: "OK",
        message: "success",
        data: updateContact,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteContact = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkContact = await Contact.findOne({
        _id: id,
      });
      if (checkContact === null) {
        resolve({
          status: "OK",
          message: "The product is not defined",
        });
      }
      await Contact.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createContact,
  getAllContacts,
  getContactDetails,
  updateContact,
  deleteContact,
};

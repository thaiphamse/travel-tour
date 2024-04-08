const EvaluateService = require("../services/EvaluateService");
const JwtService = require("../services/JwtService");

const createEvaluate = async (req, res) => {
  try {
    const { name, avatar, description, rating } = req.body;
    if (!description || !name || !avatar || !rating) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await EvaluateService.createEvaluate(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllEvaluateDetails = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await EvaluateService.getAllEvaluateDetails(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteEvaluate = async (req, res) => {
  try {
    const evaluateId = req.params.id;
    if (!evaluateId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await EvaluateService.deleteEvaluate(evaluateId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createEvaluate,
  getAllEvaluateDetails,
  deleteEvaluate,
};

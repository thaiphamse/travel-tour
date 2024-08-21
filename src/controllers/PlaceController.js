const PlaceService = require("../services/PlaceService");
const JwtService = require("../services/JwtService");

const createPlace = (req, res) => {
  try {
    const {
      name,
      description,
      addressString,
      provinceId,
      districtId } = req.body;
    if (!name ||
      !description ||
      !addressString ||
      !provinceId ||
      !districtId) {
      return res.status(200).json({
        status: "error",
        message: "The input is required",
        data: {}
      });
    }
    PlaceService.createPlace(req.body)
      .then(response => {
        return res.status(200).json({
          status: "OK",
          message: "Success",
          data: response
        })
      })
      .catch(err => {
        return res.status(500).json({
          message: err,
        });
      })
  } catch (e) {
    return res.status(500).json({
      message: e,
    });
  }
};

const updatePlace = (req, res) => {
  try {
    const id = req.params.id || null
    const {
      name,
      description,
      addressString,
      provinceId,
      districtId } = req.body;
    if (!name ||
      !description ||
      !addressString ||
      !provinceId ||
      !districtId || !id) {
      return res.status(200).json({
        status: "error",
        message: "The input is required",
        data: {}
      });
    }
    PlaceService.updatePlace(id, req.body)
      .then(response => {
        return res.status(200).json({
          status: "OK",
          message: "Success",
          data: response
        })
      })
      .catch(err => {
        return res.status(500).json({
          message: err,
        });
      })
  } catch (e) {
    return res.status(500).json({
      message: e,
    });
  }
};
const deletePlace = (req, res) => {
  try {
    const id = req.params.id || null

    if (!id) {
      return res.status(200).json({
        status: "error",
        message: "The input is required",
        data: {}
      });
    }
    PlaceService.deletePlace(id,)
      .then(response => {
        return res.status(200).json({
          status: "OK",
          message: "Success",
          data: response
        })
      })
      .catch(err => {
        return res.status(404).json({
          message: err,
        });
      })
  } catch (e) {
    return res.status(500).json({
      message: e,
    });
  }
};
module.exports = {
  createPlace,
  updatePlace,
  deletePlace
};

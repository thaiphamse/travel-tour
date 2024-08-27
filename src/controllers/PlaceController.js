const PlaceService = require("../services/PlaceService");
const JwtService = require("../services/JwtService");

const createPlace = (req, res) => {
  try {
    const {
      name,
      title,
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
        status: "ERROR",
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
          status: "ERROR",
          message: err.message,
        });
      })
  } catch (e) {
    return res.status(500).json({
      status: "ERROR",
      message: e.message,
    });
  }
};

const updatePlace = (req, res) => {
  try {
    const id = req.params.id || null
    const {
      name,
      title,
      description,
      addressString,
      provinceId,
      districtId } = req.body;
    if (!name || !title ||
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
const getAllPlace = (req, res) => {
  try {
    const id = req.params.id || null
    const query = req.query || null

    PlaceService.getAllPlace({ id, query })
      .then(response => {
        return res.status(200).json(response)
      })
      .catch(err => {
        return res.status(404).json({
          message: err,
        });
      })
  } catch (e) {
    return res.status(500).json({
      status: "error",
      message: e,
    });
  }
};
const getOnePlace = (req, res) => {
  try {
    const idPlace = req.params.id || null
    if (!idPlace) {
      return res.status(200).json({
        status: "error",
        message: "The input is required",
        data: {}
      });
    }
    PlaceService.getOnePlace(idPlace)
      .then(response => {
        res.status(200).json(response)
      })
      .catch(err => res.status(500).json(err))
  } catch (error) {

  }
}
module.exports = {
  createPlace,
  updatePlace,
  deletePlace,
  getAllPlace,
  getOnePlace
};

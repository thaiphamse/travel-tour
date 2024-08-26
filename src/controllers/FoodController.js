
const foodService = require("../services/FoodService");

const createFood = (req, res) => {
  try {
    const {
      name,
      title,
      description,
    } = req.body;
    if (!name || !title || !description) {
      return res.status(200).json({
        status: "ERROR",
        message: "The input is required",
        data: {}
      });
    }
    foodService.createFood(req.body)
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

const updateFood = (req, res) => {
  try {
    const id = req.params.id || null
    const {
      name,
      title,
      description } = req.body
    if (!name || !title ||
      !description ||
      !id) {
      return res.status(200).json({
        status: "ERROR",
        message: "The input is required",
        data: {}
      });
    }
    foodService.updateFood(id, req.body)
      .then(response => {
        return res.status(200).json({
          status: "OK",
          message: "Success",
          data: response
        })
      })
      .catch(err => {
        return res.status(500).json({
          message: err.message,
        });
      })
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};
const deleteFood = (req, res) => {
  try {
    const id = req.params.id || null

    if (!id) {
      return res.status(200).json({
        status: "error",
        message: "The input is required",
        data: {}
      });
    }
    foodService.deleteFood(id)
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
const getAllFood = (req, res) => {
  try {
    const id = req.params.id || null
    const query = req.query || null

    foodService.getAllFood({ id, query })
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
    const idPlace = req.query.id || null
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
  createFood,
  updateFood,
  deleteFood,
  getAllFood,
  // getOnePlace
};

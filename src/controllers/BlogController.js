const blogService = require("../services/BlogService");
const JwtService = require("../services/JwtService");

const createBlog = (req, res) => {
  try {
    const {
      name,
      description,
      addressString,
      provinceId
    } = req.body;
    if (!name ||
      !description
    ) {
      return res.status(200).json({
        status: "ERROR",
        message: "The input is required",
        data: {}
      });
    }
    blogService.createBlog(req.body)
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

const updateBlog = (req, res) => {
  try {
    const id = req.params.id || null

    if (!id) {
      return res.status(200).json({
        status: "ERROR",
        message: "The id is required",
        data: {}
      });
    }
    blogService.updateBlog(id, req.body)
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
const deleteBlog = (req, res) => {
  try {
    const id = req.params.id || null

    if (!id) {
      return res.status(200).json({
        status: "ERROR",
        message: "The input is required",
        data: {}
      });
    }
    blogService.deleteBlog(id,)
      .then(response => {
        return res.status(200).json({
          status: "OK",
          message: "Success",
          data: response
        })
      })
      .catch(err => {
        return res.status(404).json({
          status: "ERROR",
          message: err.message,
        });
      })
  } catch (e) {
    return res.status(500).json({
      status: "ERROR",
      message: e,
    });
  }
};
const getAllBlog = (req, res) => {
  try {
    const id = req.params.id || null
    const query = req.query || null

    blogService.getAllBlog({ id, query })
      .then(response => {
        return res.status(200).json(response)
      })
      .catch(err => {
        return res.status(404).json({
          status: "ERROR",
          message: err.message,
        });
      })
  } catch (e) {
    return res.status(500).json({
      status: "ERROR",
      message: e,
    });
  }
};
const getOneBlog = (req, res) => {
  try {
    const idPlace = req.params.id || null
    if (!idPlace) {
      return res.status(200).json({
        status: "ERROR",
        message: "The input is required",
        data: {}
      });
    }

    blogService.getOneBlog(idPlace)
      .then(response => {
        res.status(200).json(response)
      })
      .catch(err => res.status(500).json(err))
  } catch (err) {
    return res.status(200).json({
      status: "ERROR",
      message: err,
    });
  }
}
module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlog,
  getOneBlog
};

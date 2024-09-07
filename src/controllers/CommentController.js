
const commentService = require('../services/CommentService')
const createComment = async (req, res, next) => {
    try {
        let comment = await commentService.createComment(req.body)
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            data: comment
        })
    } catch (error) {
        console.error(error.message)
        next(error)
    }
}

const getOne = async (req, res, next) => {
    try {
        let comment = await commentService.getOne(req.params)
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            data: comment
        })
    } catch (error) {
        console.error(error.message)
        next(error)
    }
}
module.exports = {
    createComment,
    getOne
}
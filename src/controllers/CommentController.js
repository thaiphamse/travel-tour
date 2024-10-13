
const commentService = require('../services/CommentService')
const jwtService = require('../services/JwtService')
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

const getAll = async (req, res, next) => {
    try {
        let comments = await commentService.getAll(req.query)
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            total: comments.total,
            currentPage: comments.currentPage,
            totalPage: comments.totalPage,
            sortBy: comments.sortBy,
            sort: comments.sort,
            limit: parseInt(comments.limit),
            countThisPage: comments.comments.length,
            data: comments.comments
        })
    } catch (error) {
        console.error(error.message)
        next(error)
    }
}
const deleteOne = async (req, res, next) => {
    try {
        let comment = await commentService.deleteOne(req.params)
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
const adminReply = async (req, res, next) => {
    try {
        const token = req.headers?.token?.split("Bearer ")[1];

        const adminPayload = jwtService.getPayloadFromToken(token)
        const adminId = adminPayload?.id
        let commentRs = await commentService.adminReply(req.params, req.body, adminId)
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            data: commentRs
        })
    } catch (error) {
        console.error(error.message)
        next(error)
    }
}
module.exports = {
    createComment,
    getOne,
    getAll,
    deleteOne,
    adminReply
}
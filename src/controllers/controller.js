const AuthorModel = require("../models/authorModel");
const moment = require("moment")
const BlogModel = require("../models/blogModel");

// 1st

const createAuthors = async function (req, res) {
    try {
        let data = req.body;
        if (data.firstName === undefined || data.lastName === undefined || data.title === undefined || data.password === undefined || data.email ===undefined) {
            return res.status(400).send({ status: false, msg: "Mandatory field missing" })
        }
        let savedDate = await AuthorModel.create(data)

        res.status(201).send({ status: true, msg:savedDate })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}


module.exports.createAuthors = createAuthors;

// 2nd

const createBlogs = async function (req, res) {
    try {
        let data = req.body;
        let condition = await AuthorModel.findById(data.authorId)
        if (condition) {
            if (data.isPublished == true) {
                data.publishedAt = Date.now()
                let savedDate = await BlogModel.create(data)
                res.status(201).send({ msg: savedDate })
            }
            else if (data.isPublished == false) {
                let savedDate = await BlogModel.create(data)
                res.status(201).send({ msg: savedDate })
            }
            else {
                res.status(400).send({ status: false, msg: "author id is not present" })
            }
        }
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.createBlogs = createBlogs;


// 3rd

const getBlogs = async function (req, res) {
    try {
        req.query.isDeleted = false
        req.query.isPublished = true
    
        let filter = await BlogModel.find(req.query).populate("authorId");
        if (!filter.length)
            return res.status(404).send({ status: false, msg: "No such documents found." })
             
        res.status(200).send({ status: true, data: getData })
    }

    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }
}
module.exports.getBlogs = getBlogs;

// 4th
const updateBlogs = async function (req, res) {
    try {
        let Id = req.params.blogId
        console.log(Id)
        if (Id.match()) {

            let user = await BlogModel.findById(Id)
            console.log(user)
            if (!user) {
                return res.status(404).send({ staus: false, msg: "No such blog exists" });
            }
            let date = moment().format('YYYY-MM-DD HH:MM:SS')
            let userData = req.body;
            if (Object.keys(userData).length != 0) {
                let updatedUser = await BlogModel.findByIdAndUpdate({ _id: Id }, userData, { publishedAt: date })

                return res.status(200).send({ status: true, data: updatedUser });
            }

            else res.status(400).send({ msg: "BAD REQUEST" })
        }
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
};
module.exports.updateBlogs = updateBlogs;

// 5th

const validateBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        let validateblogId = await BlogModel.find({ _id: blogId, isDeleted: false })

        if (!validateblogId) {
            return res.status(404).send({ status: false, msg: "BlogId does not exist." })
        }
        let updatedBlog = await BlogModel.findByIdAndUpdate({ _id: blogId }, { $set: { isDeleted: true } }, { deletedAt: Date.now() })
        res.status(200).send({ msg: "Successfully updated." })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }
};
module.exports.validateBlog = validateBlog;


// 6th
const deleteBlog = async function (req, res) {
    try {
        let data = req.query
        if (Object.keys(data) === 0)

            return res.status(400).send({ status: false, msg: "input missing" })

        let deleted = await BlogModel.updateMany({
            $and: [data, { ispublised: false }]
        }, { isDeleted: true, deletedAt: Date.now() }, { new: true }
        );

        if (!deleted)
            return res.staus(404).send({ status: false, msg: "Blog not found" });
        return res.status(200).send({ status: true, data: deleted });


    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}
module.exports.deleteBlog = deleteBlog;


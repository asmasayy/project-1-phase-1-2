const AuthorModel = require("../models/authorModel");

const BlogModel = require("../models/blogModel");

// 1st

const createAuthors = async function (req, res) {
    // let validateEmail= async function isEmailValid(email) {
    //     if (!email)
    //         return false;

    //     if (email.length > 200)
    //         return false;}
    let a = req.body;
    if (a.firstName === undefined || a.lastName === undefined || a.title === undefined || a.password === undefined) {
        return res.send({ status: false, msg: "Mandatory field missing" })
    }


    let savedDate = await AuthorModel.create(a)
    res.send({ status: true, savedDate })

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
        res.status(200).send({ status: true, data: filter })
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

                return res.status(201).send({ status: true, data: updatedUser });
            }

            else res.status(400).send({ msg: "BAD REQUEST" })
        }
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
};
module.exports.updateBlogs=updateBlogs;

// 5th

const validateBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        let validateblogId = await BlogModel.findOne({ _id: blogId, isDeleted: false })

        if (!validateblogId) {
            return res.status(404).send({ status: false, msg: "BlogId does not exist." })
        }
        let updatedBlog = await BlogModel.findByIdAndUpdate({ _id: blogId }, { $set: { isDeleted: true } })
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
        let category = req.query.category
        let authorId = req.query.authorId
        let tag = req.query.tag
        let subcategory = req.query.subcategory
        let published = req.query.isPublished

        let Data = await BlogModel.find({
            $in: [{ category: category }, { authorId: authorId },
            { subcategory: subcategory }, { published: published }, { tags: tag }]
        })

        if (Data) {

            let deleteData = await BlogModel.updateMany({ isDeleted: false })

            res.status(200).send({ status: true, data: deleteData });

        }
        else {
            return res.status(400).send({ msg: "page not found." })
        }
    }
    catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
};

module.exports.deleteBlog = deleteBlog;
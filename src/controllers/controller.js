const AuthorModel = require("../models/authorModel");
const moment = require("moment")
const BlogModel = require("../models/blogModel");
const { query } = require("express");

// 1st

const createAuthors = async function (req, res) {
    try {
        let data = req.body;
        if (data.firstName === undefined || data.lastName === undefined || data.title === undefined || data.password === undefined || data.email === undefined) {
            return res.status(400).send({ status: false, msg: "Mandatory field missing" })
        }
        let savedDate = await AuthorModel.create(data)

        res.status(201).send({ status: true, msg: savedDate })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}


module.exports.createAuthors = createAuthors;

// 2nd

const createBlogs = async function (req, res) {
    try {
        let data = req.body.authorId
        if (!data) {
            return res.status(400).send({ status: false, msg: "First Add Author-Id In Body" });
        }
        // Make sure the authorId is a valid authorId by checking the author exist in the authors collection.
        let authorid = await AuthorModel.findById(data);
        if (!authorid) {
            return res.status(400).send({ status: false, msg: "Plz Enter Valid Author Id" });
        }
        // Create a blog document from request body.
        let createblogs = await BlogModel.create(req.body);
        // Return HTTP status 201 on a succesful blog creation. Also return the blog document. The response should be a JSON object
        res.status(201).send({ createblogs });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}
// 
module.exports.createBlogs = createBlogs;


// 3rd

const getBlogs = async function (req, res) {
    try {
        req.query.isDeleted = false
        req.query.isPublished = true

        // here we are checking query validation
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

            let userData = req.body;
            if (Object.keys(userData).length != 0) {
                let updBlog = await BlogModel.findByIdAndUpdate({ _id: Id }, userData)

                if (updBlog.isPublished == true) {
                    updBlog.publishedAt = new Date();
                }
                if (updBlog.isPublished == false) {
                    updBlog.publishedAt = null;
                }

                return res.status(201).send({ status: true, data: updBlog });
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


//6

const deleteBlogsByQuery = async function (req, res) {
    try {
        let data = req.query;

        let query = {
            isDeleted: false
        };

        if (Object.keys(data).length == 0) {

            return res.status(400).send({
                status: false,
                msg: "no query params available "
            });
        } else {

            if (data.tags) {
                data.tags = {
                    $in: data.tags
                };
            }


            if (data.subcategory) {
                data.subcategory = {
                    $in: data.subcategory
                };
            }


            query["$or"] = [{
                authorId: data.authorId
            },
            {
                tags: data.tags
            },
            {
                category: data.category
            },
            {
                subcategory: data.subcategory
            }
            ];
        }


        const available = await BlogModel.find(query).count();
        if (available == 0) {
            return res.status(404).send({
                status: false,
                msg: "query data not found"
            });
        }


        const deleteData = await BlogModel.updateMany(query, {
            $set: {
                isDeleted: true
            }
        });
        res.status(200).send({
            status: true,
            msg: deleteData
        });

    } catch (error) {
        res.status(500).send({
            status: false,
            msg: error.message
        });
    }
};

module.exports.deleteBlogsByQuery = deleteBlogsByQuery;



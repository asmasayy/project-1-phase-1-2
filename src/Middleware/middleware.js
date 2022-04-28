const jwt = require("jsonwebtoken")
const BlogModel = require("../models/blogModel")

const authentication = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key'] || req.headers['X-Api-Key']

        if (!token) {
            res.status(401).send({ status: false, msg: "token must be present" })
        }

        let decodedToken = jwt.verify(token, "bloggers point")
        if (!decodedToken) {
            res.status(401).send({ status: false, msg: "token is invalid" })
        }
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }


    next()
}

const authUser = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key'] || req.headers['X-Api-Key']

        let decodedToken = jwt.verify(token, "bloggers point")
        console.log(decodedToken.userId)

        let bloggId = await BlogModel.findById({ _id: decodedToken.userId })
        console.log(bloggId)
        if(!bloggId){
            return res.send({status:true,msg:"Unauthorised access"})
        }

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
    next()
}

module.exports = { authentication, authUser }
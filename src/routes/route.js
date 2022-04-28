const express = require("express");
const router = express.Router();
const allControllers = require("../controllers/controller");


router.get("/test-me", function(req , res){
    res.send("Let's start!!!")
});

router.post("/createAuthor",allControllers.createAuthors);

router.post("/createBlog",allControllers.createBlogs);

router.get("/blogs",allControllers.getBlogs);

router.put("/blogs/:blogId",allControllers.updateBlogs);

router.delete("/blogs/:blogId",allControllers.validateBlog);

router.delete("/Blogs",allControllers.deleteBlogsByQuery);

router.post("/login", allControllers.login)




module.exports = router;


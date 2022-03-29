const express = require("express");
const router = express.Router();

router.get("/", (req, res)=>{  
    const urls = [
        {origin: "www.google.com", shortURL: "blah1"},
        {origin: "www.facebook.com", shortURL: "blah2"},
        {origin: "www.twitter.com", shortURL: "blah3"},
        {origin: "www.instagram.com", shortURL: "blah4"}, 
    ]
        res.render("home" , {urls: urls});
    });

 module.exports=router;   
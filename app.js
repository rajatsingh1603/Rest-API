const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const { urlencoded } = require("body-parser");

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//setting up mongodb

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

//creating new schema 

const articleSchema = {
    title: String,
    content: String
};

//creating model 

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

.get(function(req,res){
    Article.find(function(err,foundArticles){
        if(!err){
            res.send(foundArticles);
        }
        else{
            res.send(err);
        }
        
    });
})

.post(function(req,res){
    console.log();
    console.log();

    //creating the new collection sent by user in our database 
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully saved")
        }else{
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Deleted Successfully")
        }else{
            res.send(err);
        }
    });
});

//getting a specific request from the user

app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
        if(foundArticle){
            res.send(foundArticle)
        }else{
            res.send("This article doesn't exist in our server");
        }
    })
})

.put(function(req,res){
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Successfully updated article");
            }
        }
    )
})

.patch(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Sucessfully updated the selected one")
            }else{
                res.send(err);
            }
        }
    )
})

.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Deleted successfully")
            }else{
                res.send(err);
            }
        }
    );
});













app.listen(3000,function(){
    console.log("Your server is started on port 3000")
});
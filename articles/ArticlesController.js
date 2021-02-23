const express = require('express');
const router = express.Router();
const Category = require("../categories/CategoryModel");
const Article = require("./ArticleModel");
const slugify = require("slugify"); 
const adminAuth = require("../middlewares/adminAuth")


router.get("/admin/articles/index",adminAuth, (req,res)=>{

    Article.findAll({
        order:[
            ['id','DESC']
        ],
        include: [{model:Category}]
    }).then(articles => {
      res.render("admin/articles/index",{articles: articles})
    })
});

router.get("/admin/articles/new", (req,res)=>{
    Category.findAll().then(categories =>{
        res.render("admin/articles/new",{categories:categories})
    })
 
});

router.post("/articles/save",(req,res)=>{
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(()=>{
        res.redirect("/admin/articles/index");
    })

});

router.post("/articles/delete", (req,res)=>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() =>{
                res.redirect("/admin/articles/index");
            });
        }else{//se não for um número
            res.redirect("/admin/articles/index");
        }
    }else{//se for Null
        res.redirect("/admin/articles/index");
    }
});

router.get("/admin/articles/update/:id", (req, res) => {
    var id =  req.params.id;
        Article.findByPk(id).then(article => {
            if(article != undefined){
                Category.findAll().then(categories =>{
                    res.render("admin/articles/update", {article:article,categories: categories})
                });
               
            }else{
                res.redirect("/partials/index");
            }
        }).catch(err => {
            res.redirect("/partials/index");
        });
      
    });

    router.post("/articles/update", (req, res) =>{
        var id = req.body.id;
        var title = req.body.title;
        var body = req.body.body;
        category = req.body.category

        Article.update({title:title, body:body, categoryId: category, slug:slugify(title)}, {
            where:{
                id:id
            }
        }).then(() =>{
            res.redirect("/admin/articles/index");
        }).catch( err =>{
            res.redirect("./partials/index");
        });
    });

    router.get("/articles/page/:num", (req,res) => {
        var page = req.params.num;
        var offset = 0;

        if(isNaN(page) || page == 1 ){
            offset = 0;
        }
        else{
            offset = (parseInt(page) - 1) * 2;
        }

        Article.findAndCountAll({
            limit: 2,
            offset: offset
        }).then(articles =>{

            var next;

            if(offset + 2 > articles.count){
                next = false;
            }else{
                next = true;
            }

            var result = {
                page: parseInt(page),
                next : next,
                articles: articles
            }


            // res.json(result);
            Category.findAll().then(categories =>{
                res.render("admin/articles/page",{result:result, categories:categories});
            })
        })
    });

module.exports = router;
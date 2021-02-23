const express = require("express");
const router = express.Router();
const Category = require("./CategoryModel");
const slugify = require("slugify");

router.get("/admin/categories/new",(req,res)=>{
    res.render("admin/categories/new");
})

router.post("/categories/save",(req,res)=>{
    var title = req.body.title;
    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(()=>{
            res.redirect("/admin/categories/index")
        })
    }else{
        res.redirect("/admin/categories/new")
    }

})

router.post("/categories/delete",(req,res)=>{
    var id = req.body.id;
    if(id != undefined){
        if(id != NaN){

            Category.destroy({
                where:{
                    id: id
                }
            }).then(()=>{
                res.redirect("/admin/categories/index")
            })
    }else{
        res.redirect("/admin/categories/index");
    }
 } else{
        res.redirect("/admin/categories/index")
    }
})

router.get("/admin/categories/update/:id",(req,res)=>{
    var id = req.params.id;
        if(isNaN(id)){
            console.log("o id nao esta vindo como numero");
            res.redirect("/admin/categories/index");
        }

    Category.findByPk(id).then(category =>{
        if(category != undefined){
            res.render("admin/categories/update",{category: category});
        }else{
            console.log("o id categoria nao esta definido");
            res.redirect("/admin/categories/index");
        }
    }).catch(erro =>{
        console.log(erro);
        res.redirect("/admin/categories/index");
    })
    
});

router.post("/categories/update",(req,res)=>{
    var id = req.body.id;
    var title = req.body.title;

    if(title != undefined){
        Category.update({title: title, slug: slugify(title)},{
            where:{
                id:id
            }
        }
           
        ).then(()=>{
            res.redirect("/admin/categories/index");
        })
    }else{
        console.log("nao atualizou sem o id");
        res.redirect("/admin/categories/new");
    }
});

router.get("/admin/categories/index",(req,res)=>{

    Category.findAll().then(categories =>{
        res.render("admin/categories/index",{categories:categories});
    });
});

module.exports = router;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");

const Article = require("./articles/ArticleModel");
const Category = require("./categories/CategoryModel");



const { get } = require("./categories/CategoriesController");
const router = require("./categories/CategoriesController");

//View Engine - mecanismo de criação das páginas html
app.set('view engine', 'ejs');


//Sessions
app.use(session({
    secret: "qualquercoisa", cookie: { maxAge: 3000000 }
}));

//Redis   - storage para salvamento de sessões - focado em salvamento de sessões

//BodyParser - utilizado para obter dados de formulários html
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static - utilizado para trabalhar com arquivos estáticos tipo css / imagens etc
app.use(express.static('public'));              //...arquivos na pasta 'public' do projeto


//Database - fazendo a conexão através de uma promisse
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso!");
    }).catch((error) => {
        console.log(error);
    })

//....Rotas  - arquivos na pasta view

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);


// app.get("/session",(req,res) =>{
//     req.session.treinamento
//     req.session.ano = 2021
//     req.session.email = "ale@ale.com"
//     req.session.user = {
//         usernarme: "ale",
//         email: "email@email.com",
//         id: 10
//     }
//     res.send("Sessão gerada !")
// });

// app.get("/leitura",(req,res)=>{
//     res.json({
//         treinamento: req.session.treinamento, 
//         ano: req.session.ano,
//         user: req.session.user
//     })
 
// });

// app.get("/", (req, res) => {
//     Article.findAll({
//         limit: 4,
//         order: [
//                 ['id', 'DESC']
//                ]
//     }).then(articles => {
       
//         Category.findAll().then(categories => {
//             res.render("./partials/index", { articles: articles, categories: categories });
            
//         })
       
//     });

// })

app.get("/", (req,res) => {

    router.get("admin/page/:num", (req,res) =>{
        res.redirect("/page/:num");
    })
    var page = req.params.num;
    var offset = 0;

    if(isNaN(page) || page == 1 ){
        offset = 0;
    }
    else{
        offset = (parseInt(page) - 1) * 2;
    }

    Article.findAndCountAll({
        limit: 5,
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

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("./partials/articles", { article: article, categories: categories });
            });

        } else {
            res.redirect("./admin/partials/index");
        }
    }).catch(err => {
        res.redirect("./admin/categories/index");
    })
})


app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        }, 
        include:[{model: Article}]
    }).then( category => {
        if (category != undefined){            
            Category.findAll().then(categories => {
                res.render("./partials/index",{articles: category.articles, categories: categories});
            });
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
})

//Porta do servidor
// app.listen(4000, () => {
//    console.log("O Servidor está rodando!");
// })

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Umbler listening on port %s', port);
});
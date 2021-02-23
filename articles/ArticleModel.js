const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/CategoryModel");

const Article = connection.define('articles',{
    title:{
        type:Sequelize.STRING,
        allowNull: false
    },slug:{
        type:Sequelize.STRING,
        allowNull: false
    
    },
    body:{
        type:Sequelize.TEXT,
        allowNull: false
    }
})


//...........Relacionamentos do Banco de Dados

Category.hasMany(Article);    //Relacionamento 1:N
Article.belongsTo(Category); //Relacionamento 1:1 no sequelize


//Article.sync({fore: true});

module.exports = Article;
const express = require('express');
const router = express.Router();
const User = require("./UserModel");
const bcrypt = require('bcryptjs');


router.get("/admin/users/index", (req, res) => {

    User.findAll().then(users => {
        res.render("admin/users/index", { users: users });
    });
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
});


router.post("/admin/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where: { email: email }
    }).then(user => {
        if (user == undefined) {

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/authenticate");
            }).catch((err) => {
                res.redirect("admin/users/index");
            });
        } else {
             res.redirect("/login");
        }
    });
});

router.get("/login", (req, res) => {
    res.render("admin/users/login");
});

router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: { email: email } }).then(user => {
        if (email != undefined) { //se existe um usuário com esse email
            //validar senha
            var correct = bcrypt.compareSync(password, user.password);
            if (correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
               // res.json(req.session.user);
               res.redirect("/admin/users/index")
            } else {
                res.redirect("/login");
            }
        } else {
            res.redirect("/login");
        }

    });
});

router.get("/logout",(req,res)=>{
    req.session.user = undefined;
    res.redirect("/")
})

    module.exports = router;
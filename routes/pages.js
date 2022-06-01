const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/", authController.isLoggedIn, (req, res) => {
    res.render("index", {
        user: req.user
    });
});

router.get("/register", authController.isLoggedIn, (req, res) => {
    if(req.user) {
        res.redirect("/");
    } else {
        res.render("register");
    }
});

router.get("/login", authController.isLoggedIn, (req, res) => {
    if(req.user) {
        res.redirect("/");
    } else {
        res.render("login");
    }
});

router.get("/game", authController.isLoggedIn, (req, res) => {   
    if(req.user) {
        res.render("game", {
            user: req.user
        });
    } else {
        res.redirect("/login");
    }
});

router.get("/profile", authController.isLoggedIn, authController.updateProfile, (req, res) => {   
    if(req.user) {
        res.render("profile", {
            user: req.user,
            results0: req.scores[0],
            results1: req.scores[1],
            results2: req.scores[2],
            results3: req.scores[3],
            results4: req.scores[4],
            results5: req.scores[5],
            results6: req.scores[6],
            results7: req.scores[7],
            results8: req.scores[8],
            results9: req.scores[9]
        });
    } else {
        res.redirect("/login");
    }
});

router.get("/highscore", authController.isLoggedIn, authController.updateHighscore, (req, res) => {   
    if(req.user) {
        res.render("highscore", {
            results0: req.scores[0],
            results1: req.scores[1],
            results2: req.scores[2],
            results3: req.scores[3],
            results4: req.scores[4],
            results5: req.scores[5],
            results6: req.scores[6],
            results7: req.scores[7],
            results8: req.scores[8],
            results9: req.scores[9]
        });
    } else {
        res.redirect("/login");
    }
});

module.exports = router;
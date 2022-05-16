const db = require("../database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const promisify = require("util").promisify;

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).render("login", {
                message: "Please provide an email and password!"
            });
        }

        db.query("SELECT * FROM users WHERE email = ?", [email], async (error, results) => {
            console.log(results);
            if(!results[0] || !(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render("login", {
                    message: "Email or Password is incorrect!"
                });
            } else {
                const id = results[0].id;

                const token = jwt.sign({ id: id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is: " + token);
                
                const cookieOptions = {
                    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true                   
                }

                res.cookie("jwt", token, cookieOptions);
                res.status(200).redirect("/");
            }
        });

    } catch(error) {
        console.log(error);
    }
}

exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;

    //positional parameter to avoid SQL injection
    //? is the value that we want to look for in out database, specific email can be registered only once
    db.query("SELECT email FROM users WHERE email = ?", [email], async (error, results) => {
        if(error) {
            console.log(error);
        }

        if(results.length > 0) {
            return res.render("register", {
                message: "This email is already in use!"
            });
        } else if(password !== passwordConfirm) {
            return res.render("register", {
                message: "Passwords do not match!"
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query("INSERT INTO users SET ?", {name: name, email: email, password: hashedPassword}, (error, results) => {
            if(error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render("register", {
                    message: "User registered!"
                });
            }
        });

    });
}

exports.isLoggedIn = async (req, res, next) => {
        if(req.cookies.jwt && req.cookies.jwt !== "logout") {
            try {
                //1) verify the token
                const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
                console.log(decoded);

                //2) check if the user still exists
                db.query("SELECT * FROM users WHERE id = ?", [decoded.id], (error, result) => {
                    console.log(result);

                    if(!result[0]) {
                        return next();
                    }
    
                    req.user = result[0];
                    return next();
                });
            } catch (error) {
                console.log(error);
                return next();
            }
        } else {
            next();
        }
}

exports.save = async (req, res) => {
    const { score } = req.body;
    if(req.cookies.jwt && req.cookies.jwt !== "logout") {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            console.log(decoded);

            const d = new Date(Date.now()).toLocaleDateString()

            db.query("SELECT name FROM users WHERE id = ?", [decoded.id], (error, name) => {
                db.query("INSERT INTO highscore SET ?", {date: d, id: decoded.id, name: name[0].name, score: score}, async (error, results) => {
                    if(error) {
                        console.log(error);
                    } else {
                        console.log(results);
                    }
                });
            });
        } catch (error) {
            console.log(error);
        }
    }
}

exports.updateProfile = async (req, res, next) => {
    if(req.cookies.jwt && req.cookies.jwt !== "logout") {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            db.query("SELECT date, score FROM highscore WHERE ID = ? ORDER BY score DESC", [decoded.id], (error, result) => {
                req.scores = result;
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }
}

exports.updateHighscore = async (req, res, next) => {
    if(req.cookies.jwt && req.cookies.jwt !== "logout") {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            db.query("SELECT name, date, score FROM highscore ORDER BY score DESC", (error, result) => {
                req.scores = result;
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }
}

exports.logout = (req, res) => {
    res.cookie("jwt", "logout", {
        expires: new Date(Date.now() + 2*1000),
        httpOnly: true
    });
    res.status(200).redirect("/");
}
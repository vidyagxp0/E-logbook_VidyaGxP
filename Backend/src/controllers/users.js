const User = require("../models/users");
const Role = require("../models/roles");
const Site = require("../models/sites");
const Process = require("../models/processes");
const config = require("../config/config.json");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//register user
exports.signup = async (req, res) => {
    if (req.body.password === "" || undefined) {
        res.status(400).json({
            error: true,
            message: "Please provide a password!"
        })
    } else {
        let salt = await bcrypt.genSalt(10);
        let hashpass = await bcrypt.hash(req.body.password, salt);
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashpass,
            age: req.body.age,
            gender: req.body.gender
        }).then(() => {
            res.status(200).json({
                error: false,
                message: "User Registered"
            });
        }).catch((e) => {
            res.status(400).json({
                error: true,
                message: `Couldn't register User. "  + ${e}`
            })
        })
    }
}


// user login
exports.login = async (req, res) => {
    const { email, password } = req.body

    User.findOne({
        where: {
            email: email
        },
        raw: true
    }).then((data) => {
        bcrypt.compare(password, data.password, (_err, result) => {
            if (!result) {
                res.status(400).json({
                    error: true,
                    message: 'Invalid Password!'
                });
            } else {
                const token = jwt.sign({ userId: data.user_id }, config.development.JWT_SECRET, { expiresIn: '24h' });
                if (token) {
                    res.status(200).json({
                        error: false,
                        token: token
                    });
                } else {
                    res.status(400).json({
                        error: true,
                        message: 'Some unknown error'
                    });
                }
            }
        })
    }).catch((e) => {
        res.status(401).json({
            error: false,
            message: "Couldn't find User!"
        })
    })
}
const express = require("express")
const mongoose = require("mongoose")
const app = express()
const User = require("../model/user.js");
const router = express.Router()
const flash = require("connect-flash");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const {saveRedirect} = require("../middleware.js")

const userController = require("../controller/user.js")

router.get("/signup", userController.getSignupForm)

router.post("/signup", WrapAsync(userController.postUserForm))

router.get("/login", userController.getLoginForm)

router.post("/login", saveRedirect, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), WrapAsync(userController.postLoginForm))


router.get("/logout", userController.getLogout)
module.exports = router;
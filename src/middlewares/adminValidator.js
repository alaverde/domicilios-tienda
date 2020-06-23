const CustomErrorJson = require("../utils/customError");
const { body } = require("express-validator");

exports.validationMarketId= [
    body("id")
        .trim()
        .stripLow()
        .escape()
        .exists()
        .withMessage("You must provide market's id")
        .notEmpty()
        .withMessage("You must provide market's id")
];


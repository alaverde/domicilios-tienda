const CustomErrorJson = require("../utils/customError");
const { body } = require("express-validator");

exports.validationAdd = [
    body("name")
        .isEmpty()
        .withMessage("Provide product name")
        .isLength({max:5})
        .withMessage("Name exceed max length 100 characters")
        .trim()
        .stripLow()
        .escape(),
    body("unitPrice")
        .isNumeric()
        .withMessage("Unit Price must be numeric")
        .trim()
        .stripLow()
        .escape()
];
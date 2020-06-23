const CustomErrorJson = require("../utils/customError");
const { body } = require("express-validator");

exports.validationAdd = [
    body("name")
        .trim()
        .stripLow()
        .escape()
        .exists()
        .withMessage("Provide product name")
        .notEmpty()
        .withMessage("Name can't empty")
        .isLength({max:100})
        .withMessage("Name exceed max length 100 characters"),
    body("unitPrice")
        .trim()
        .stripLow()
        .escape()
        .exists()
        .withMessage("Provide unit price")
        .isNumeric()
        .withMessage("Unit Price must be numeric")
        .custom((value)=> {
            if(value <= 0)
                return Promise.reject("Unit Price can't be zero or negative");

            return value;
        }),
    body("quantity")
        .trim()
        .stripLow()
        .escape()
        .exists()
        .withMessage("Provide quantity")
        .isNumeric()
        .withMessage("Quantity must be numeric")
        .custom((value)=> {
            if(value <= 0)
                return Promise.reject("Quantity can't be zero or negative");

            return value;
        })
];

exports.validationUpdate = [
    body("id")
        .trim()
        .stripLow()
        .escape()
        .exists()
        .withMessage("You must provide id of product to update")
        .notEmpty()
        .withMessage("You must provide id  of product to update"),
    this.validationAdd
];

exports.validationGetList= [
    body("id")
        .trim()
        .stripLow()
        .escape()
        .exists()
        .withMessage("You must provide id market's user")
        .notEmpty()
        .withMessage("You must provide id market's user")
];

exports.validationId= [
    body("id")
        .trim()
        .stripLow()
        .escape()
        .exists()
        .withMessage("You must provide id of product")
        .notEmpty()
        .withMessage("You must provide id of product")
];
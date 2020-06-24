const { body } = require("express-validator");
const validator = require("../middlewares/validator");

const id = "id";
const name = "name";
const unitPrice = "unitPrice";
const quantity  ="quantity";

exports.validationAdd = [
    validator.validatorSanitizer(name),
    validator.existsValidator(name, "of product"),
    body(name)
        .isLength({max:100})
        .withMessage("Name exceed max length 100 characters"),
    validator.validatorSanitizer(unitPrice),
    validator.existsValidator(unitPrice),
    validator.numericValidator(unitPrice),
    body(unitPrice)
        .custom(validator.zeroNegativeValidator)
        .withMessage("Unit price can't be zero or negative"),
    validator.validatorSanitizer(quantity),
    validator.existsValidator(quantity),
    validator.numericValidator(quantity),
    body(quantity)
        .custom(validator.zeroNegativeValidator)
        .withMessage("Quantity can't be zero or negative")
];

exports.validationUpdate = [
    validator.idValidator(id, "of product to update"),
    this.validationAdd
];

exports.validationGetList = 
    validator.idValidator(id, "market's user");

exports.validationId = 
    validator.idValidator(id, "of product");
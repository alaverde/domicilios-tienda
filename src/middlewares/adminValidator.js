const validator = require("../middlewares/validator");

exports.validationMarketId = 
    validator.idValidator("id", "of market");

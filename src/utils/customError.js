class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

class CustomErrorJson extends Error {
  constructor(message, errors, statusCode){
    super(message);
    if(errors.length > 0){
      this.errors = errors;
    }
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
module.exports = CustomErrorJson;

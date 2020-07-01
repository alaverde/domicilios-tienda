const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");

const clientRouter = require("./routes/clientRoutes");
const shopkeeperRouter = require("./routes/shopkeeperRoutes");
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productRoutes");
const adminRouter = require("./routes/adminRoutes");
const errorHandler = require("./controllers/errorController");
const CustomError = require("./utils/customError");

const app = express();

//Setup
app.use(cors());
app.use(helmet());
app.use(express.json({
  limit: "10kb"
}));
app.use(mongoSanitize());
app.use(
  "/",
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, try again in one hour",
  })
);
app.use(xss());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

//Routes
app.use("/api/auth", authRouter);
app.use("/api/user", clientRouter);
app.use("/api/product", productRouter);
app.use("/api/admin", adminRouter);
app.use("/api/shopkeeper", shopkeeperRouter);
app.all("*", (req, res, next) => next(new CustomError("Invalid route", 404)));

//ErrorHandling
app.use(errorHandler);

module.exports = app;
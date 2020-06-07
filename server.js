const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

const app = require("./src/app");
const mongoAdapter = require("./config/mongoAdapter");

mongoAdapter();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server active on port ${port}`));

const express = require("express");
const { connectToDB } = require("./config/db");
const config = require("./config/config.json");
const helmet = require("helmet");
const http = require("http");
const userRoutes = require("./routes/users");
const processRoutes = require("./routes/processes");
const siteRoutes = require("./routes/sites");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoutes);
app.use("/process", processRoutes);
app.use("/site", siteRoutes);

server.listen(config.development.PORT, "0.0.0.0", async () => {
  connectToDB()
    .then(() => {
      console.log("Server is running at port: " + config.development.PORT);
    })
    .catch((e) => {
      console.log("Error in database connection", e);
    });
});

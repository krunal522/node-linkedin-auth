const express = require("express");
const cors = require("cors");
require("dotenv").config();

const linkedinRoutes = require("./routes/linkedinRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", linkedinRoutes);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

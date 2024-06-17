import express from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import questionRoute from "./routes/questionRoute.js";
import answerRoute from "./routes/answerRoute.js";
import { dbConn } from "./db/dbConfig.js";

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoute);
app.use("/api/questions", questionRoute);
app.use("/api/answers", answerRoute);

async function start() {
  try {
    const result = await dbConn.query("select 'trident' ");
    app.listen(port);
    console.log("database connection established");
    console.log("Server is running on port", port);
  } catch (error) {
    console.error(error.message);
  }
}
start();

import mysql2 from "mysql2";
import dotenv from "dotenv";
dotenv.config();

export const dbConnection = mysql2.createPool({
  user: process.env.USER,
  database: process.env.DATABASE,
  host: "evangadi-henok0ed-evangadi.k.aivencloud.com",
  password: `AVNS_jjeitJUVukm1G2iSYka`,
  connectionLimit: 10,
  port: 10022,
});

export const dbConn = dbConnection.promise();

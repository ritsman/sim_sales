import mysql from "mysql2";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "karan@1212",
  database: "sim_four",
  connectionLimit: 10,
});

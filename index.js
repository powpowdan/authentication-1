import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000; 

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "users",
  password: "password",
  port: 5432,
});
db.connect();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  try {
    // Check if username already exists
    const checkUserQuery = 'SELECT * FROM users WHERE username = $1';
    const checkUserResult = await db.query(checkUserQuery, [username]);

    if (checkUserResult.rows.length > 0) {
      // Username already exists
      return res.status(400).send("Account with this username already exists. try logging in if this is yours.");
    }

    // If username is available, proceed with registration
    const insertQuery = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    await db.query(insertQuery, [username, password]);
    
    res.redirect(301, "/");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred during registration.");
  }
});

app.post("/login", async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  console.log(username);
  console.log(password);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

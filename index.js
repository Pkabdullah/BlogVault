require("dotenv").config()
const express = require("express");
const path = require("path");
const app = express();
const port =process.env.PORT || 8000;
const userRouter = require("./routes/user");
const cookieParser = require("cookie-parser");
const blogRouter = require("./routes/blog");
const Blog = require("./models/blog");
// mabdullah08work
// MLUIwUOw11PYEgvq
const { connectDb } = require("./connection");
const {
  checkForAuthenticationCookies,
} = require("./middleware/authentication");
connectDb(
  "mongodb+srv://mabdullah08work:MLUIwUOw11PYEgvq@cluster0.au36w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
)
  .then(() => {
    console.log("Mongo db is connected");
  })
  .catch((err) => console.log("Error connecting db ", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("./public")))
app.use(cookieParser());
app.use(checkForAuthenticationCookies("token"));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});
app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(port, () => {
  console.log(`Server started at port${port}`);
});

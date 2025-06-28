const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require("method-override"); // ✅ added

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // ✅ added here

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

let posts = [
    { id: uuidv4(), username: "Prashik", content: "I love web Dev" },
    { id: uuidv4(), username: "John", content: "I love JavaScript" },
    { id: uuidv4(), username: "Jane", content: "I love Python" }
];

app.get("/posts", (req, res) => {
    res.render("index.ejs", { posts });
});

app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/posts", (req, res) => {
    const { username, content } = req.body;
    const id = uuidv4();
    posts.push({ id, username, content });
    res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
    const { id } = req.params;
    const post = posts.find(p => p.id === id);
    if (!post) return res.send("Post not found");
    res.render("show.ejs", { post });
});

app.get("/posts/:id/edit", (req, res) => {
    const { id } = req.params;
    const post = posts.find(p => p.id === id);
    if (!post) return res.send("Post not found");
    res.render("edit.ejs", { post });
});

// ✅ PUT route using method-override
app.put("/posts/:id", (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const post = posts.find(p => p.id === id);
    if (!post) return res.send("Post not found");
    post.content = content;
    res.redirect(`/posts/${id}`);
});

// ✅ DELETE route
app.delete("/posts/:id", (req, res) => {
    posts = posts.filter(p => p.id !== req.params.id);
    res.redirect("/posts");
});

app.listen(port, () => {
    console.log(`listening to port: ${port}`);
});

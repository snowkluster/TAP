import express from "express";

const app = express();

app.get("/hello", (req, res) => {
    res.send("Hello World!");
    console.log(`${req.url}`);
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

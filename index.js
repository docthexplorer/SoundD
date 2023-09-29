import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const shazamAPIURL = "https://shazam.p.rapidapi.com";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/detect", (req, res) => {
  res.render("detect.ejs");
});

app.post("/", async (req, res) => {
  try {
    const input = req.body["input"];
    const response = await axios.request({
      method: "GET",
      url: "https://shazam.p.rapidapi.com/search",
      params: {
        term: input,
        locale: "en-US",
        offset: "0",
        limit: "5",
      },
      headers: {
        "X-RapidAPI-Key": "5bc3f42dc9mshcac029c001a7d9bp18857bjsnbed854b9933d",
        "X-RapidAPI-Host": "shazam.p.rapidapi.com",
      },
    });
    console.log(response.data);
    res.render("index.ejs", { searchOutput: response.data });
  } catch (error) {
    console.error(error.message);
    res.render("index.ejs", { errorReq: error.message });
  }
});

app.post("/detect", async (req, res) => {
  console.log(req.body["input"]);
  const audioString = req.body["input"];

  var data = {
    api_token: "531e07c64e03fa49ac8ab050375d5c3f",
    audio: audioString,
    return: "apple_music,spotify",
  };

  axios({
    method: "post",
    url: "https://api.audd.io/",
    data: data,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((response) => {
      console.log(response.data);
      res.render("detect.ejs", { audioResult: response.data });
    })
    .catch((error) => {
      console.log(error.message);
      res.render("index.ejs", { errorReq: error.message });
    });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});
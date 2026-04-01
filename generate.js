const fs = require("fs");
const fetch = require("node-fetch");

const API = "https://tmdb.chgov.cc.cd";

async function run() {
  const res = await fetch(`${API}/movie/popular`);
  const data = await res.json();

  const template = fs.readFileSync("movie-template.html","utf-8");

  if (!fs.existsSync("movie")) fs.mkdirSync("movie");

  for (let m of data.results) {
    let html = template
      .replaceAll("{{title}}", m.title)
      .replaceAll("{{overview}}", m.overview || "")
      .replaceAll("{{poster}}", m.poster_path)
      .replaceAll("{{id}}", m.id);

    fs.writeFileSync(`movie/${m.id}.html`, html);
  }

  console.log("生成完成");
}

run();
const fs = require("fs");
const fetch = require("node-fetch");

const API = "https://tmdb.chgov.cc.cd";

async function fetchMovies(page) {
  const res = await fetch(`${API}/movie/popular?page=${page}`);
  return (await res.json()).results;
}

async function run() {
  const template = fs.readFileSync("movie-template.html", "utf-8");

  if (!fs.existsSync("movie")) fs.mkdirSync("movie");

  let urls = [];

  for (let p = 1; p <= 5; p++) {
    const movies = await fetchMovies(p);

    for (let m of movies) {
      const file = `movie/${m.id}.html`;

      let html = template
        .replaceAll("{{title}}", m.title)
        .replaceAll("{{overview}}", m.overview || "")
        .replaceAll("{{poster}}", m.poster_path)
        .replaceAll("{{id}}", m.id);

      fs.writeFileSync(file, html);

      urls.push(`<url><loc>https://decotv666.pages.dev/${file}</loc></url>`);
    }
  }

  // 生成 sitemap
  const sitemap = `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  fs.writeFileSync("sitemap.xml", sitemap);

  console.log("V5 自动生成完成");
}

run();
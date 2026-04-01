const fs = require("fs");
const fetch = require("node-fetch");

const API = "https://tmdb.chgov.cc.cd";

async function fetchMovies(page) {
  const res = await fetch(`${API}/movie/popular?page=${page}`);
  return (await res.json()).results;
}

function slug(name){
  return name.toLowerCase().replace(/\s+/g,'-');
}

async function run() {
  if (!fs.existsSync("movie")) fs.mkdirSync("movie");
  if (!fs.existsSync("category")) fs.mkdirSync("category");

  let sitemap = [];

  for (let p=1;p<=10;p++){
    const movies = await fetchMovies(p);

    for (let m of movies){

      // 🎬 电影页
      const html = `
<!DOCTYPE html>
<html>
<head>
<title>${m.title} 在线观看 - DecoTV</title>
<meta name="description" content="${m.title}剧情介绍：${m.overview}">
</head>
<body>

<h1>${m.title}</h1>

<img src="https://image.tmdb.org/t/p/w500${m.poster_path}">

<p>${m.overview}</p>

<a href="https://vidsrc.to/embed/movie/${m.id}">▶ 播放</a>

<p>相关电影：</p>
<a href="/movie/${m.id}.html">${m.title}</a>

</body>
</html>`;

      fs.writeFileSync(`movie/${m.id}.html`, html);

      sitemap.push(`<url><loc>https://decotv666.pages.dev/movie/${m.id}.html</loc></url>`);
    }
  }

  // 分类页（简单示例）
  const catHTML = `
<html>
<head><title>热门电影推荐</title></head>
<body>
<h1>热门电影</h1>
<a href="/movie/550.html">电影示例</a>
</body>
</html>`;

  fs.writeFileSync(`category/popular.html`, catHTML);

  sitemap.push(`<url><loc>https://decotv666.pages.dev/category/popular.html</loc></url>`);

  fs.writeFileSync("sitemap.xml", `<urlset>${sitemap.join("")}</urlset>`);

  console.log("V6完成");
}

run();
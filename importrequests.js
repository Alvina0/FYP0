const url = "https://climate-news-feed.p.rapidapi.com/page/1";
const querystring = { "limit": "18" };

const headers = {
  "X-RapidAPI-Key": "f05a3f9458mshe454b12535fd0aep1c7cdejsn28b2b9b76f7a",
  "X-RapidAPI-Host": "climate-news-feed.p.rapidapi.com"
};

fetch(`${url}?${new URLSearchParams(querystring)}`, { headers })
  .then(response => response.json())
  .then(data => {
    const articles = data.articles;
    const cardContent = articles.map(article => `
      <div class="col-md-4">
        <div class="card">
          <img src="${article.thumbnail}" class="card-img-top" alt="..." onerror="this.src='news1.png';">
          <div class="card-body">
            <h5 class="card-title">${article.title}</h5>
            <a href="${article.url}" class="btn custom-btn" >Read More</a>
          </div>
        </div>
      </div>
    `).join("");

    // Update the content of the news-container div with the new HTML content
    document.getElementById('news-container').innerHTML = `<div class="row">${cardContent}</div>`;
  })
  .catch(error => console.error('Error fetching data:', error));

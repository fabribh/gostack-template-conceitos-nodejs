const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  const { title } = request.params

  response.status(200).json(repositories);

});

app.post("/repositories", (request, response) => {
  
  const { title, url, techs } = request.body
  const repositore = {
    id: uuid(),
    title,
    url: `http://github.com/${url}`,
    techs,
    likes: 0
  };

  console.log(repositore);

  repositories.push(repositore);

  response.json(repositore);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoreIndex = repositories.findIndex(repositore => repositore.id === id);

  if (repositoreIndex < 0) {
    return response.status(400).json({
      error: 'Repositore not found'
    })
  }
  
  const repositore = {
    id,
    title,
    url,
    techs
  }

  repositories[repositoreIndex] = repositore;

  return response.json(repositore);

});

app.delete("/repositories/:id", (req, res) => {
  // TODO
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

module.exports = app;

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

  repositories.push(repositore);

  response.json(repositore);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoreIndex = getIndexArray(id);

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
  const { id } = req.params;

  const repositoreIndex = getIndexArray(id);
  
  if (repositoreIndex < 0) {
    return res.status(400).json({
      error: 'Repositore not found'
    })
  }

  repositories.splice(repositoreIndex, 1);
  return res.status(204).json();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoreIndex = getIndexArray(id);

  if (repositoreIndex < 0) {
    return res.status(400).json({
      error: 'Repositore not found'
    })
  }

  repositories[repositoreIndex].likes += 1; 

  return response.status(201).json(repositories[repositoreIndex]);
  
});

function getIndexArray(id) {
  const indexOfarray =  repositories.findIndex(repositore => repositore.id === id);
  return indexOfarray;
}

module.exports = app;

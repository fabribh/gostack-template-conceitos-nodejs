const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({error: "Invalid repository ID!"});
  }
  return next();
}

app.use('/repositories/:id', validateProjectId);

app.get("/repositories", (request, response) => {

  const { title } = request.params
  const results = title ? repositories.filter(repository => repository.title.includes(title)) : repositories;
  response.status(200).json(results);

});

app.post("/repositories", (request, response) => {
  
  const { title, url, techs } = request.body
  const repository = {
    id: uuid(),
    title,
    url, 
    techs,
    likes: 0
  };

  repositories.push(repository);

  response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const index = repositories.findIndex(repository => repository.id === id);

  if (index < 0) {
    return response.status(400).json({
      error: 'repository not found'
    })
  }
  
  repositories[index].title = title;
  repositories[index].url = url;
  repositories[index].techs = techs;

  return response.json(repositories[index]);

});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const index = repositories.findIndex(repository => repository.id === id);
  
  if (index < 0) {
    return res.status(400).json({
      error: 'repository not found'
    })
  }

  repositories.splice(index, 1);
  return res.status(204).json();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
 
  const index = repositories.findIndex((repository) => repository.id === id);

  if (index < 0) {
    return response.status(400).json({
      error: 'Repository not found'
    })
  }
 
  const repository = repositories[index];

  repository.likes += 1; 
  return response.status(201).json(repositories[index]);
 
 
});

module.exports = app;

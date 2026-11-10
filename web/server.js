import { createServer } from 'node:http';

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  
  let puuid =  await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Nerfier/euw?api_key=RGAPI-48161f1b-38b3-42d0-9272-c1ffd792b859`);
  puuid = await puuid.json();
  console.log(puuid);
  res.end(puuid);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
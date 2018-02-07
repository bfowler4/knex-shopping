const express = require(`express`);
const server = express();
const bodyParser = require(`body-parser`);
const usersRoute = require(`./routes/users`);
const productsRoute = require(`./routes/products`);
const cartRoute = require(`./routes/cart`);
const purchasesRoute = require(`./routes/purchases`);

const PORT = process.env.PORT || 3000;

server.use(bodyParser.urlencoded( {extended: true }));

server.use(`/users`, usersRoute);
server.use(`/products`, productsRoute);
server.use(`/cart`, cartRoute);
server.use(`/purchases`, purchasesRoute);

server.get(`/`, (req, res) => {
  res.send(`smoke test`);
});


server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");
const schema = require("./schema");
const convertRawToJson = require("./data/raw/rawToJson");

const app = express();

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.get("/raw-to-json", (req, res, next) => {
  const before = new Date();
  convertRawToJson();
  const after = new Date();
  res.send(`finish in ${(after - before) / 1000} seconds`);
});

app.get("/", (req, res, next) => {
  res.send(`
    <p>
      Hai! Silahkan menuju ke <a href="/graphql">GraphiQL<a> untuk menguji data yang dapat diambil
    </p>
    <p>
      Sumber Data : <a href="https://pddikti.kemdikbud.go.id/pt">https://pddikti.kemdikbud.go.id/pt<a> (diakses pada 22 November 2021, 14.13 WIB)
    </p>
    <p>
      Link File Excel Asli: <a href="http://pddikti.ristekdikti.go.id/public/asset/data/Data_Perguruan_Tinggi.xlsx">http://pddikti.ristekdikti.go.id/public/asset/data/Data_Perguruan_Tinggi.xlsx<a>
    </p>
  `);
});

app.listen(3000, () => {
  console.log("server started");
});

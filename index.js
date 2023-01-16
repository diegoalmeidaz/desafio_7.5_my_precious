const express = require("express");
const app = express();

app.use(express.json());

const { getData, getDataFiltrada, prepararHATEOAS } = require("./consultas");

PORT = 3000;

// Iniciador de puerto
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

const reporteConsulta = async (req, res, next) => {
  const parametros = req.query;
  const url = req.url;
  console.log(
    `Hoy ${new Date()} Se ha recibido una consulta en la ruta ${url} con los parámetros:`,parametros);
  next();
};


app.get('/joyas', reporteConsulta, async (req, res) => {
    try {
      const queryString = req.query;
      const inventario = await getData(queryString);
      const HATEOAS = await prepararHATEOAS(inventario);
      res.json(HATEOAS);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al conectar al servidor" });
    }
  });

  app.get('/joyas/filtros', reporteConsulta, async(req, res) => {
    try {
      const queryString = req.query;
      const inventario = await getDataFiltrada(queryString);
      res.json(inventario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al conectar al servidor" });
    }
  });

  app.get("*", (req, res) => {
    res.status(404).send("Esta ruta no existe");
  });
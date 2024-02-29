const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const server = express();
server.use(cors());
server.use(express.json());
require('dotenv').config();

const getConnection = async () => {
  const connectDB = await mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'librería',
  });
  connectDB.connect();
  return connectDB;
};

const serverPort = process.env.PORT || 4000;
server.listen(serverPort, () => {
  console.log(`http://localhost:${serverPort}`);
});

//pintar listado
server.get('/libros', async (req, res) => {
  const connect = await getConnection();
  const librosSQL = 'SELECT libros.*, autores.* FROM libros, autores';
  const [result] = await connect.query(librosSQL);
  connect.end();
  res.json({ success: true, results: result });
});

//filtar por genero o autor
server.get('/libros/:genero', async (req, res) => {
  const genero = req.params.genero;
  const connect = await getConnection();
  const generoSQL = 'SELECT * FROM libros WHERE genero = ?';
  const [resultGenero] = await connect.query(generoSQL, [genero]);
  if (resultGenero.length === 0) {
    return res.json({
      success: false,
      message: 'No tenemos ningún libro de ese género',
    });
  }
  res.json({ success: true, result: resultGenero });
});

//insertar un registro en la entidad principal
server.post('/addLibros', async (req, res) => {
  const connect = await getConnection();
  const newLibro = req.body;
  const { titulo, genero, año, editorial, precio } = newLibro;
  const insertSQL =
    'INSERT INTO libros (titulo, genero, año, editorial, precio) VALUES (?, ?, ?, ?, ?)';
  const [result] = await connect.query(insertSQL, [
    titulo,
    genero,
    año,
    editorial,
    precio,
  ]);
  connect.end();
  res.json({
    success: true,
    id: result.insertId,
  });
});

//Actualizar un regitro existente
server.put('/libros/:id', async (req, res) => {
  const connect = await getConnection();
  const id = req.params.id;
  const updateLibro = req.body;
  const { titulo, genero, año, editorial, precio } = updateLibro;
  const updateSQL =
    'UPDATE libros SET titulo = ?, genero = ?, año = ?, editorial =?, precio =? WHERE idLibro= ?';
  const [result] = await connect.query(updateSQL, [
    titulo,
    genero,
    año,
    editorial,
    precio,
    id,
  ]);
  connect.end();
  res.json({ success: true, message: 'Libro actualizado correctamente' });
});

//Eliminar registro
server.delete('/eliminarLibros', async (req, res) => {
  const connect = await getConnection();
  const idLibro = req.query.id;
  const deleteSQL = 'DELETE FROM libros WHERE idLibro = ?';
  const [result] = await connect.query(deleteSQL, [idLibro]);
  console.log(result);
  if (result.affectedRows > 0) {
    res.json({ success: true, message: 'Libro eliminado correctamente' });
  } else {
    res.json({
      success: false,
      message: 'No se ha podido eliminar nada, comprueba el id.',
    });
  }
});

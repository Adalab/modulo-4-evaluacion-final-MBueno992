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
  const librosSQL = 'SELECT * FROM libros';
  const [result] = await connect.query(librosSQL);
  const numOfElements = result.length;
  connect.end();
  res.json({ success: true, info: numOfElements, results: result });
});

//filtrar por genero
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

//Filtrar por autor
server.get('/libros/autor/:autor', async (req, res) => {
  const autor = req.params.autor;
  const connect = await getConnection();
  const autorSelect = 'SELECT * FROM autores WHERE nombre LIKE ?';
  const [resultAutor] = await connect.query(autorSelect, [`%${autor}%`]);
  console.log(resultAutor[0].idAutor);
  const autorId = resultAutor[0].idAutor;
  const librosSelect = 'SELECT * FROM libros WHERE fk_autorId = ?';
  const [resultLibros] = await connect.query(librosSelect, [autorId]);
  if (librosSelect.length === 0) {
    return res.json({
      success: false,
      message: 'No tenemos ningún libro de ese autor',
    });
  }
  res.json({ success: true, result: resultLibros });
});

//insertar un libro y autor
server.post('/addLibros', async (req, res) => {
  const connect = await getConnection();
  const newAutor = req.body;
  const { nombre, año_nacimiento, nacionalidad } = newAutor;
  const searchAutor = 'SELECT * FROM autores WHERE nombre = ?';
  const [resultAutor] = await connect.query(searchAutor, [nombre]);
  let fkAutor;
  if (resultAutor.length === 0) {
    const insertAutor =
      'INSERT INTO autores (nombre, año_nacimiento, nacionalidad) VALUES (?, ?, ?)';
    const [autor] = await connect.query(insertAutor, [
      nombre,
      año_nacimiento,
      nacionalidad,
    ]);
    fkAutor = autor.insertId;
  } else {
    fkAutor = resultAutor[0].idAutor;
  }

  const newLibro = req.body;
  const { titulo, genero, año, editorial, precio } = newLibro;
  const searchLibro = 'SELECT * FROM libros WHERE titulo = ?';
  const [resultLibro] = await connect.query(searchLibro, [titulo]);
  if (resultLibro.length === 0) {
    const insertLibro =
      'INSERT INTO libros (titulo, genero, año, editorial, precio, fk_autorId) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await connect.query(insertLibro, [
      titulo,
      genero,
      año,
      editorial,
      precio,
      fkAutor,
    ]);
    return res.json({
      success: true,
      id: result.insertId,
      message: 'Libro añadido correctamente',
    });
  } else {
    return res.json({
      success: false,
      message: 'El libro ya se encuentra en la base de datos',
    });
  }
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

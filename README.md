
# Evaluación final módulo 4

La creación de esta API forma parte de la evaluación final del Módulo 4. Para su desarrollo se ha trabajado con MySQL, Express.js y Node.js.
La prueba consistía en crear una base de datos y poder llevar a cabo operaciones CRUD en ella. 
En mi caso, he optado por crear una base de datos de una librería con dos tablas, libros y autores. 

## API de gestión de libros y autores

Esta API proporciona endpoints para gestionar una base de datos de libros y autores. Utiliza Express.js para el enrutamiento y MySQL como base de datos.

### Instalación

1. Clona este repositorio en tu local.
2. Instala las dependencias utilizando npm:

    ```
    npm install
    ```

3. Configura las variables de entorno. Copia el archivo `.env.example` a `.env` y proporciona los valores necesarios para `DB_USER`, `DB_PASS`, y `PORT`.

4. Asegúrate de tener un servidor MySQL en ejecución.

5. Ejecuta la aplicación:

    ```
    npm start
    ```

### Rutas

#### Obtener lista de libros

```http
  GET /libros
```
  - Devuelve una lista de todos los libros con información detallada, incluido el nombre del autor.

#### Filtrar libros por género

```http
 GET /libros/:genero
```
  - Devuelve una lista de libros filtrados por género.

#### Filtrar libros por autor
```http
GET /libros/autor/:autor
```
  - Devuelve una lista de libros escritos por un autor específico.

#### Agregar un nuevo libro

```http
 POST /addLibros
 ```
  - Agrega un nuevo libro a la base de datos. Se requiere un cuerpo JSON con la información del libro y del autor.

#### Actualizar información de un libro
```http
PUT /libros/:id
```
  - Actualiza la información de un libro existente en la base de datos. Se requiere el ID del libro en la URL y un cuerpo JSON con la nueva información del libro.

#### Eliminar un libro

```http
DELETE /eliminarLibros
```
  - Elimina un libro de la base de datos. Se requiere el ID del libro como parámetro de consulta. 

  > **EJEMPLO**: /eliminarLibros?id=

### Notas adicionales

- La API utiliza CORS para permitir solicitudes desde cualquier origen.

## License

[MIT](https://choosealicense.com/licenses/mit/)


CREATE DATABASE librería;
USE librería;

CREATE TABLE autores(
idAutor INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100),
año_nacimiento int,
nacionalidad VARCHAR(30)
);

CREATE TABLE libros(
idLibro INT AUTO_INCREMENT PRIMARY KEY,
titulo VARCHAR(60),
genero VARCHAR(30),
año INT,
editorial VARCHAR(60),
precio int,
fk_autorId int,
FOREIGN KEY (fk_autorId) REFERENCES autores(idAutor)
);

INSERT INTO autores (nombre, año_nacimiento, nacionalidad) VALUES ('Dolores Redondo', 1969 , "Española"), ('J.K. Rowling', 1965 , "Britanica"), ("Juan Gómez-Jurado", 1977, "Español"), ("Javier Castillo", 1987, "Español" ), ("Megan Maxwell", 1965, "Española");
INSERT INTO libros (titulo, genero, año, editorial, precio, fk_autorId) VALUES ('Trilogía del Baztán', 'Novela negra', 2023, "Booket", 29, 1), ('El día que el cielo se caiga', 'Novela rosa', 2016, 'Booket', 13, 5), ('Todo arde', 'Novela negra', 2022, 'B', 22, 3), ('Esperando al diluvio', 'Novela negra', 2022, 'Booket', 14, 1),('Harry potter y las reliquias de la muerte', 'Fantasía', 2007, 'Salamandra', 23, 2), ('El cuco de cristal', 'Novela negra', 2023, 'SUMA', 20, 4), ('Reina Roja', 'Novela negra', 2018, 'B', 22, 3), ('Harry Potter y el misterio del príncipe', 'Fantasía', '2006', 'Salamandra', 22, 2), ('El día que se perdió la cordura', 'Novela negra', '2017', 'SUMA', 20, 4);    
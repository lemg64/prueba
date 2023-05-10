CREATE DATABASE database_links;
USE database_links;
CREATE TABLE users(
    id INT (11) NOT NULL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    Fullname VARCHAR(100) NOT NULL
)

ALTER TABLE users
     ADD PRIMARY KEY (id);

     DESCRIBE users;
     

     CREATE TABLE detallentrada (
    ID_DE int,
    nombre varchar(255) NOT NULL,
    referencia varchar(255) NOT NULL,
    descripcion varchar(255) NOT NULL,
    cantidad int(10) NOT NULL,
    observaciones varchar(255) NOT NULL
);

ALTER TABLE detallentrda
     ADD PRIMARY KEY (ID_DE);


    --  // agregar un nuevo tipo de usuario y crear la tabla 

     INSERT INTO `tipouser`(`id`, `nombre`, `descripcion`) VALUES ('','fotografos','');

CREATE table fotografos (id int(10), nombre varchar(40) not null, nit varchar (20) not null,
                        telefono varchar (10) not null, telefono2 varchar(10) null, direccion varchar (40) not null,
                        ciudad varchar (40) not null, correo varchar (40) null, recomendadoPor varchar (40) null)


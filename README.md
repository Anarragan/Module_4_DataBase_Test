# Proyect base Frontend + backend whit a basic autentication

This proyect is a website that aplies all the thigns htat we seen in the last module of the basic road,
it's a simple example of an a full Stack aplicattion, whit back and front separate.

## Tencologies used

### Backend
- **Node.js** + **Express** 
- **CORS** 
- **bcrypt**
- **Base de datos** 

### Frontend
- **Vite** → 
- **Axios** → 

---

## 📂 Estructura del Proyecto

```
📦 complete_conection
┣ 📂 backend
┃ ┣ 📜 server.js
┃ ┣ 📜 dataBase.js
┣ 📂 frontend
┃ ┣ 📂 src
┃ ┃ ┣ 📂 views
┃ ┃ ┃ ┣ 📜 ClientesViews.js
┃ ┃ ┃ ┣ 📜 Dashboard.js
┃ ┃ ┃ ┣ 📜 Login.View.js   
┃ ┃ ┣ 📜 api.js  
┃ ┃ ┣ 📜 auth.js             
┃ ┃ ┣ 📜 main.js
┃ ┃ ┣ 📜 router.js           
┃ ┣ 📜 index.html    
```

## Clonar el repositorio

```
git clone https://github.com/usuario/proyecto-base.git
cd Modulo_4_prueba_de_desempeño
```
## Configuracion del backend

```
cd Backend
npm install cors bcrypt express
```

### Configura tu archivo .env con los datos de tu base de datos.

```
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_base
JWT_SECRET=clave_secreta
```

Para lanzar el servidor usas el comando:

```
node server.js
```

## Configurar el Frontend

```
cd ../Frontend
npm install
```

Pon la direccion URL de tu API en ```src/api/axios.js``` 

ejecuta el cliente con: 
```
npm run dev
```
## Funcionalidades

- ✅ **Login de usuarios** (`login.js`)  
  Valida las credenciales ingresadas utilizando **bcrypt** para el cifrado y verificación de contraseñas.

- ✅ **Dashboard básico** (`dashboard.js`)  
  Muestra una interfaz sencilla posterior al inicio de sesión.

- ✅ **Comunicación segura** entre **frontend** y **backend** mediante **CORS**  
  Garantiza el intercambio de datos evitando bloqueos por políticas de origen cruzado.

## DDL of a data base
```
create table public.clientes (
  cliente_id integer not null,
  nombre text null,
  direccion text null,
  telefono text null,
  correo text null,
  plataforma text null,
  cedula bigint null,
  constraint cliente_id primary key (cliente_id),
  constraint clientes_correo_key unique (correo)
) TABLESPACE pg_default;

create table public.facturaciones (
  factura_id character varying not null,
  periodo date null,
  mont_facturado real not null,
  mont_pagado double precision null,
  constraint factura_id primary key (factura_id)
) TABLESPACE pg_default;

create table public.transacciones (
  transaccion_id text not null,
  fecha timestamp without time zone null,
  monto_transaccion integer not null,
  estado text not null,
  tipo character varying null,
  cliente_id serial not null,
  factura_id text not null,
  constraint transacciones_pkey primary key (transaccion_id),
  constraint transacciones_cliente_id_fkey foreign KEY (cliente_id) references clientes (cliente_id),
  constraint transacciones_factura_id_fkey foreign KEY (factura_id) references facturaciones (factura_id),
  constraint transacciones_estado_check check (
    (
      estado = any (
        array[
          'Fallida'::text,
          'Completada'::text,
          'Pendiente'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;
```


## Entity Relationship Model

![alt text](<Captura desde 2025-08-12 13-55-12.png>)

## CSV files

[text](Backend/uploads/clientes.csv)
[text](Backend/uploads/facturaciones.csv)
[text](Backend/uploads/transacciones.csv)


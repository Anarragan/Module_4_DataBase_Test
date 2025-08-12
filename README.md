# Proyect base Frontend + backend whit a basic autentication

This proyect is a website that aplies all the thigns htat we seen in the last module of the basic road, a easy way 
Este proyecto es un ejemplo básico de una aplicación **Full Stack** con **frontend** y **backend** separados.  
Incluye un flujo simple de **registro** y **login** que conecta con una base de datos para validar usuarios.  

## Tecnologías Utilizadas

### Backend
- **Node.js** + **Express** → Servidor y API REST
- **CORS** → Permitir comunicación entre frontend y backend
- **bcrypt** → Cifrado seguro de contraseñas
- **Base de datos** → Conexión para almacenar y validar usuarios

### Frontend
- **Vite** → Entorno de desarrollo rápido para el cliente
- **Axios** → Consumo de la API del backend

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

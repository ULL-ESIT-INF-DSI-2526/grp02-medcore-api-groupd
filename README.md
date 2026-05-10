# Proyecto grupal 2 - API Rest MedCore

**Asignatura:** Desarrollo de Sistemas Informáticos  
**Alumnos:** Pablo Pérez Hernández, Diego Prieto González y Eduardo Zúñiga Alarcó

**Correo:** [alu0101619002@ull.edu.es], [alu0101478340@ull.edu.es] y [alu0101637853@ull.edu.es]

**Badges del proyecto:**
[![CI Tests](https://github.com/ULL-ESIT-INF-DSI-2526/grp02-medcore-api-groupd/actions/workflows/ci.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2526/grp02-medcore-api-groupd/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2526/grp02-medcore-api-groupd/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2526/grp02-medcore-api-groupd?branch=main)
[![CodeQL Analysis](https://github.com/ULL-ESIT-INF-DSI-2526/grp02-medcore-api-groupd/actions/workflows/codeql.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2526/grp02-medcore-api-groupd/actions/workflows/codeql.yml)

**Enlace a la API lanzada en Render:** 
[Render](https://grp02-medcore-api-groupd.onrender.com)

**Requisitos previos:**
* Tener [Node.js](https://nodejs.org/) instalado.
* Tener un servidor local de [MongoDB](https://www.mongodb.com/) ejecutándose en el puerto por defecto (`27017`).

**Pasos para el despliegue local:**

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/ULL-ESIT-INF-DSI-2526/grp02-medcore-api-groupd.git](https://github.com/ULL-ESIT-INF-DSI-2526/grp02-medcore-api-groupd.git)
   cd grp02-medcore-api-groupd

    ```

2. **Instalar las dependencias:**
```bash
npm install

```


3. **Ejecutar el servidor en modo desarrollo:**
El proyecto ya viene con el archivo `config/dev.env` preparado. Solo necesitas ejecutar:
```bash
npm run dev

```


El servidor se iniciará y la API estará escuchando en `http://localhost:3000`.
Puedes consultar la documentación interactiva accediendo a `http://localhost:3000/api-docs`.

**🧪 Ejecución de pruebas:**

Para correr los tests automatizados (configurados con Vitest para usar una base de datos de prueba separada):

```bash
npm test

```

Para ver la cobertura del código:

```bash
npm run coverage

```

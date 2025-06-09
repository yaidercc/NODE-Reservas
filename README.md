# 🏨 API de Reservas de Habitaciones

Este es un proyecto backend desarrollado en Node.js para la gestión de reservas de habitaciones. Permite administrar usuarios, habitaciones y reservas, aplicando buenas prácticas de arquitectura y pruebas automatizadas.

Api (SWAGGER): https://booking-api.yaidercc.me/api-docs
---

## 🎯 Objetivo del Proyecto

Este proyecto nace con el propósito de reforzar y aplicar los conocimientos adquiridos tanto en experiencia laboral como en formación técnica y cursos. Algunas prácticas destacadas implementadas:

- ✅ **Domain-Driven Design (DDD)**: estructuración del código por dominios y capas, facilitando el mantenimiento y la escalabilidad.
- ✅ **Test-Driven Development (TDD)**: desarrollo impulsado por pruebas desde el principio.
- ✅ **Principios SOLID**: construcción de código limpio, desacoplado y de fácil extensión.
- ✅ **Testing Completo**: incluye pruebas **unitarias**, **de integración** y **end-to-end**.
- ✅ **Base de Datos Relacional**: implementación con PostgreSQL utilizando **Knex.js** como query builder.
  
Con este proyecto, quiero consolidar mi experiencia en desarrollo backend aplicando buenas prácticas y arquitecturas modernas, asegurando que el código sea robusto, mantenible y bien probado.

## Scripts Disponibles

### Servidor

- Ejecutar proyecto localmente
```
 npm run api
```

- Ejecutar proyecto con docker
```
 docker compose up
```

### Tests

- Ejecutar todos los tests (E2E, Unitarios, Integracion)
```
 npm run test
```
- Ejecutar todos los tests unitarios
 
```
 npm run test:unit
```
- Ejecutar todos los tests de integracion
```
 npm run test:integration 
```
- Ejecutar todos los tests E2E
```
 npm run test:e2e
```
### Database
- Aplica las últimas migraciones de la base de datos.
``` 
 npm run migrate:latest 
```
-  Revierte todas las migraciones.
```
npm run migrate:rollback
```
-  Ejecuta los seeds de la base de datos para poblarla con datos de ejemplo.
```
npm run migrate:seed
```  
- Revierte todas las migraciones, aplica las últimas y ejecuta los seeds (reset completo de la base de datos).
```
npm run migrate:reset
```  
- Compila y construye la documentación de la API en Swagger, generando un archivo dereferenciado listo para su despliegue.
```
npm run build
```  

Datos del usuario por defecto:

```
user: yaider@gmail.com
pass: 1d44b922
```  




## Tecnologías utilizadas
- Node.js
- Knex.js (Query Builder para SQL)
- PostgreSQL (Base de datos)
- Jest & Supertest (Para testing)
- Docker
- Domain driven design, Principios SOLID

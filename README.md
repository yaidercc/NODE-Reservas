# Reservas

Este es un proyecto diseñado para gestionar reservas de habitaciones que permite gestionar habitaciones, usuarios y reservas.

## Objetivo
Este proyecto tiene como propósito reforzar y aplicar los conocimientos que he adquirido en mi proceso laboral y a través de cursos, incluyendo:

- Domain-Driven Design (DDD): estructuración del código en capas y contextos bien definidos.
- Test-Driven Development (TDD): asegurando que la lógica de negocio esté correctamente probada desde el inicio.
- Principios SOLID: escritura de código limpio, escalable y mantenible.
- Testing: pruebas unitarias, de integración y E2E.
- Gestión de bases de datos: uso de Knex.js y PostgreSQL.
  
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




## Tecnologías utilizadas
- Node.js
- Knex.js (Query Builder para SQL)
- PostgreSQL (Base de datos)
- Jest & Supertest (Para testing)
- Docker

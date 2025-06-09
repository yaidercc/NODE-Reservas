#!/bin/sh
# Ejecutar migraciones (latest)
npm run migrate:latest

# Ejecutar seeds (opcional, si quieres poblar datos)
npm run migrate:seed

# Finalmente iniciar la app
npm run start

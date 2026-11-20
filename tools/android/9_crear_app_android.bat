@echo off
title Crear app Android - CityVille Revived
echo Creando la app de Android de CityVille Revived (Allow Games)...
echo La primera vez baja Java y Android (unos minutos).
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0app_android\crear_app.ps1"
echo.
echo Termino. Revisa app_android\crear_app_log.txt
timeout /t 15

# App de Android (Allow Games)

`9_crear_app_android.bat` (en `_servidor`) crea `CityVilleRevived.apk` sin Android Studio: baja Java 17 y las herramientas de Android, compila `src/` con aapt2/javac/d8 y la firma con `allowgames.jks`.

- La llave `allowgames.jks` y su clave (`allowgames_clave.txt`) se crean la primera vez en tu PC. **No se suben a GitHub.** Guarda una copia: sin ella no se pueden sacar actualizaciones de la app.
- La APK queda en `_servidor/assets_nuevos/app/` y se sube con `6_subir_servidor.bat`. Se descarga en `https://cityvillerevived.com/app/android`.

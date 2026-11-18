# Parches del cliente (Allow Games)

Herramientas para arreglar cosas del juego Flash que Ruffle no dibuja bien. No se suben archivos del juego (son de Zynga): solo los scripts.

- `shaderpatch.py Game.2012.swf Game.2012.fix.swf`
  Los personajes, policias, ladrones y otros NPCs se pintan con un sombreador Pixel Bender (`Processor.doShaderJob`).
  En Ruffle ese sombreador no sale bien y los NPCs no se veian. El parche cambia esa funcion por un bucle normal de AS3
  que hace lo mismo (busca el color de la textura con el mapa R/G, aplica la sombra del canal B y la transparencia).
- `patch.py default.swf salida.swf DefaultHUDAssets nombreNuevo nombreExistente`
  Agrega una imagen que falta en un archivo de assets copiando otra que ya existe (se uso para la ventana de la comisaria).
- `dis.py archivo.swf Clase [metodos]` muestra el bytecode de una clase para investigar.

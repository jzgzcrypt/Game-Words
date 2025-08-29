# 🎮 Cómo Ejecutar el Juego Localmente

## 📥 Opción 1: Descarga Directa (MÁS FÁCIL)

1. **Descarga los archivos:**
   - Ve al repositorio en GitHub
   - Click en el botón verde **"Code"**
   - Selecciona **"Download ZIP"**
   - Extrae el archivo ZIP

2. **Ejecutar:**
   - Abre la carpeta extraída
   - **Doble click en `index.html`**
   - ¡El juego se abre en tu navegador!

## 🔧 Opción 2: Clonación con Git

```bash
# Clona el repositorio
git clone https://github.com/TU-USUARIO/TU-REPOSITORIO.git
cd TU-REPOSITORIO

# Abre el archivo
# Windows:
start index.html

# Mac:
open index.html

# Linux:
xdg-open index.html
```

## 🌐 Opción 3: Servidor Local (Para Desarrollo)

### Con Python (Viene en la mayoría de sistemas):
```bash
# Python 3
python -m http.server 8000

# Python 2 (si es muy viejo)
python -m SimpleHTTPServer 8000

# Luego abre: http://localhost:8000
```

### Con Node.js:
```bash
# Instalar serve globalmente
npm install -g serve

# Ejecutar
serve .

# O sin instalar
npx serve .
```

### Con PHP:
```bash
php -S localhost:8000
```

## 🚀 Sin Instalaciones - Solo Navegador

**¡La forma más simple!**
1. Descarga los 2 archivos: `index.html` y `game.js`
2. Ponlos en la misma carpeta
3. Doble click en `index.html`
4. ¡Listo para jugar!

## 📱 Compatibilidad

✅ **Windows** - Cualquier navegador
✅ **Mac** - Safari, Chrome, Firefox
✅ **Linux** - Firefox, Chrome, otros
✅ **Móviles** - Chrome, Safari móvil

## ⚡ Ventajas de la Ejecución Local

- 🔒 **Privacidad total** - no se sube nada a internet
- 🚀 **Súper rápido** - no depende de conexión
- 🛠️ **Fácil modificar** - puedes editar el código
- 💾 **Sin límites** - funciona offline

## 🎯 Resolución de Problemas

**Si no funciona:**
1. Asegúrate que `index.html` y `game.js` están en la misma carpeta
2. Usa un navegador moderno (Chrome, Firefox, Safari)
3. Si usas servidor local, ve a la URL correcta (`localhost:8000`)

**¡No necesitas conocimientos técnicos! Solo descarga y abre el archivo HTML.**
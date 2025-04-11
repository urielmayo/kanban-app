# Imagen base liviana de Node (Alpine)
FROM node:23-alpine

# Directorio de trabajo
WORKDIR /app

# Copiamos solo los archivos necesarios para instalar dependencias
COPY package.json package-lock.json* ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Comando por defecto: iniciar Vite en modo dev accesible desde afuera
CMD ["npm", "run", "dev", "--", "--host"]
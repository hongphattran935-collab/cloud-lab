FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx vite build
EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
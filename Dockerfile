# Stage 1: Build and Package
FROM node:23.3-alpine AS build
RUN npm install -g typescript
LABEL author="Federico Mestrone"
WORKDIR /docsapp

COPY package.json .
COPY package-lock.json .
RUN npm install

# this will leave out files in .dockerignore
COPY . .

RUN npm run build-now

# Stage 2: Production artefact
FROM node:23.3-alpine
ENTRYPOINT ["node", "dist/src/app.js"]
LABEL author="Federico Mestrone"
EXPOSE 3000
WORKDIR /docsapp

COPY package.json .
COPY package-lock.json .
RUN NODE_ENV=production npm ci --omit=dev

COPY --from=build /docsapp/dist/src ./dist/src
COPY public ./public
COPY views ./views

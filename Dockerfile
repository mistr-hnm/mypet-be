FROM node:20-alpine AS builder
WORKDIR /usr/app/
COPY package.json package-lock.json ./
# clean installation
RUN npm ci  
COPY . .
RUN npm run build
# remove dev deps
RUN npm prune --production

FROM node:20-alpine AS prod
ENV NODE_ENV production
WORKDIR /usr/app/
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/dist ./dist
EXPOSE 3000
CMD [ "node", "dist/main" ]

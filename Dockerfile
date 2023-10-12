FROM node:alpine as builder
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm install && pnpm run build

FROM caddy
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/dist /usr/share/caddy/html
COPY singer/ /usr/share/caddy/html/singer/
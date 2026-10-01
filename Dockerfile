FROM oven/bun:1.4-alpine

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY src ./src
COPY libs ./libs
COPY drizzle ./drizzle
COPY drizzle.config.ts tsconfig.json ./.prettierrc ./

ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000

USER bun

CMD ["bun", "run", "start"]

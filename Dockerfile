################
# Build assets #
################
FROM node:18.15-bullseye as build
WORKDIR /app

# Install global node modules: pnpm
RUN npm install -g pnpm@8.1.0

# Install Node modules
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# Generate Prisma schemas
COPY prisma ./prisma
RUN pnpm prisma:gen

COPY . .

ENV NODE_ENV=production
RUN pnpm build

####################
# Production image #
####################
FROM node:18.15-bullseye-slim as production
WORKDIR /app

COPY --chown=node:node --from=build /app/build build

USER node
ENV NODE_ENV=production
CMD ["--enable-source-maps", "build/server/index.js"]

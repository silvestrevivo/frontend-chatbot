FROM node:24-slim

WORKDIR /app

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

# The store lives inside node_modules so it stays in the container's volume,
# instead of being created in the mounted project folder.
ENV PNPM_INSTALL="pnpm install --frozen-lockfile --store-dir /app/node_modules/.pnpm-store --config.confirm-modules-purge=false"

COPY package.json pnpm-lock.yaml .npmrc ./
RUN $PNPM_INSTALL

COPY . .

EXPOSE 5173

# Installing again on start keeps the node_modules volume in sync with the
# lockfile, so `docker compose up --build` is enough after a dependency change.
CMD ["sh", "-c", "$PNPM_INSTALL && pnpm dev --host 0.0.0.0"]

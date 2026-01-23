FROM node:22-alpine
WORKDIR /app

RUN corepack enable

# 1. Kutubxonalar
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# 2. Kod
COPY . .

# 3. Prisma
RUN npx prisma generate

# 4. Build
RUN pnpm run build

# --- DIAGNOSTIKA ---
# Mana shu qator build paytida bizga fayllar qayerda ekanini ko'rsatadi
RUN find dist -name "main.js"
# -------------------

EXPOSE 3000

# Hammasini qamrab oluvchi start buyrug'i
CMD sh -c "npx prisma migrate deploy && (node dist/main.js || node dist/src/main.js || node dist/index.js)"
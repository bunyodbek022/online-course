FROM node:22-alpine
WORKDIR /app

RUN corepack enable

# Faqat dependency fayllarini nusxalash (cache uchun)
COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install

# Hamma kodni nusxalash
COPY . .

# Prisma client yaratish
RUN npx prisma generate

# Loyihani build qilish
RUN pnpm run build

# --- DIAGNOSTIKA ---
# Builddan keyin nima hosil bo'lganini ko'rish (logda ko'rinadi)
RUN ls -R dist

EXPOSE 3000

# Eng muhim joyi: agar dist/main.js bo'lmasa, dist/src/main.js ni qidiradi
CMD sh -c "npx prisma migrate deploy && (node dist/main.js || node dist/src/main.js)"
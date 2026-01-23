FROM node:22-alpine
WORKDIR /app

# pnpm’ni yoqish
RUN corepack enable

COPY package*.json ./

RUN pnpm install

COPY . .

# Prisma generate va migrations (agar kerak bo‘lsa)
RUN npx prisma generate
RUN npx prisma migrate deploy 

RUN pnpm run build

EXPOSE 3000

# Production mode’da ishga tushirish
CMD ["pnpm", "run", "start:prod"]

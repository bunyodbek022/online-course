FROM node:22-alpine
WORKDIR /app

# pnpm’ni yoqish
RUN corepack enable

COPY package*.json ./

# Kutubxonalarni o'rnatish
RUN pnpm install

COPY . .

# Prisma client'ni generatsiya qilish (Baza ulanishi shart emas)
RUN npx prisma generate

# Loyihani build qilish
RUN pnpm run build

EXPOSE 3000

# Migratsiyani ishga tushirish va keyin loyihani boshlash
CMD sh -c "npx prisma migrate deploy && pnpm run start:prod"
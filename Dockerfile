FROM node:12

WORKDIR /app
ENV PORT 8000

COPY . .
RUN npm install
RUN npm run build
EXPOSE 8000

CMD ["npm", "start"]
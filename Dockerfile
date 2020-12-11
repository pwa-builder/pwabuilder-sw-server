FROM node:12

WORKDIR /app
COPY . . 
ENV PORT 80

RUN npm install
RUN npm run-script build
CMD npm start
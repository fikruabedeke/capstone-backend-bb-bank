FROM node:slim
ENV PATH /backend-bb-bank/node_modules/.bin:$PATH
WORKDIR /backend-bb-bank
COPY . ./
RUN npm install
CMD ["node", "index.js"]
EXPOSE 4500
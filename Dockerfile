FROM node:18.1

EXPOSE 3000

WORKDIR /app

COPY docker-entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT [ "/usr/local/bin/docker-entrypoint.sh" ]

COPY package.json .
RUN npm install

COPY . .

CMD [ "npm", "start" ]

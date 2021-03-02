FROM alpine:edge

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# RUN addgroup -S pptruser && addgroup -S docker \
#     && adduser -S -G docker -g pptruser pptruser \
#     && mkdir -p /home/pptruser/Downloads /usr/src \
#     && chown -R pptruser:pptruser /home/pptruser \
#     && chown -R pptruser:pptruser /usr/src

# USER pptruser

WORKDIR /usr/src
COPY package.json package.json

COPY src src

RUN yarn install --production=true && \
    yarn cache clean

EXPOSE 5000

CMD node ./src/index.js

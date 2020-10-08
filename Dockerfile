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

RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /usr/src \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /usr/src


USER pptruser

WORKDIR /usr/src
COPY tsconfig.json tsconfig.json
COPY package.json package.json

COPY src src

RUN yarn install --production=true && \
    yarn global add typescript && \
    yarn add @chocolab/configs && \
    yarn build && \
    yarn global remove typescript && \
    yarn remove @chocolab/configs && \
    yarn cache clean

EXPOSE 5000

CMD node ./dist/index.js

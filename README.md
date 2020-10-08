# Run with docker

```bash
# generate .env
cp .env.example .env

# modify .env
vim .env

# login in google cloud
yarn login

# build docker images
yarn docker:build

# run image in localhost:5000
yarn docker:run
```

# Run locally

```bash
# generate .env
cp .env.example .env

# modify .env
vim .env

# login in google cloud
yarn login

# build and run in localhost:5000
yarn start
```

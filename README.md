# Using the service

```typescript
type Querystring = {
    url: string,  // the url
    name: string,  // the name of the file
    dimension: string,  // the dimension like 10000x8000
    delay: number,  // the time to wait before take the screenshot
    includeDate: boolean,  // if you pass this argument the filename include the date
}
```

# Concept

Take screenshots of one or various pages and save it in Google Cloud Storage.

# Default resolutions

- 2560x1440
- 1920x1080
- 1680x1050
- 1600x900
- 1536x864
- 1440x900
- 1366x768
- 1280x800
- 1280x720
- 360x640

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

# Deploy

```sh
cd src/screenshots
bash deploy.sh
```

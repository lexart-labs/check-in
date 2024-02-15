# check-in

## Steps to run locally
- clone repository
- install dependencies `npm i`
- make sure that `firebaseConfig.js` is in `/src` folder
- run `npm run dev`

## Steps to run in docker
- make sure that you have docker-compose in your machine or VM
- make sure that you have your `.env` file with `WEBAPP_DOCKER_PORT=8080` because docker image expose in this port
- make sure that `firebaseConfig.js` is in `/src` folder
- run `docker-compose up` to run in your machine or `docker-compose up -d` in your VM
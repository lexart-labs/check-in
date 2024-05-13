# Check-in/Brb

## About the software
This tool has been designed with our 
specific needs as developers in mind, 
allowing us to clearly and quickly indicate 
our availability at work.

Simply access it through your company's 
enterprise link. 

It is important that you enter with your 
corporate email. If it is the first time you 
log in, the system will request two-step 
authentication to guarantee the security 
of your account.

To config your corporate email you should add the prefix in `EMAIL_PREFIX` const.

If you want to set admins of your organization you should add in `/functions/functions/.env` file the following const `ADMIN_USERS`

Once this process is completed, you will be 
ready to begin.

Within the platform, you will find an intuitive and easy-to-use interface. From there, you will be able to check in to indicate that you are active and available to receive tasks, or change your status to "BRB" if you need a break or are simply not available at that time.

The complete manual you could find in this link: https://bit.ly/3yjwdfE

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
# psy-back

## Prerequisites

- Node.js v14.x
- npm v7.x
- in **_config/config.js_** replace values with yours and rename file to config.env

## setup

### using the docker image

Here you either can build the image locally and use it. or download the latest version built from docker hub

1 - build the image

- by building and running the image locally

```sh
docker build -t userName/ImageName:Tag .

docker build -t ramadan98/psy-back:latest .
```

- by downloading the pre-built image from docker hub

```sh
docker pull ramadan98/psy-back:latest
```

2 - run the image in a container in detached mode

```sh
docker run -dp localPort:containerPort --name containerName userName/ImageName:Tag

docker run -dp 8000:3000 --name psy ramadan98/psy-back:latest
```

if you downloaded the image from the remote docker repository you have to provide an env file in the string above as follows

```sh
docker run -dp 8000:3000 --name psy --env-file config.env ramadan98/psy-back:latest
```

3 - if you want to attach the logs of the container run

```sh
docker logs -f container

docker logs -f psy
```

4 - to stop/start the container run

```sh
docker stop psy
docker start psy
```

5 - to remove the container after stopping it

```sh
docker rm psy
```

6 - to remove the image

```sh
docker rmi userName/ImageName:Tag

docker rmi ramadan98/psy-back:latest
```

### using the local environment

- install the project dependencies

```sh
npm i
```

- run the application in dev mode

```sh
npm run dev
```

- to run test cases

```sh
npm test
```

- to run code coverage test

```sh
npm run test-with-coverage
```

For Contributing Follow this [Contributing.md](./Contributing.md) Guide lines

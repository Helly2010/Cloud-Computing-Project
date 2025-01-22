# Cloud-Computing-Project

## Documentation

All documentation in latex lives in the /documentation folder

## Running the UI

The UI is based on this repo https://github.com/DebasmitaMallick/React-e-Commerce-Website

### Commands

Go to the `/ui` folder with `cd ui`.

Install dependencies with `npm install`.

Run the react app with `npm start`.

## Running the backend

Use python 3.11 or higher

Install poetry

### Commands

go to the `/api` folder with `cd api`

run `poetry install`

run `poetry shell`

Install Docker in not installed already

To start the db with docker, run the below command in the project not in the api
`docker compose --env-file=.env.docker --profile dev up`

Inside the virtual environment run `python runner.py`

While running python runner.py, if Import error comes then try out below commands:

'pip install --upgrade pip'
'pip install "psycopg[binary,pool]'

To create a migration revision: `alembic revision --autogenerate -m "your migration title"`

To run the database migrations: `alembic upgrade head`

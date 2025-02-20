# Cloud-Computing-Project

## Documentation

All documentation in latex lives in the /documentation folder

## Running the UI

The UI is based on this repo https://github.com/DebasmitaMallick/React-e-Commerce-Website

### Commands

Go to the `/ui` folder with `cd ui`.

Install dependencies with `npm install`.

Run the react app with `npm start`.

### Paypal integration
go to the `/ui` folder with `cd ui`.

run npm install `@paypal/react-paypal-js`

Add Paypal Client id as REACT_APP_PAYPAL_CLIENT_ID in .env

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

To seed the database run: `python -m scripts.seed_db` on the api folder


## Additional commands to setup the infrastructure

Install the azure CLI tool and terraform.

Run `az account show`

Run `az account set --subscription "{your subscription id}"`

Run `az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/{your subscription id}"`

Now populate a `terraforom.tfvars` file in the `/infra` folder like so:

```terraform

TF_AZURE_APP_ID          = ""
TF_AZURE_DISPLAY_NAME    = ""
TF_AZURE_PASSWORD        = ""
TF_AZURE_TENANT          = ""
TF_AZURE_SUBSCRIPTION_ID = ""
POSTGRESQL_USERNAME      = ""
POSTGRESQL_PASSWORD      = ""

```

Run `terraform init`

Run `terraform plan -out=plan`

Run `terraform apply "plan"`

The services should be created.

The github action should work, if it does not then change the name of the azure app and review the credentials.

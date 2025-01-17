from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .repositories.postgres.connector import PostgreSQLDBConnector
from .routes import products_router, categories_router, orders_router, suppliers_router, stock_router
from .config.env_manager import get_settings

EnvManager = get_settings()


app = FastAPI()
PostgreSQLDBConnector.init_db(EnvManager.get_db_url())

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products_router)
app.include_router(categories_router)
app.include_router(orders_router)
app.include_router(suppliers_router)
app.include_router(stock_router)

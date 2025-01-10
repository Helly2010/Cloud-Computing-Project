from fastapi import FastAPI
from .routes import products_router


app = FastAPI()


app.include_router(products_router)

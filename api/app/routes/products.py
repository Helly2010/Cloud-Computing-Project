from fastapi import APIRouter

router = APIRouter()


@router.get("/products/")
async def get_products():
    return []


@router.post("/products/")
async def create_product():
    return []


@router.patch("/products/")
async def update_product():
    return []


@router.delete("/products/")
async def delete_product():
    return []

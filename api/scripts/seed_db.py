from app.config.env_manager import get_settings
from app.repositories.postgres.connector import PostgreSQLDBConnector
from app.repositories.db.models import Supplier, Category, Product, Stock
from sqlalchemy.ext.asyncio import AsyncSession

import random
import asyncio


async def seed_suppliers(db: AsyncSession) -> list[Supplier]:
    furniture_suppliers = [
        {"name": "Greenleaf Timber Co.", "address": "123 Main St", "phone": "555 - 1234", "email": "greenleaftimber@email.com"},
        {"name": "Oakdale Lumber Inc.", "address": "456 Oak Ave", "phone": "555 - 2345", "email": "oakdalelumber@email.com"},
        {"name": "Elmwood Woodworking", "address": "789 Elm St", "phone": "555 - 3456", "email": "elmwoodwoodworking@email.com"},
    ]
    db_suppliers = [
        Supplier(name=supplier["name"], address=supplier["address"], phone=supplier["phone"], email=supplier["email"])
        for supplier in furniture_suppliers
    ]

    db.add_all(db_suppliers)

    await db.commit()
    await db.flush()

    return db_suppliers


async def seed_categories(db: AsyncSession) -> list[Category]:
    furniture_categories = [
        {
            "name": "Sofas",
            "description": "A sofa is a piece of furniture that is seated on the floor or on a raised platform, often with cushions. It is a versatile piece of furniture that can be used for both comfort and style.",
        },
        {
            "name": "Armchairs",
            "description": "An armchair is a piece of furniture that has an armrest to support the back and arms to hold onto. It is designed for sitting or lounging, often with cushions or pillows.",
        },
        {
            "name": "Beds",
            "description": "A bed is a piece of furniture designed for sleeping. It typically has a mattress and a frame, and may have additional features such as headboards or footboards.",
        },
        {
            "name": "Desks",
            "description": "A desk is a piece of furniture used for working or studying. It typically has a flat surface with drawers, shelves, or other storage and may have a chair or stool to sit on.",
        },
        {
            "name": "Chairs",
            "description": "A chair is a piece of furniture designed for sitting. It can be made of various materials such as metal, wood, or plastic and may have additional features such as armrests or cushions.",
        },
        {
            "name": "Tables",
            "description": "A table is a flat piece of furniture used for dining, eating, or working. It typically has legs and a flat surface that can be used for various purposes such as holding objects, writing, or reading.",
        },
        {
            "name": "Coffee Tables",
            "description": "A coffee table is a piece of furniture used for serving food and drinks. It typically has a flat surface with legs and may have additional features such as drawers or shelves.",
        },
        {
            "name": "Dressers",
            "description": "A dresser is a piece of furniture that holds clothes and other personal items. It typically has drawers and shelves, and may have additional features such as a mirror or a light.",
        },
        {
            "name": "Bookshelves",
            "description": "A bookshelf is a piece of furniture used for storing books and other written materials. It typically has shelves with drawers and may have additional features such as a lid or a hanging system.",
        },
    ]

    db_categories = [
        Category(name=category["name"], description=category["description"], extra_info={}) for category in furniture_categories
    ]

    db.add_all(db_categories)

    await db.commit()

    await db.flush()

    return db_categories


async def seed_products(db: AsyncSession, categories: list[Category], suppliers: list[Supplier]):
    furniture_products = [
        {"category": "Sofas", "name": "Sofa", "description": "A cozy seating option for relaxing and unwinding."},
        {"category": "Armchairs", "name": "Armchair", "description": "A comfortable chair with armrests for added support."},
        {"category": "Beds", "name": "Bed", "description": "A sleek and modern option for a place to sleep."},
        {"category": "Desks", "name": "Desk", "description": "A versatile workspace for studying, working, or just lounging around."},
        {"category": "Chairs", "name": "Chair", "description": "A sturdy and comfortable option for sitting and working."},
        {"category": "Tables", "name": "Table", "description": "A flat surface perfect for dining, eating, or just lounging around."},
        {
            "category": "Coffee Tables",
            "name": "Coffee Table",
            "description": "A sturdy and stylish option for serving food and drinks.",
        },
        {
            "category": "Dressers",
            "name": "Dresser",
            "description": "A functional piece of furniture for storing clothing and other personal items.",
        },
        {
            "category": "Bookshelves",
            "name": "Bookshelf",
            "description": "A versatile piece of furniture for storing books and other written materials.",
        },
    ]

    category_id_by_name = {category.name: category.id for category in categories}

    wood_types = ["Oak", "Maple", "Pine", "Cherry", "Mahogany"]

    for product in furniture_products:
        for wood_type in wood_types:
            stock = Stock(quantity=random.randint(15, 30))
            db.add(stock)
            await db.flush()
            await db.refresh(stock)

            unit_price = random.randint(30 * 100, 1000 * 100)

            db_product = Product(
                name=f"{wood_type} {product['name']}",
                ean_code=random.randint(10000, 50000),
                category_id=category_id_by_name[product["category"]],
                supplier_id=random.choice(suppliers).id,
                stock_id=stock.id,
                description=f"{product['description']} Made of {wood_type}",
                public_unit_price=unit_price,
                supplier_unit_price=unit_price - unit_price / 10,
                img_link=f"/img/{product['name'].lower()}.png",
                reorder_level=10,
                currency="EUR",
                extra_info={"rating": random.randint(3, 5), "fast_delivery": random.choices([True, False], [0.7, 0.3])[0]},
            )
            db.add(db_product)
            await db.commit()


async def main():
    EnvManager = get_settings()
    PostgreSQLDBConnector.init_db(EnvManager.get_db_url())

    session = PostgreSQLDBConnector.sessionmaker()

    async with session as session:
        print("Seeding categories")
        categories = await seed_categories(session)
        print("Seeding suppliers")
        suppliers = await seed_suppliers(session)
        print("Seeding products")
        await seed_products(session, categories, suppliers)


if __name__ == "__main__":
    asyncio.run(main())

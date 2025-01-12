from functools import lru_cache


from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    AZURE_DATABASE_URL: str

    model_config = SettingsConfigDict(env_file=".env")

    def get_db_url(self) -> str:
        return f"postgresql+psycopg://{self.AZURE_DATABASE_URL}/webshopdb"


@lru_cache
def get_settings() -> Settings:
    return Settings()

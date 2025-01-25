from typing import Optional
from fastapi_mail import FastMail, ConnectionConfig


class EmailConnector:
    fm: Optional[FastMail] = None

    @classmethod
    def init_connector(cls, username: str, password: str, mail: str, port: int, server: str) -> None:
        cls.fm = FastMail(
            ConnectionConfig(
                MAIL_USERNAME=username,
                MAIL_PASSWORD=password,
                MAIL_PORT=port,
                MAIL_SERVER=server,
                MAIL_STARTTLS=True,
                MAIL_SSL_TLS=True,
                USE_CREDENTIALS=True,
                VALIDATE_CERTS=True,
                MAIL_FROM=mail,
            )
        )

    @classmethod
    def get_connector(cls) -> FastMail:
        if not cls.fm:
            raise ValueError("Cannot get connector before initializing")

        return cls.fm

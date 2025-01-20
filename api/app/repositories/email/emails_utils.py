from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
import os


conf = ConnectionConfig(
    MAIL_USERNAME="lowtech",
    MAIL_PASSWORD=os.environ.get("MAIL_PASSWORD"),
    MAIL_FROM="infolowtechgmbh@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_TLS=True,
    MAIL_SSL=False,
    USE_CREDENTIALS=True
)

async def send_email(recipient: EmailStr, subject: str, body: str):
    message = MessageSchema(
        subject=subject,
        recipients=[recipient],
        body=body,
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)

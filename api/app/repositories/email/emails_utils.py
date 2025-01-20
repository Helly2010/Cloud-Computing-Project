import os
from dotenv import load_dotenv
from fastapi_mail import FastMail, ConnectionConfig, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr
from typing import List

# Load environment variables
load_dotenv()

class ConnectionConfigSettings(ConnectionConfig):
    def __init__(self):
        super().__init__(
            MAIL_USERNAME=os.getenv('MAIL_USERNAME'),
            MAIL_PASSWORD=os.getenv('MAIL_PASSWORD'),
            MAIL_FROM=os.getenv('MAIL_FROM', 'noreply@example.com'),
            MAIL_PORT=int(os.getenv('MAIL_PORT', 587)),
            MAIL_SERVER=os.getenv('MAIL_SERVER', 'smtp.gmail.com'),
            MAIL_STARTTLS=True,
            MAIL_SSL_TLS=False,
            USE_CREDENTIALS=True,
            VALIDATE_CERTS=True
        )


conf = ConnectionConfigSettings()

fm = FastMail(conf)

class EmailSchema(BaseModel):
    email: List[EmailStr]
    body: dict

async def send_email(
    email_to: str, 
    subject: str, 
    body: str
):
    try:
        message = MessageSchema(
            subject=subject,
            recipients=[email_to],
            body=body,
            subtype='html'
        )
        
        await fm.send_message(message)
        print(f"Email sent successfully to {email_to}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

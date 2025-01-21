from fastapi_mail import FastMail, MessageSchema

from pydantic import BaseModel, EmailStr


class EmailSchema(BaseModel):
    email: list[EmailStr]
    body: dict


async def send_email(fm: FastMail, email_to: str, subject: str, body: str):
    try:
        message = MessageSchema(subject=subject, recipients=[email_to], body=body, subtype="html")

        await fm.send_message(message)
        print(f"Email sent successfully to {email_to}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

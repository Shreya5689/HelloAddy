import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

def send_reset_password_email(email: str, otp: str):
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = os.getenv("SMTP_PORT")
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")


    message = MIMEMultipart()
    message["From"] = smtp_user
    message["To"] = email
    message["Subject"] = "Password Reset Request"

    body = f"""
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <p>Your one time password is: {otp}</p>
    <p>If you did not request this, please ignore this email.</p>
    """
    message.attach(MIMEText(body, "html"))

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, email, message.as_string())
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
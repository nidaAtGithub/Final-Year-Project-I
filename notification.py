# notification.py
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv
load_dotenv()


# Load environment variable
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")

def send_fir_submission_email(to_email: str, fir_reference: str, full_name: str):
    """
    Sends an email notification to the citizen confirming FIR submission.
    """
    if not SENDGRID_API_KEY:
        print("SendGrid API key not found!")
        return False

    subject = f"FIR Submission Confirmation - {fir_reference}"
    content = f"""
    Dear {full_name},

    Your FIR has been successfully submitted with Reference ID: {fir_reference}.
    You can track your FIR status via the Citizen Portal.

    Thank you for using our online FIR system.

    Regards,
    Police Department
    """

    message = Mail(
        from_email="nmusahome123@gmail.com",
        to_emails=to_email,
        subject=subject,
        plain_text_content=content
    )

    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"Email sent! Status code: {response.status_code}")
        print(to_email)

        return True
    except Exception as e:
        print("Error sending email:", e)
        return False

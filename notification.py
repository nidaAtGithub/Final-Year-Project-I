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

# ─── NEW: Status update email ─────────────────────────────────────────────────
def send_status_update_email(to_email: str, full_name: str, fir_id: str, new_status: str, note: str = ""):
    if not SENDGRID_API_KEY or not to_email:
        print("Missing API key or email")
        return False

    status_messages = {
        "verified":     "Your FIR has been verified by the admin.",
        "under_review": "Your FIR is currently under review by the assigned officer.",
        "resolved":     "Your FIR has been resolved. The case is now closed.",
        "rejected":     "Your FIR has been reviewed and unfortunately rejected."
    }

    note_section = f"\nOfficer Note     : {note}" if note.strip() else ""

    content = f"""
Dear {full_name},

Your FIR status has been updated.

FIR Reference ID : {fir_id}
New Status       : {new_status.upper()}{note_section}

{status_messages.get(new_status, "")}

Please log in to the Citizen Portal to view full details.

Regards,
FIR Management System
    """

    message = Mail(
        from_email="nmusahome123@gmail.com",
        to_emails=to_email,
        subject=f"FIR Status Update: {fir_id} - {new_status.upper()}",
        plain_text_content=content
    )

    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"Status email sent to {to_email}, status: {response.status_code}")
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False


# ─── NEW: Officer assignment email ───────────────────────────────────────────
def send_assignment_email(to_email: str, officer_name: str, fir_id: str, crime_category: str, location: str, date: str):
    if not SENDGRID_API_KEY:
        print("Missing API key")
        return False

    content = f"""
Dear {officer_name},

You have been assigned a new FIR. Please review the details below:

FIR Reference ID : {fir_id}
Crime Category   : {crime_category}
Location         : {location}
Date of Incident : {date}

Please log in to the Police Portal to review the full case details.

Regards,
FIR Management System
    """

    message = Mail(
        from_email="nmusahome123@gmail.com",
        to_emails=to_email,
        subject=f"New FIR Assigned: {fir_id}",
        plain_text_content=content
    )

    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"Assignment email sent to {to_email}, status: {response.status_code}")
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False
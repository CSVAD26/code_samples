import mailbox
import csv
import email
from email.utils import parsedate_to_datetime

def extract_mbox_to_csv(mbox_path, csv_path):
    """
    Parse an mbox file and extract email metadata into a CSV.

    Fields:
        - From: Sender email address
        - To: Recipient email address
        - Length: Length of email body in characters
        - Date: Date sent (ISO format if possible)
    """
    # Open mbox file
    mbox = mailbox.mbox(mbox_path)

    # Prepare CSV output
    with open(csv_path, mode='w', newline='', encoding='utf-8') as csv_file:
        fieldnames = ['from', 'to', 'length', 'date']
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()

        # Iterate through messages
        for message in mbox:
            try:
                # Handle "From" and "To" fields
                from_addr = message.get('From', '').strip()
                to_addr = message.get('To', '').strip()

                # Parse date safely
                date_header = message.get('Date')
                try:
                    date_sent = parsedate_to_datetime(date_header).isoformat() if date_header else ''
                except Exception:
                    date_sent = date_header or ''

                # Extract plain text body
                body = ''
                if message.is_multipart():
                    for part in message.walk():
                        if part.get_content_type() == 'text/plain':
                            try:
                                body += part.get_payload(decode=True).decode(part.get_content_charset('utf-8'), errors='replace')
                            except Exception:
                                pass
                else:
                    try:
                        body = message.get_payload(decode=True).decode(message.get_content_charset('utf-8'), errors='replace')
                    except Exception:
                        body = str(message.get_payload())

                # Compute body length
                body_length = len(body)

                # Write to CSV
                writer.writerow({
                    'from': from_addr,
                    'to': to_addr,
                    'length': body_length,
                    'date': date_sent
                })

            except Exception as e:
                print(f"Skipping message due to error: {e}")

    print(f"✅ Extraction complete. Data saved to: {csv_path}")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Extract basic email metadata from an mbox file into a CSV.")
    parser.add_argument("mbox_path", help="Path to the input .mbox file")
    parser.add_argument("csv_path", help="Path to save the output .csv file")
    args = parser.parse_args()

    extract_mbox_to_csv(args.mbox_path, args.csv_path)

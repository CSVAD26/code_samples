import xml.etree.ElementTree as ET
import csv

# Path to your Apple Health export.xml
INPUT_FILE = "export.xml"
OUTPUT_FILE = "apple_health_sleep.csv"

def extract_sleep_data(input_file, output_file):
    # Parse the XML tree
    tree = ET.parse(input_file)
    root = tree.getroot()

    # Namespace is sometimes included; handle if present
    records = root.findall(".//Record")

    sleep_records = []

    for record in records:
        if record.attrib.get("type") == "HKCategoryTypeIdentifierSleepAnalysis":
            start = record.attrib.get("startDate")
            end = record.attrib.get("endDate")
            value = record.attrib.get("value")  # e.g. “HKCategoryValueSleepAnalysisInBed”
            source = record.attrib.get("sourceName", "")
            duration_hrs = None

            # compute duration (in hours)
            from datetime import datetime
            fmt = "%Y-%m-%d %H:%M:%S %z"
            try:
                start_dt = datetime.strptime(start, fmt)
                end_dt = datetime.strptime(end, fmt)
                duration_hrs = (end_dt - start_dt).total_seconds() / 3600
            except Exception:
                pass

            sleep_records.append({
                "start": start,
                "end": end,
                "duration_hrs": duration_hrs,
                "category": value,
                "source": source,
            })

    # Write to CSV
    with open(output_file, "w", newline="", encoding="utf-8") as csvfile:
        fieldnames = ["start", "end", "duration_hrs", "category", "source"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(sleep_records)

    print(f"✅ Extracted {len(sleep_records)} sleep records to {output_file}")

if __name__ == "__main__":
    extract_sleep_data(INPUT_FILE, OUTPUT_FILE)

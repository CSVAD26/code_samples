import xml.etree.ElementTree as ET
import csv
import sys

def extract_cycling_workouts(xml_path, csv_path="cycling_workouts.csv"):
    print(f"Parsing XML file: {xml_path}")
    tree = ET.parse(xml_path)
    root = tree.getroot()

    workouts = root.findall("Workout")
    cycling_data = []

    for workout in workouts:
        if workout.attrib.get("workoutActivityType") == "HKWorkoutActivityTypeCycling":
            # Defaults (some older exports store these at top level)
            total_distance = workout.attrib.get("totalDistance")
            total_energy = workout.attrib.get("totalEnergyBurned")

            # Some exports store stats in nested WorkoutStatistics elements
            for stat in workout.findall("WorkoutStatistics"):
                stat_type = stat.attrib.get("type")
                if stat_type == "HKQuantityTypeIdentifierDistanceCycling":
                    total_distance = stat.attrib.get("sum")
                elif stat_type == "HKQuantityTypeIdentifierActiveEnergyBurned":
                    total_energy = stat.attrib.get("sum")

            data = {
                "startDate": workout.attrib.get("startDate"),
                "endDate": workout.attrib.get("endDate"),
                "duration_minutes": workout.attrib.get("duration"),
                "totalDistance_miles": total_distance,
                "totalEnergyBurned_cal": total_energy,
                "sourceName": workout.attrib.get("sourceName"),
                "sourceVersion": workout.attrib.get("sourceVersion"),
                "device": workout.attrib.get("device"),
            }
            cycling_data.append(data)

    print(f"Found {len(cycling_data)} cycling workouts")

    if cycling_data:
        with open(csv_path, "w", newline="", encoding="utf-8") as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=cycling_data[0].keys())
            writer.writeheader()
            writer.writerows(cycling_data)
        print(f"Cycling workouts written to: {csv_path}")
    else:
        print("No cycling workouts found.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_cycling_workouts_csv.py export.xml [output.csv]")
        sys.exit(1)
    
    xml_file = sys.argv[1]
    csv_file = sys.argv[2] if len(sys.argv) > 2 else "cycling_workouts.csv"
    extract_cycling_workouts(xml_file, csv_file)

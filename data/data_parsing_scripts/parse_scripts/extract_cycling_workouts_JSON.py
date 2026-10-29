# Extracts cycling workouts from an Apple Health export (export.xml) and saves
# them as a JSON file: a list with one object per workout.
#
# Usage: python extract_cycling_workouts_JSON.py export.xml [output.json]
#
# Apple Health: Health app > profile picture > Export All Health Data.
# Unzip the download and use the export.xml file inside it.

import xml.etree.ElementTree as ET  # built-in XML parser
import json
import os
import sys
from datetime import datetime

# JSON keys, in order. They match the columns of extract_cycling_workouts_CSV.py.
# The unit fields record the unit Apple stored; it follows the phone's settings,
# so it is not always miles. Apple's energy unit "Cal" means kilocalories.
# Name and device are left out on purpose: they identify the owner and the
# sketches do not use them.
FIELDS = [
    "startDate",
    "endDate",
    "duration_minutes",
    "totalDistance_miles",
    "distance_unit",
    "totalEnergyBurned_cal",
    "energy_unit",
    "sourceVersion",
]

DATE_FORMAT = "%Y-%m-%d %H:%M:%S %z"  # e.g. 2023-10-16 14:08:33 -0700

def extract_cycling_workouts(xml_path, json_path="cycling_workouts.json"):
    print(f"Parsing XML file: {xml_path}")
    cycling_data = []  # one dictionary per cycling workout
    missing_stats = 0  # workouts without a distance or energy value

    # iterparse reads the file piece by piece instead of loading all of it
    # into memory (an Apple Health export can be close to 1 GB).
    # Events: "start" = a tag opened, "end" = a tag and its children finished.
    context = ET.iterparse(xml_path, events=("start", "end"))
    _, root = next(context)  # the first event is the root element

    for event, elem in context:
        if event != "end":
            continue

        # Each workout (running, cycling, swimming...) is a <Workout> element
        if elem.tag == "Workout":
            # Values are stored as XML attributes; keep only cycling workouts
            if elem.attrib.get("workoutActivityType") == "HKWorkoutActivityTypeCycling":
                # Defaults (some older exports store these at top level)
                total_distance = elem.attrib.get("totalDistance")
                distance_unit = elem.attrib.get("totalDistanceUnit")
                total_energy = elem.attrib.get("totalEnergyBurned")
                energy_unit = elem.attrib.get("totalEnergyBurnedUnit")

                # Some exports store stats in nested WorkoutStatistics elements;
                # if found, they replace the defaults above
                for stat in elem.findall("WorkoutStatistics"):
                    stat_type = stat.attrib.get("type")
                    if stat_type == "HKQuantityTypeIdentifierDistanceCycling":
                        total_distance = stat.attrib.get("sum")
                        distance_unit = stat.attrib.get("unit")
                    elif stat_type == "HKQuantityTypeIdentifierActiveEnergyBurned":
                        total_energy = stat.attrib.get("sum")
                        energy_unit = stat.attrib.get("unit")

                if total_distance is None or total_energy is None:
                    missing_stats += 1

                # One object of the JSON list; the keys must match FIELDS
                cycling_data.append({
                    "startDate": elem.attrib.get("startDate"),
                    "endDate": elem.attrib.get("endDate"),
                    "duration_minutes": elem.attrib.get("duration"),
                    "totalDistance_miles": total_distance,
                    "distance_unit": distance_unit,
                    "totalEnergyBurned_cal": total_energy,
                    "energy_unit": energy_unit,
                    "sourceVersion": elem.attrib.get("sourceVersion"),
                })

        # Free finished elements so memory stays flat. A Workout is cleared only
        # after its own children have been read above.
        if elem.tag in ("Workout", "Record"):
            root.clear()

    # Sort by start time (parsed, so a change of time zone offset sorts correctly)
    cycling_data.sort(key=lambda row: datetime.strptime(row["startDate"], DATE_FORMAT))

    print(f"Found {len(cycling_data)} cycling workouts")
    if missing_stats:
        print(f"Warning: {missing_stats} workout(s) have no distance or energy value")


    # Only write a file if at least one workout was found
    if cycling_data:
        with open(json_path, "w", encoding="utf-8") as jsonfile:
            # Missing values are written as null; ensure_ascii=False keeps
            # non-English characters readable instead of \u escapes
            json.dump(cycling_data, jsonfile, indent=2, ensure_ascii=False)
        print(f"Cycling workouts written to: {json_path}")
    else:
        print("No cycling workouts found.")

# Runs only when the file is executed directly, not when imported
if __name__ == "__main__":
    # sys.argv[0] is the script name; the first argument is the XML path
    if len(sys.argv) < 2:
        print("Usage: python extract_cycling_workouts_JSON.py export.xml [output.json]")
        sys.exit(1)
    
    xml_file = sys.argv[1]
    if not os.path.exists(xml_file):
        print(f"File not found: {xml_file}")
        sys.exit(1)
    # The output path is optional and defaults to cycling_workouts.json
    json_file = sys.argv[2] if len(sys.argv) > 2 else "cycling_workouts.json"
    extract_cycling_workouts(xml_file, json_file)

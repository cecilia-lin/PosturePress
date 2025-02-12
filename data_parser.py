# python file that will process and parse the data from the directory
import glob
import json
import os

import numpy as np
import pandas as pd


def getting_metaInfo_experiment_i(directory_path):
    return pd.read_csv(os.path.join(directory_path, "experiment-i/subject-info-i.csv"))


def getting_metaInfo_experiment_ii(directory_path):
    return pd.read_csv(
        os.path.join(directory_path, "experiment-ii/subject-info-ii.csv")
    )


def reading_experiment_i_data(directory_path):
    subject_posture_data = {}
    subject_folders = sorted(
        glob.glob(os.path.join(directory_path, "S*"))
    )  # e.g., "S1", "S2", etc.

    for subject in subject_folders:
        subject_id = os.path.basename(subject)
        subject_posture_data[subject_id] = {}

        txt_files = sorted(glob.glob(os.path.join(subject, "*.txt")))

        for txt_file in txt_files:
            posture_id = os.path.splitext(os.path.basename(txt_file))[
                0
            ]  # Extract posture name (e.g., "1", "2")

            # Manually read and clean the file
            cleaned_data = []
            with open(txt_file, "r") as f:
                for line in f:
                    line = line.strip()
                    if line and not any(
                        c.isalpha() for c in line
                    ):  # Ignore empty lines and non-numeric separators
                        cleaned_data.append(
                            [float(x) for x in line.split("\t")]
                        )  # Convert valid numeric data

            # Convert to NumPy array
            data = np.array(cleaned_data)

            # **Convert raw values (0-1000) to mmHg (0-100)**
            data = data * 0.1  # Apply conversion factor

            # Compute the number of frames
            total_values = data.size
            num_frames = total_values // (32 * 64)

            frames = data[: num_frames * 64 * 32].reshape(num_frames, 64, 32)
            frames = frames[2:]  # Only start at frame 3

            # Store frames under subject -> posture
            subject_posture_data[subject_id][posture_id] = frames.tolist()

    return subject_posture_data


def reading_experiment_ii_data(directory_path):
    subject_posture_data = {}
    subject_folders = sorted(
        glob.glob(os.path.join(directory_path, "S*"))
    )  # e.g., "S1", "S2", etc.

    for subject in subject_folders:

        subject_id = os.path.basename(subject)

        if subject_id == "SHA256SUMS.txt":
            continue

        subject_posture_data[subject_id] = {}
        # open and process each folder in the subject folder
        for mat_kind in os.listdir(subject):

            mat_name = os.path.basename(mat_kind)

            subject_posture_data[subject_id][mat_name] = {}

            for posture in os.listdir(os.path.join(subject, mat_kind)):
                posture_id = os.path.splitext(os.path.basename(posture))[
                    0
                ]  # Extract posture name (e.g., "1", "2")

                # Manually read and clean the file
                cleaned_data = []
                with open(os.path.join(subject, mat_kind, posture), "r") as f:
                    for line in f:
                        line = line.strip()
                        if line and not any(
                            c.isalpha() for c in line
                        ):  # Ignore empty lines and non-numeric separators
                            cleaned_data.extend(
                                [float(x) for x in line.split(" ")]
                            )  # Concatenate all numbers into a single sequence

                data = cleaned_data
                subject_posture_data[subject_id][mat_name][posture_id] = data

    return subject_posture_data


if __name__ == "__main__":
    # clean and save the cleaned data
    directory_path = "data"
    experiment_i_data = reading_experiment_i_data(directory_path + "/experiment-i")
    experiment_ii_data = reading_experiment_ii_data(directory_path + "/experiment-ii")
    experiment_i_meta = getting_metaInfo_experiment_i(directory_path)
    experiment_ii_meta = getting_metaInfo_experiment_ii(directory_path)

    # Save the data to JSON files
    with open("cleaned_data/experiment_i_data.json", "w") as f:
        json.dump(experiment_i_data, f)

    with open("cleaned_data/experiment_ii_data.json", "w") as f:
        json.dump(experiment_ii_data, f)

    # Save the meta information to CSV files
    experiment_i_meta.to_csv("cleaned_data/experiment_i_meta.csv", index=False)
    experiment_ii_meta.to_csv("cleaned_data/experiment_ii_meta.csv", index=False)

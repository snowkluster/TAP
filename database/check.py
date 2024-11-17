#!/usr/bin/env python3

import os
import pandas as pd

csv_dir = '.'

def clean_columns(columns):
    return [col.strip() for col in columns]

def check_columns_for_prefix(prefix):
    columns_dict = {}
    for csv_file in os.listdir(csv_dir):
        if csv_file.endswith('.csv') and csv_file.startswith(prefix):
            df = pd.read_csv(os.path.join(csv_dir, csv_file))
            cleaned_columns = clean_columns(df.columns)
            columns_dict[csv_file] = set(cleaned_columns)

    print(f"\nColumns for each file with the prefix '{prefix}':\n")
    for file, columns in columns_dict.items():
        print(f"{file}: {columns}")
    column_sets = list(columns_dict.values())
    if all(cols == column_sets[0] for cols in column_sets):
        print(f"\nAll CSV files with the prefix '{prefix}' have the same columns.")
        return True
    else:
        print(f"\nCSV files with the prefix '{prefix}' have different columns.\n")
        print("Differences between files:")
        reference_columns = column_sets[0]
        for file, columns in columns_dict.items():
            diff_cols = reference_columns.symmetric_difference(columns)
            if diff_cols:
                print(f"File '{file}' has the following column differences: {diff_cols}")
            else:
                print(f"File '{file}' has no column differences compared to the others.")

        return False


prefix = 'breach' # Change This
are_columns_consistent = check_columns_for_prefix(prefix)

if are_columns_consistent:
    print(f"The columns are consistent across all files with prefix '{prefix}'.")
else:
    print(f"The columns are inconsistent across files with prefix '{prefix}'.")

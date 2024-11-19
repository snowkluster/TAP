import glob
import sqlite3
import pandas as pd

def print_csv_info(file_path):
    """Print diagnostic information about the CSV file"""
    try:
        # Read first few lines of CSV directly
        with open(file_path, 'r', encoding='utf-8') as f:
            print(f"\nFirst few lines of {file_path}:")
            for i, line in enumerate(f):
                if i < 5:  # Print first 5 lines
                    print(line.strip())
                else:
                    break

        # Read with pandas and print info
        df = pd.read_csv(file_path)
        print(f"\nColumns in {file_path}:")
        for col in df.columns:
            print(f"- {col} (sample value: {df[col].iloc[0] if len(df) > 0 else 'no data'})")

        return df
    except Exception as e:
        print(f"Error reading {file_path}: {str(e)}")
        return None


def clean_dataframe(df):
    """Clean dataframe and map columns correctly"""
    # Create a mapping of possible column names to standard names
    column_mapping = {
        'name': 'post_name',
        'title': 'post_name',
        'post_title': 'post_name',
        'author': 'post_author',
        'username': 'post_author',
        'user': 'post_author',
        'author_url': 'post_author_url',
        'profile_url': 'post_author_url',
        'link': 'post_link',
        'url': 'post_link',
        'date': 'post_date',
        'posted_date': 'post_date',
        'timestamp': 'post_date',
        'view_count': 'views',
        'views_count': 'views',
        'reply_count': 'replies',
        'replies_count': 'replies',
        'response_count': 'replies'
    }

    # Convert all column names to lowercase
    df.columns = [col.lower().strip() for col in df.columns]

    # Try to map columns based on the mapping
    for old_col in df.columns:
        if old_col in column_mapping:
            df = df.rename(columns={old_col: column_mapping[old_col]})

    # Replace various forms of NULL
    df = df.replace(['', 'NULL', 'null', 'None', 'none'], None)

    # Convert numeric columns
    numeric_cols = ['views', 'replies']
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0).astype(int)

    return df


def process_csv_files():
    # Create/connect to SQLite database
    conn = sqlite3.connect('output.db')
    cursor = conn.cursor()

    # Get all CSV files in current directory
    csv_files = glob.glob('*.csv')

    print(f"Found {len(csv_files)} CSV files: {', '.join(csv_files)}")

    # Dictionary to store dataframes by table name
    table_data = {}

    for file in csv_files:
        print(f"\nProcessing {file}...")

        # Split filename to get base name and type
        base_name = file.split('_')[0]
        file_type = file.split('_')[1].split('.')[0]

        # Print diagnostic information and get dataframe
        df = print_csv_info(file)

        if df is not None:
            try:
                # Clean the dataframe
                df = clean_dataframe(df)

                # Add type column
                df['type'] = file_type

                # If table already exists in dictionary, append to it
                if base_name in table_data:
                    print(f"Appending to existing table {base_name}")
                    table_data[base_name] = pd.concat([table_data[base_name], df], ignore_index=True)
                else:
                    print(f"Creating new table {base_name}")
                    table_data[base_name] = df

            except Exception as e:
                print(f"Error processing {file}: {str(e)}")

    # Write all tables to SQLite database
    for table_name, df in table_data.items():
        try:
            # Create indices for numeric columns
            create_table_sql = f'''
            CREATE TABLE IF NOT EXISTS {table_name} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                post_name TEXT,
                post_author TEXT,
                post_author_url TEXT,
                post_link TEXT,
                post_date TEXT,
                views INTEGER,
                replies INTEGER,
                type TEXT
            )
            '''
            cursor.execute(create_table_sql)

            # Write to SQLite
            df.to_sql(table_name, conn, if_exists='replace', index=False)

            # Add indices for better query performance
            cursor.execute(f"CREATE INDEX IF NOT EXISTS idx_{table_name}_type ON {table_name}(type)")
            cursor.execute(f"CREATE INDEX IF NOT EXISTS idx_{table_name}_date ON {table_name}(post_date)")

            # Print sample of data
            print(f"\nSample of data written to {table_name}:")
            sample_df = pd.read_sql(f"SELECT * FROM {table_name} LIMIT 5", conn)
            print(sample_df)

            # Get row count
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = cursor.fetchone()[0]
            print(f"Table {table_name} has {count} rows")

        except Exception as e:
            print(f"Error writing table {table_name}: {str(e)}")

    conn.close()


if __name__ == "__main__":
    process_csv_files()
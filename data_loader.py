import sqlite3
import psycopg2
import psycopg2.extras  # Import psycopg2 extras for bulk inserts


# Function to connect to SQLite
def connect_sqlite(db_path):
    conn = sqlite3.connect(db_path)
    return conn


# Function to connect to PostgreSQL
def connect_postgres(host, dbname, user, password):
    conn = psycopg2.connect(
        host=host,
        dbname=dbname,
        user=user,
        password=password
    )
    return conn


# Function to fetch SQLite schema and data
def fetch_sqlite_schema_and_data(sqlite_conn):
    cursor = sqlite_conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")

    tables = cursor.fetchall()
    schema_data = {}

    for table in tables:
        table_name = table[0]
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = cursor.fetchall()

        schema_data[table_name] = {
            'columns': [column[1] for column in columns],
            'data': []
        }

        # Fetch all data from the table
        cursor.execute(f"SELECT * FROM {table_name};")
        schema_data[table_name]['data'] = cursor.fetchall()

    return schema_data


# Function to create tables in PostgreSQL with correct handling of column names and types
def create_postgres_tables(postgres_conn, schema_data):
    cursor = postgres_conn.cursor()

    for table_name, table_info in schema_data.items():
        columns = table_info['columns']

        # Assuming TEXT for all columns, but you may need to adjust this if there are other types
        column_defs = []
        for column in columns:
            # Enclose column names in double quotes to handle reserved words or spaces
            column_defs.append(f'"{column}" TEXT')  # Defaulting to TEXT, but could be improved

        # Create table query
        create_table_query = f"CREATE TABLE IF NOT EXISTS \"{table_name}\" ({', '.join(column_defs)});"

        try:
            cursor.execute(create_table_query)
        except Exception as e:
            print(f"Error creating table {table_name}: {e}")
            continue

    postgres_conn.commit()


# Function to insert data into PostgreSQL
# Function to insert data into PostgreSQL
def insert_data_into_postgres(postgres_conn, schema_data):
    cursor = postgres_conn.cursor()

    for table_name, table_info in schema_data.items():
        columns = table_info['columns']
        data = table_info['data']

        # Enclose column names in double quotes to handle reserved words or spaces
        quoted_columns = [f'"{col}"' for col in columns]

        insert_query = f"INSERT INTO \"{table_name}\" ({', '.join(quoted_columns)}) VALUES %s"

        try:
            print(f"Inserting data into table \"{table_name}\"")  # Debugging line
            psycopg2.extras.execute_values(cursor, insert_query, data)
            print(f"Data inserted into table \"{table_name}\" successfully.")  # Debugging line
        except Exception as e:
            print(f"Error inserting data into {table_name}: {e}")

    postgres_conn.commit()


# Main function to perform the conversion
def convert_sqlite_to_postgres(sqlite_db_path, postgres_host, postgres_db, postgres_user, postgres_password):
    # Connect to SQLite and PostgreSQL
    sqlite_conn = connect_sqlite(sqlite_db_path)
    postgres_conn = connect_postgres(postgres_host, postgres_db, postgres_user, postgres_password)

    # Fetch schema and data from SQLite
    schema_data = fetch_sqlite_schema_and_data(sqlite_conn)

    # Create tables in PostgreSQL
    create_postgres_tables(postgres_conn, schema_data)

    # Insert data into PostgreSQL
    insert_data_into_postgres(postgres_conn, schema_data)

    # Close connections
    sqlite_conn.close()
    postgres_conn.close()
    print("Conversion complete!")


# Example usage with your provided database details
sqlite_db_path = 'database/output.db'  # Path to your SQLite database
postgres_host = 'localhost'  # PostgreSQL host (localhost)
postgres_db = 'darkweb'  # PostgreSQL database name
postgres_user = 'dbuser'  # PostgreSQL user
postgres_password = 'dbpassword'  # PostgreSQL password

convert_sqlite_to_postgres(sqlite_db_path, postgres_host, postgres_db, postgres_user, postgres_password)

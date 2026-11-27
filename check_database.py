
import sqlite3
import os

database_path = os.path.join("database", "lifeprint.db")

if not os.path.exists(database_path):
    print("Database file not found!")
else:
    connection = sqlite3.connect(database_path)

    cursor = connection.cursor()

    cursor.execute(
        "SELECT name FROM sqlite_master WHERE type = 'table'"
    )

    tables = cursor.fetchall()

    print("\nLIFEPRINT DATABASE TABLES:")
    print("--------------------------")

    for table in tables:
        print(table[0])

    connection.close()


import sqlite3

connection = sqlite3.connect("database/lifeprint.db")

cursor = connection.cursor()

cursor.execute("PRAGMA table_info(profiles)")

columns = cursor.fetchall()

print("\nPROFILE TABLE COLUMNS:")
print("----------------------")

for column in columns:
    print(column[1])

connection.close()

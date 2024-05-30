import pyarrow as pa

# Create some sample data
data = {
    'column1': ['Hello', 'World'],
    'column2': [1, 2]
}

# Convert the data to an Arrow Table
table = pa.Table.from_pydict(data)

# Print the table to see its structure
print(table)

# Save the table to a file
with open('hello_world.arrow', 'wb') as f:
    writer = pa.RecordBatchFileWriter(f, table.schema)
    writer.write_table(table)
    writer.close()

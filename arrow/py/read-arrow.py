import pyarrow as pa

# Path to your Arrow file
file_path = '../data/hello_world.arrow'

# Read the Arrow file
with open(file_path, 'rb') as f:
    reader = pa.ipc.open_file(f)
    table = reader.read_all()

# Now 'table' contains your data in the form of a PyArrow Table
print(table)

# You can convert it to a pandas DataFrame if you prefer
df = table.to_pandas()
print(df)

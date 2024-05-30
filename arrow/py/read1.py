# https://www.youtube.com/watch?v=akfsWPsvmrM
import pyarrow as pa
import numpy as np
import pyarrow.compute as pc
import pyarrow.csv as arrowcsv
import pandas as pd
import pyarrow.parquet as pq

mmap_file = pa.memory_map("../data/hello_world.arrow", "r")

table = pa.ipc.RecordBatchFileReader(mmap_file).read_all()

col1 = pa.ipc.RecordBatchFileReader(mmap_file).read_all().column("column1")

df = table.to_pandas
# df = col1.to_pandas

print(df)
print(col1)

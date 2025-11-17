#!/usr/bin/env python3
"""
Basit SQL Server -> Supabase PostgreSQL converter
"""
import re
import sys

def sql_to_pg_type(sql_type, nullable=True):
    """SQL Server tipini PostgreSQL'e çevirir."""
    sql_type = sql_type.upper().strip()
    
    # IDENTITY -> SERIAL
    if 'IDENTITY' in sql_type:
        return 'SERIAL'
    
    # Type mappings
    if sql_type.startswith('INT'):
        return 'INTEGER'
    elif sql_type.startswith('SMALLINT'):
        return 'SMALLINT'
    elif sql_type.startswith('BIGINT'):
        return 'BIGINT'
    elif sql_type.startswith('BIT'):
        return 'BOOLEAN'
    elif sql_type.startswith('FLOAT'):
        return 'DOUBLE PRECISION'
    elif sql_type.startswith('DATE'):
        return 'DATE'
    elif sql_type.startswith('TIME'):
        return 'TIME'
    elif sql_type.startswith('DATETIME') or sql_type.startswith('SMALLDATETIME'):
        return 'TIMESTAMP'
    elif sql_type.startswith('VARCHAR') or sql_type.startswith('NVARCHAR'):
        # Extract size
        size_match = re.search(r'\((\d+|MAX)\)', sql_type)
        if size_match and size_match.group(1) != 'MAX':
            return f"VARCHAR({size_match.group(1)})"
        return 'TEXT'
    elif sql_type.startswith('CHAR') or sql_type.startswith('NCHAR'):
        size_match = re.search(r'\((\d+)\)', sql_type)
        if size_match:
            return f"CHAR({size_match.group(1)})"
        return 'CHAR'
    elif sql_type.startswith('TEXT') or sql_type.startswith('NTEXT'):
        return 'TEXT'
    elif sql_type.startswith('DECIMAL') or sql_type.startswith('NUMERIC'):
        size_match = re.search(r'\((\d+),(\d+)\)', sql_type)
        if size_match:
            return f"NUMERIC({size_match.group(1)},{size_match.group(2)})"
        return 'NUMERIC'
    else:
        return 'TEXT'  # Fallback

# Read file line by line
tables = []
current_table = None
in_table = False
table_content = []

print("Dosya okunuyor...")

with open('deneme.sql', 'r', encoding='utf-16-le', errors='ignore') as f:
    for line in f:
        # Check for table start
        if 'Object:' in line and 'Table' in line and '[dbo]' in line:
            # Extract table name
            match = re.search(r'\[dbo\]\.\[(\w+)\]', line)
            if match:
                if current_table:
                    tables.append((current_table, table_content))
                current_table = match.group(1)
                table_content = []
                in_table = False
                print(f"Tablo bulundu: {current_table}")
        
        # Check for CREATE TABLE
        if current_table and 'CREATE TABLE' in line and current_table in line:
            in_table = True
        
        # Collect table content
        if in_table:
            table_content.append(line)
            if line.strip() == 'GO' or (line.strip().startswith('CREATE TABLE') and current_table not in line):
                in_table = False
                if current_table:
                    tables.append((current_table, ''.join(table_content)))
                    current_table = None
                    table_content = []

# Add last table
if current_table:
    tables.append((current_table, ''.join(table_content)))

print(f"\nToplam {len(tables)} tablo bulundu")

# Generate Supabase migration
with open('supabase_migration.sql', 'w', encoding='utf-8') as out:
    out.write("-- Supabase PostgreSQL Migration\n")
    out.write("-- Generated from SQL Server schema\n\n")
    out.write("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";\n\n")
    
    for table_name, table_def in tables:
        out.write(f"-- Table: {table_name.lower()}\n")
        out.write(f"CREATE TABLE IF NOT EXISTS {table_name.lower()} (\n")
        
        # Parse columns from table_def
        lines = table_def.split('\n')
        columns = []
        pk_cols = []
        
        for line in lines:
            line = line.strip()
            if not line or line.startswith('CREATE TABLE') or line.startswith('SET ') or line == 'GO':
                continue
            
            # Check for PRIMARY KEY constraint
            if 'PRIMARY KEY' in line.upper() and 'CONSTRAINT' in line.upper():
                pk_match = re.search(r'\[(\w+)\]\s+ASC', line)
                if pk_match:
                    pk_cols.append(pk_match.group(1).lower())
                # Also check multi-column PK
                pk_match2 = re.search(r'\[(\w+)\]\s+ASC', table_def)
                if pk_match2 and pk_match2.group(1) not in pk_cols:
                    pk_cols.append(pk_match2.group(1).lower())
            
            # Parse column: [ColumnName] [Type] [attributes]
            col_match = re.match(r'\[(\w+)\]\s+\[(\w+(?:\([^)]*\))?)\]\s+(.*)', line)
            if col_match:
                col_name = col_match.group(1).lower()
                col_type = col_match.group(2)
                col_attrs = col_match.group(3)
                
                is_identity = 'IDENTITY' in col_attrs.upper()
                is_nullable = 'NOT NULL' not in col_attrs.upper() and not is_identity
                
                pg_type = sql_to_pg_type(col_type, is_nullable)
                if is_identity:
                    pg_type = 'SERIAL'
                    is_nullable = False
                
                col_def = f"    {col_name} {pg_type}"
                if not is_nullable and not is_identity:
                    col_def += " NOT NULL"
                
                columns.append(col_def)
        
        # Write columns
        if columns:
            out.write(",\n".join(columns))
        
        # Add primary key
        if pk_cols:
            out.write(f",\n    CONSTRAINT pk_{table_name.lower()} PRIMARY KEY ({', '.join(pk_cols)})")
        
        out.write("\n);\n\n")

print("✅ Migration dosyası oluşturuldu: supabase_migration.sql")


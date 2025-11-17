#!/usr/bin/env python3
"""
SQL Server deneme.sql dosyasını parse edip Supabase PostgreSQL migration script'leri oluşturur.
"""
import re
import os
from typing import Dict, List, Tuple

def sql_type_to_pg(sql_type: str, nullable: bool = True) -> str:
    """SQL Server tipini PostgreSQL tipine çevirir."""
    sql_type = sql_type.upper().strip()
    
    # IDENTITY handling
    if 'IDENTITY' in sql_type:
        if nullable:
            return 'SERIAL'
        return 'SERIAL NOT NULL'
    
    # Type mappings
    type_map = {
        'INT': 'INTEGER',
        'SMALLINT': 'SMALLINT',
        'BIGINT': 'BIGINT',
        'TINYINT': 'SMALLINT',
        'BIT': 'BOOLEAN',
        'FLOAT': 'DOUBLE PRECISION',
        'REAL': 'REAL',
        'MONEY': 'NUMERIC(19,4)',
        'SMALLMONEY': 'NUMERIC(10,4)',
        'DATE': 'DATE',
        'TIME': 'TIME',
        'DATETIME': 'TIMESTAMP',
        'SMALLDATETIME': 'TIMESTAMP',
        'DATETIME2': 'TIMESTAMP',
        'DATETIMEOFFSET': 'TIMESTAMPTZ',
        'CHAR': 'CHAR',
        'VARCHAR': 'VARCHAR',
        'NVARCHAR': 'VARCHAR',
        'TEXT': 'TEXT',
        'NTEXT': 'TEXT',
        'NCHAR': 'CHAR',
        'BINARY': 'BYTEA',
        'VARBINARY': 'BYTEA',
        'IMAGE': 'BYTEA',
        'UNIQUEIDENTIFIER': 'UUID',
        'XML': 'XML',
        'DECIMAL': 'DECIMAL',
        'NUMERIC': 'NUMERIC',
    }
    
    # Extract base type and size
    base_type = None
    size = None
    
    for stype, pgtype in type_map.items():
        if sql_type.startswith(stype):
            base_type = pgtype
            # Extract size if present
            size_match = re.search(r'\((\d+)(?:,\s*(\d+))?\)', sql_type)
            if size_match:
                if stype in ['VARCHAR', 'NVARCHAR', 'CHAR', 'NCHAR']:
                    size = size_match.group(1)
                elif stype in ['DECIMAL', 'NUMERIC']:
                    size = f"{size_match.group(1)},{size_match.group(2) or '0'}"
            break
    
    if not base_type:
        # Default fallback
        if 'MAX' in sql_type or 'TEXT' in sql_type or 'NTEXT' in sql_type:
            base_type = 'TEXT'
        else:
            base_type = 'TEXT'  # Safe fallback
    
    # Build final type
    if size:
        if ',' in size:
            result = f"{base_type}({size})"
        else:
            if base_type == 'VARCHAR' and size:
                result = f"VARCHAR({size})"
            elif base_type == 'CHAR' and size:
                result = f"CHAR({size})"
            else:
                result = base_type
    else:
        result = base_type
    
    return result

def parse_table(sql_content: str, table_name: str) -> Dict:
    """Bir tablonun CREATE TABLE bloğunu parse eder."""
    # Find table definition - look for the CREATE TABLE block after the comment
    pattern = rf'/.*Object:\s+Table\s+\[dbo\]\.\[{re.escape(table_name)}\][\s\S]*?CREATE TABLE\s+\[dbo\]\.\[{re.escape(table_name)}\]\s*\(([\s\S]*?)\)\s*ON\s+\[PRIMARY\]'
    match = re.search(pattern, sql_content, re.IGNORECASE)
    
    if not match:
        return None
    
    table_def = match.group(1)
    
    # Extract columns
    columns = []
    pk_constraint = None
    
    # Find PRIMARY KEY constraint
    pk_match = re.search(r'CONSTRAINT\s+\[(\w+)\]\s+PRIMARY KEY\s+CLUSTERED\s*\(([^)]+)\)', table_def, re.IGNORECASE)
    if pk_match:
        pk_name = pk_match.group(1)
        pk_cols = [c.strip().split()[0].strip('[]') for c in pk_match.group(2).split(',')]
        pk_constraint = {'name': pk_name, 'columns': pk_cols}
    
    # Extract column definitions
    # Match: [ColumnName] [Type] [NULL/NOT NULL] [IDENTITY]
    # Pattern: [ColumnName] [Type] [attributes]
    col_lines = [line.strip() for line in table_def.split('\n') if line.strip() and not line.strip().startswith('CONSTRAINT')]
    
    for line in col_lines:
        # Skip CONSTRAINT lines (handled separately)
        if 'CONSTRAINT' in line.upper() or 'PRIMARY KEY' in line.upper():
            continue
            
        # Match: [ColumnName] [Type] [attributes]
        col_match = re.match(r'\[(\w+)\]\s+\[(\w+(?:\([^)]*\))?)\]\s+(.*)', line)
        if not col_match:
            continue
            
        col_name = col_match.group(1)
        col_type = col_match.group(2)
        col_attrs = col_match.group(3)
        
        # Check for IDENTITY
        is_identity = 'IDENTITY' in col_attrs.upper()
        is_nullable = 'NOT NULL' not in col_attrs.upper() and not is_identity
        
        # Convert type
        pg_type = sql_type_to_pg(col_type, is_nullable)
        
        # Handle IDENTITY
        if is_identity:
            pg_type = 'SERIAL'
            is_nullable = False
        
        columns.append({
            'name': col_name.lower(),  # PostgreSQL uses lowercase
            'type': pg_type,
            'nullable': is_nullable,
            'is_identity': is_identity
        })
    
    return {
        'name': table_name.lower(),
        'columns': columns,
        'primary_key': pk_constraint
    }

def generate_supabase_migration(tables: List[Dict], output_file: str):
    """Supabase PostgreSQL migration script'i oluşturur."""
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("-- Supabase PostgreSQL Migration Script\n")
        f.write("-- Generated from SQL Server schema\n")
        f.write("-- Note: Foreign keys are not included (will be handled in application layer)\n\n")
        
        f.write("-- Enable UUID extension if needed\n")
        f.write("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";\n\n")
        
        for table in tables:
            if not table or not table.get('columns'):
                continue
            
            f.write(f"-- Table: {table['name']}\n")
            f.write(f"CREATE TABLE IF NOT EXISTS {table['name']} (\n")
            
            col_defs = []
            for col in table['columns']:
                col_def = f"    {col['name']} {col['type']}"
                if not col['nullable'] and not col['is_identity']:
                    col_def += " NOT NULL"
                col_defs.append(col_def)
            
            f.write(",\n".join(col_defs))
            
            # Add primary key
            if table.get('primary_key'):
                pk_cols = ', '.join([c.lower() for c in table['primary_key']['columns']])
                f.write(f",\n    CONSTRAINT {table['primary_key']['name'].lower()} PRIMARY KEY ({pk_cols})")
            
            f.write("\n);\n\n")
            
            # Add indexes from CSV (if we have them)
            # This will be added separately
            
        f.write("-- End of migration\n")

def main():
    print("SQL Server schema'yı Supabase PostgreSQL'e dönüştürülüyor...")
    
    # Read SQL file
    with open('deneme.sql', 'r', encoding='utf-8', errors='ignore') as f:
        sql_content = f.read()
    
    # Find all table names - match the exact format from grep
    table_pattern = r'/.*Object:\s+Table\s+\[dbo\]\.\[(\w+)\]\s+Script Date:'
    table_names = re.findall(table_pattern, sql_content, re.MULTILINE)
    
    # If that doesn't work, try simpler pattern
    if not table_names:
        table_pattern = r'Object:\s+Table\s+\[dbo\]\.\[(\w+)\]'
        table_names = re.findall(table_pattern, sql_content, re.MULTILINE)
    
    print(f"Toplam {len(table_names)} tablo bulundu")
    
    # Parse each table
    tables = []
    for table_name in table_names:
        print(f"Parsing: {table_name}...")
        table_def = parse_table(sql_content, table_name)
        if table_def:
            tables.append(table_def)
        else:
            print(f"  ⚠️  {table_name} parse edilemedi")
    
    print(f"\n{len(tables)} tablo başarıyla parse edildi")
    
    # Generate migration
    output_file = 'supabase_migration.sql'
    generate_supabase_migration(tables, output_file)
    print(f"\n✅ Migration script oluşturuldu: {output_file}")

if __name__ == '__main__':
    main()


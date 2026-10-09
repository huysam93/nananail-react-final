require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { createClient } = require('@libsql/client');

const DB_FILE = path.join(__dirname, 'nananail.db');

const localDB = new sqlite3.Database(DB_FILE);
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

function queryLocal(sql, params = []) {
  return new Promise((resolve, reject) => {
    localDB.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function migrate() {
  console.log('🚀 Bắt đầu đồng bộ dữ liệu từ nananail.db sang Turso Cloud...');

  // 1. Lấy danh sách bảng
  const tables = await queryLocal(`
    SELECT name, sql FROM sqlite_master 
    WHERE type = 'table' 
      AND name NOT LIKE 'sqlite_%' 
      AND sql IS NOT NULL
  `);

  console.log(`📋 Bước 1: Tạo cấu trúc cho ${tables.length} bảng trên Turso...`);
  for (const table of tables) {
    try {
      await turso.execute(table.sql);
      console.log(`   ✅ Bảng [${table.name}] sẵn sàng.`);
    } catch (err) {
      console.log(`   ⚠️ Bảng [${table.name}]:`, err.message);
    }
  }

  console.log(`\n📦 Bước 2: Bơm dữ liệu vào từng bảng...`);
  for (const table of tables) {
    const tableName = table.name;
    const rows = await queryLocal(`SELECT * FROM "${tableName}"`);
    if (rows.length === 0) {
      console.log(`   ℹ️ [${tableName}]: 0 bản ghi`);
      continue;
    }

    const columns = Object.keys(rows[0]);
    const placeholders = columns.map(() => '?').join(', ');
    const insertSql = `INSERT OR REPLACE INTO "${tableName}" ("${columns.join('", "')}") VALUES (${placeholders})`;

    const BATCH_SIZE = 50;
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batchRows = rows.slice(i, i + BATCH_SIZE);
      const statements = batchRows.map(row => ({
        sql: insertSql,
        args: columns.map(col => row[col])
      }));
      await turso.batch(statements, 'write');
    }
    console.log(`   🎉 [${tableName}]: Đã chép ${rows.length} bản ghi!`);
  }

  // 3. Tạo index
  const indexes = await queryLocal(`
    SELECT name, sql FROM sqlite_master 
    WHERE type = 'index' 
      AND name NOT LIKE 'sqlite_%' 
      AND sql IS NOT NULL
  `);
  for (const idx of indexes) {
    try {
      await turso.execute(idx.sql);
    } catch (e) {}
  }

  console.log('\n=============================================================');
  console.log('✨ HOÀN TẤT 100%: Toàn bộ cơ sở dữ liệu đã nằm trên Turso!');
  console.log('=============================================================');
  localDB.close();
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Lỗi:', err);
  localDB.close();
  process.exit(1);
});

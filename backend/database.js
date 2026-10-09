const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { https } = require('follow-redirects');
require('dotenv').config();

const DB_FILE = path.join(__dirname, 'nananail.db');
let db;

// Tải file .db từ Google Drive
function downloadDatabaseBackup(url, destination, callback) {
    const file = fs.createWriteStream(destination);
    https.get(url, (response) => {
        if (response.statusCode !== 200) {
            return callback(new Error(`Failed to download: ${response.statusCode}`));
        }

        response.pipe(file);
        file.on('finish', () => file.close(callback));
    }).on('error', (err) => {
        fs.unlink(destination, () => { }); // Xoá file nếu lỗi
        callback(err);
    });
}

// Khởi tạo DB
function initializeDB() {
    const dbExists = fs.existsSync(DB_FILE);

    const startApp = () => {
        db = new sqlite3.Database(DB_FILE, (err) => {
            if (err) {
                console.error('❌ Error connecting to database:', err.message);
                return;
            }
            console.log('✅ Connected to the NanaNail SQLite database.');

            createTables(db, () => {
                runMigrations(db);
                ensureAdminUser();
                if (!dbExists) {
                    console.log('🧱 Seeding initial sample data...');
                    seedData();
                }
            });
        });
    };

    if (!dbExists) {
        const backupURL = process.env.DB_BACKUP_URL;
        if (!backupURL) {
            console.warn('⚠️ DB_BACKUP_URL not set. Creating new empty DB...');
            return startApp();
        }

        console.log('📂 Database not found. Downloading from backup URL...');
        downloadDatabaseBackup(backupURL, DB_FILE, (err) => {
            if (err) {
                console.error('❌ Failed to download backup:', err.message);
                console.log('🚧 Proceeding to create new DB instead.');
                startApp();
            } else {
                console.log('✅ Database backup downloaded successfully.');
                startApp();
            }
        });
    } else {
        startApp();
    }
}

// Kiểm tra và tạo tất cả các bảng nếu chưa tồn tại
function createTables(database, callback) {
    database.serialize(() => {
        database.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'admin'
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS about (
          id INTEGER PRIMARY KEY,
          content TEXT
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS services (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          category TEXT DEFAULT 'Gel',
          duration_minutes INTEGER DEFAULT 60,
          image_url TEXT,
          is_featured INTEGER DEFAULT 0
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS gallery_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          image_base64 TEXT NOT NULL,
          tag TEXT
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS slider_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          image_base64 TEXT NOT NULL
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS reviews (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customer_name TEXT NOT NULL,
          content TEXT,
          rating INTEGER CHECK(rating >= 1 AND rating <= 5)
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          content TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS appointments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customer_name TEXT NOT NULL,
          customer_phone TEXT,
          service_id INTEGER,
          services_list TEXT,
          appointment_date TEXT NOT NULL,
          time_slot TEXT,
          notes TEXT,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (service_id) REFERENCES services(id)
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS promotions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          discount_percent INTEGER DEFAULT 0,
          original_price REAL,
          promo_price REAL,
          valid_from DATETIME,
          valid_to DATETIME,
          badge TEXT,
          color TEXT,
          image_url TEXT,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS before_after_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          category TEXT,
          description TEXT,
          before_image TEXT NOT NULL,
          after_image TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS loyalty_members (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL,
          phone TEXT NOT NULL UNIQUE,
          email TEXT,
          points INTEGER DEFAULT 0,
          tier TEXT DEFAULT 'Đồng',
          total_visits INTEGER DEFAULT 0,
          total_spent REAL DEFAULT 0,
          notes TEXT,
          joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_visit DATETIME
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS loyalty_transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          member_id INTEGER NOT NULL,
          points_change INTEGER NOT NULL,
          type TEXT DEFAULT 'earn',
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (member_id) REFERENCES loyalty_members(id)
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS visitors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ip_address TEXT,
          user_agent TEXT,
          page_url TEXT,
          visit_time DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          slug TEXT UNIQUE,
          excerpt TEXT,
          content TEXT NOT NULL,
          cover_image TEXT,
          category TEXT DEFAULT 'Tin tức',
          status TEXT DEFAULT 'published',
          author TEXT DEFAULT 'NanaNail',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, () => {
            if (callback) callback();
        });
    });
}

// Đảm bảo tài khoản Admin nananail / tranconghuy@32 luôn hoạt động
function ensureAdminUser() {
    const saltRounds = 10;
    const adminPassword = 'tranconghuy@32';
    const passwordHash = bcrypt.hashSync(adminPassword, saltRounds);

    db.run(
        `INSERT INTO users (username, password_hash) VALUES ('nananail', ?) 
         ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash`,
        [passwordHash],
        (err) => {
            if (err) {
                console.error('❌ Error setting admin user:', err.message);
            } else {
                console.log('🔑 Admin account nananail ensured with configured password.');
            }
        }
    );
}

// Tự động kiểm tra và thêm cột còn thiếu cho DB cũ
function runMigrations(database) {
    database.serialize(() => {
        database.all("PRAGMA table_info(appointments)", (err, columns) => {
            if (err || !columns) return;
            const colNames = columns.map(c => c.name);

            if (!colNames.includes('customer_name')) {
                console.log('🔄 Migrating appointments: adding customer_name');
                database.run("ALTER TABLE appointments ADD COLUMN customer_name TEXT", () => {
                    if (colNames.includes('name')) {
                        database.run("UPDATE appointments SET customer_name = name WHERE customer_name IS NULL");
                    }
                });
            }
            if (!colNames.includes('customer_phone')) {
                console.log('🔄 Migrating appointments: adding customer_phone');
                database.run("ALTER TABLE appointments ADD COLUMN customer_phone TEXT", () => {
                    if (colNames.includes('phone')) {
                        database.run("UPDATE appointments SET customer_phone = phone WHERE customer_phone IS NULL");
                    }
                });
            }
            if (!colNames.includes('services_list')) {
                console.log('🔄 Migrating appointments: adding services_list');
                database.run("ALTER TABLE appointments ADD COLUMN services_list TEXT");
            }
            if (!colNames.includes('time_slot')) {
                console.log('🔄 Migrating appointments: adding time_slot');
                database.run("ALTER TABLE appointments ADD COLUMN time_slot TEXT");
            }
            if (!colNames.includes('notes')) {
                console.log('🔄 Migrating appointments: adding notes');
                database.run("ALTER TABLE appointments ADD COLUMN notes TEXT");
            }
            if (!colNames.includes('status')) {
                console.log('🔄 Migrating appointments: adding status');
                database.run("ALTER TABLE appointments ADD COLUMN status TEXT DEFAULT 'pending'");
            }
            if (!colNames.includes('created_at')) {
                console.log('🔄 Migrating appointments: adding created_at');
                database.run("ALTER TABLE appointments ADD COLUMN created_at DATETIME");
            }
        });
    });
}

// Seed dữ liệu mẫu
function seedData() {
    db.serialize(() => {
        const stmtAbout = db.prepare("INSERT OR IGNORE INTO about (id, content) VALUES (?, ?)");
        stmtAbout.run(1, 'Chào mừng đến với NanaNail! Chúng tôi tự hào mang đến cho bạn những dịch vụ chăm sóc móng chuyên nghiệp và chất lượng nhất tại Đà Lạt. Với đội ngũ kỹ thuật viên tay nghề cao và không gian thư giãn, sang trọng, NanaNail là điểm đến lý tưởng để bạn làm mới bản thân và tận hưởng những phút giây thư thái.');
        stmtAbout.finalize();

        const services = [
            { name: 'Sơn Gel Màu', description: 'Sơn gel cao cấp với hơn 200 màu sắc thời thượng, bền màu 3-4 tuần.', price: 150000, category: 'Gel', duration_minutes: 60, is_featured: 1 },
            { name: 'Sơn Gel Ombre', description: 'Kỹ thuật ombre chuyển màu mượt mà, tạo hiệu ứng độc đáo.', price: 200000, category: 'Gel', duration_minutes: 75 },
            { name: 'Đắp Bột Acrylic', description: 'Kỹ thuật đắp bột acrylic chuyên nghiệp, tạo form móng chuẩn, bền lâu.', price: 300000, category: 'Acrylic', duration_minutes: 90, is_featured: 1 },
            { name: 'Nail Art & Vẽ Móng', description: 'Vẽ tay, đính đá, thiết kế nail art độc đáo theo yêu cầu.', price: 50000, category: 'Nail Art', duration_minutes: 30, is_featured: 1 },
            { name: 'Chăm Sóc Móng Tay', description: 'Cắt da, dũa móng, tẩy tế bào chết, massage tay thư giãn.', price: 120000, category: 'Chăm Sóc', duration_minutes: 45 },
            { name: 'Chăm Sóc Móng Chân', description: 'Ngâm chân, cắt da, dũa móng, massage chân thư giãn.', price: 150000, category: 'Pedicure', duration_minutes: 60 },
        ];
        const stmtServices = db.prepare("INSERT OR IGNORE INTO services (name, description, price, category, duration_minutes, is_featured) VALUES (?, ?, ?, ?, ?, ?)");
        services.forEach(s => stmtServices.run(s.name, s.description, s.price, s.category, s.duration_minutes, s.is_featured || 0));
        stmtServices.finalize();

        const reviews = [
            { name: 'Chị Lan Anh', content: 'Dịch vụ rất tốt, nhân viên nhiệt tình, mình rất hài lòng!', rating: 5 },
            { name: 'Bạn Minh Thư', content: 'Mẫu nail xinh xỉu, lần sau sẽ ghé lại.', rating: 5 },
            { name: 'Anh Hùng', content: 'Không gian sạch sẽ, sang trọng. Bạn gái mình rất thích.', rating: 4 }
        ];
        const stmtReviews = db.prepare("INSERT OR IGNORE INTO reviews (customer_name, content, rating) VALUES (?, ?, ?)");
        reviews.forEach(r => stmtReviews.run(r.name, r.content, r.rating));
        stmtReviews.finalize();

        console.log('✅ Database seeded successfully.');
    });
}

// Export
module.exports = {
    initializeDB,
    getDB: () => db
};

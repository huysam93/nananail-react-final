const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'nananail.db');
const db = new sqlite3.Database(DB_FILE);

const imagesDir = path.join(__dirname, '../images');

function getBase64Image(filename) {
    const filePath = path.join(imagesDir, filename);
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath).toString('base64');
    }
    return '';
}

const img1 = getBase64Image('images.jpg');
const img2 = getBase64Image('images (1).jpg');
const img3 = getBase64Image('images (2).jpg');
const img4 = getBase64Image('mau-nail-chup-anh-cuoi-41.jpg');

const sampleImages = [img1, img2, img3, img4].filter(Boolean);

console.log(`🖼️ Loaded ${sampleImages.length} sample images from local directory.`);

db.serialize(() => {
    console.log('🚀 Seeding rich dummy data to NanaNail Database...');

    // 1. Slider Images
    db.run("DELETE FROM slider_images");
    const stmtSlider = db.prepare("INSERT INTO slider_images (image_base64) VALUES (?)");
    sampleImages.forEach(img => stmtSlider.run(img));
    stmtSlider.finalize();
    console.log('✅ Slider images seeded.');

    // 2. Gallery Images
    db.run("DELETE FROM gallery_images");
    const stmtGallery = db.prepare("INSERT INTO gallery_images (image_base64, tag) VALUES (?, ?)");
    const galleryItems = [
        { img: sampleImages[3] || sampleImages[0], tag: 'Cô Dâu' },
        { img: sampleImages[0], tag: 'Ombre' },
        { img: sampleImages[1] || sampleImages[0], tag: 'Đính Đá' },
        { img: sampleImages[2] || sampleImages[0], tag: 'Mắt Mèo' },
        { img: sampleImages[3] || sampleImages[0], tag: 'Tết 2026' },
        { img: sampleImages[1] || sampleImages[0], tag: 'Pháp (French)' },
        { img: sampleImages[0], tag: 'Art Hoa' },
        { img: sampleImages[2] || sampleImages[0], tag: 'Tráng Gương' },
    ];
    galleryItems.forEach(item => stmtGallery.run(item.img, item.tag));
    stmtGallery.finalize();
    console.log('✅ Gallery images seeded.');

    // 3. Before After Images
    db.run("DELETE FROM before_after_images");
    const stmtBA = db.prepare(`
        INSERT INTO before_after_images (title, category, description, before_image, after_image)
        VALUES (?, ?, ?, ?, ?)
    `);
    stmtBA.run(
        'Mẫu Nail Cô Dâu Đính Đá Thuần Khiết',
        'Nail Art',
        'Phục hồi móng mộc mỏng yếu thành móng dài đính đá xà cừ lấp lánh cho ngày cưới.',
        sampleImages[0],
        sampleImages[3] || sampleImages[0]
    );
    stmtBA.run(
        'Biến Hóa Móng Gel Ombre Phấn Hồng',
        'Gel',
        'Kỹ thuật ombre pastel chuyển màu mềm mại trên nền móng tự nhiên.',
        sampleImages[1] || sampleImages[0],
        sampleImages[2] || sampleImages[0]
    );
    stmtBA.run(
        'Đắp Bột Mắt Mèo Kim Cương Mịn Màng',
        'Acrylic',
        'Tạo form móng nhọn kiêu sa kết hợp hiệu ứng mắt mèo chiếu sáng quyến rũ.',
        sampleImages[2] || sampleImages[0],
        sampleImages[0]
    );
    stmtBA.run(
        'Phục Hồi & Tháo Bột Chăm Sóc Móng Chuyên Sâu',
        'Chăm Sóc',
        'Dưỡng ẩm serum Keratin phục hồi bề mặt móng bị tổn thương do tháo bột sai cách.',
        sampleImages[0],
        sampleImages[1] || sampleImages[0]
    );
    stmtBA.finalize();
    console.log('✅ Before/After images seeded.');

    // 4. Services
    db.run("DELETE FROM services");
    const stmtServices = db.prepare(`
        INSERT INTO services (name, description, price, category, duration_minutes, image_url, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const servicesList = [
        {
            name: 'Sơn Gel Màu Cao Cấp',
            description: 'Sơn gel Hàn Quốc bảo vệ móng, bền màu rạng rỡ từ 3-4 tuần không bong tróc.',
            price: 150000,
            category: 'Gel',
            duration: 45,
            img: sampleImages[0],
            featured: 1
        },
        {
            name: 'Nail Art Vẽ Tay Sáng Tạo',
            description: 'Vẽ hoa văn nghệ thuật theo mẫu yêu cầu, hoa nổi 3D, đính đá Swarovski cao cấp.',
            price: 220000,
            category: 'Nail Art',
            duration: 60,
            img: sampleImages[3] || sampleImages[0],
            featured: 1
        },
        {
            name: 'Đắp Bột Acrylic Form Hàn Quốc',
            description: 'Tạo form móng thon dài kiêu sa, bột mịn không hăng mùi, độ bền vượt trội.',
            price: 350000,
            category: 'Acrylic',
            duration: 90,
            img: sampleImages[2] || sampleImages[0],
            featured: 1
        },
        {
            name: 'Sơn Gel Ombre Hồng Baby',
            description: 'Chuyển màu gradient đài các, phủ bóng thủy tinh che khuyết điểm móng cực đỉnh.',
            price: 180000,
            category: 'Gel',
            duration: 60,
            img: sampleImages[1] || sampleImages[0],
            featured: 1
        },
        {
            name: 'Chăm Sóc Móng Tay Thư Giãn',
            description: 'Cắt da chết êm ái, dũa form tròn/vuông chuẩn thẩm mỹ, massage dưỡng ẩm dầu Argan.',
            price: 100000,
            category: 'Chăm Sóc',
            duration: 30,
            img: sampleImages[0],
            featured: 0
        },
        {
            name: 'Spa Ngâm Chân Pedicure Thảo Mộc',
            description: 'Ngâm chân thảo dược Đà Lạt, chà gót chân mịn màng, massage bấm huyệt xua tan mệt mỏi.',
            price: 200000,
            category: 'Pedicure',
            duration: 60,
            img: sampleImages[2] || sampleImages[0],
            featured: 0
        },
        {
            name: 'Sơn Mắt Mèo Kim Cương 9D',
            description: 'Hiệu ứng dải ngân hà huyền ảo chuyển đổi màu sắc bắt mắt dưới ánh đèn.',
            price: 250000,
            category: 'Gel',
            duration: 60,
            img: sampleImages[1] || sampleImages[0],
            featured: 1
        },
        {
            name: 'Nail Cô Dâu Đính Đá Xà Cừ Luxe',
            description: 'Thiết kế độc bản dành riêng cho cô dâu trong ngày trọng đại với ngọc trai và xà cừ Ánh Kim.',
            price: 450000,
            category: 'Nail Art',
            duration: 100,
            img: sampleImages[3] || sampleImages[0],
            featured: 1
        }
    ];
    servicesList.forEach(s => stmtServices.run(s.name, s.description, s.price, s.category, s.duration, s.img, s.featured));
    stmtServices.finalize();
    console.log('✅ Services seeded.');

    // 5. Promotions
    db.run("DELETE FROM promotions");
    const stmtPromo = db.prepare(`
        INSERT INTO promotions (title, description, discount_percent, original_price, promo_price, valid_from, valid_to, badge, color, image_url, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
    stmtPromo.run(
        'Combo Gel + Vẽ Art Hoa Đà Lạt',
        'Ưu đãi đặc biệt trọn gói sơn gel tươi sáng và vẽ tay 2 ngón art xinh xắn.',
        20,
        250000,
        200000,
        '2026-03-01',
        '2026-12-31',
        'BEST SELLER',
        'from-rose-400 to-pink-500',
        sampleImages[0]
    );
    stmtPromo.run(
        'Đắp Bột Tặng Ngâm Chân Thảo Mộc',
        'Khi làm dịch vụ đắp bột Acrylic bất kỳ, tặng ngay 1 suất spa ngâm chân thư giãn.',
        25,
        450000,
        337000,
        '2026-04-01',
        '2026-11-30',
        'HOT DEAL',
        'from-fuchsia-400 to-rose-500',
        sampleImages[2] || sampleImages[0]
    );
    stmtPromo.run(
        'Ưu Đãi Sinh Nhật Giảm 30%',
        'Tặng khách hàng có sinh nhật trong tháng giảm trực tiếp 30% trên tổng hóa đơn.',
        30,
        null,
        null,
        null,
        null,
        'BIRTHDAY VIP',
        'from-pink-400 to-brand-pink-dark',
        sampleImages[3] || sampleImages[0]
    );
    stmtPromo.run(
        'Đi Cặp Giảm 15% Cho Cả Hai',
        'Rủ bạn thân cùng làm nail tại NanaNail, mỗi nàng nhận ngay discount 15%.',
        15,
        null,
        null,
        '2026-01-01',
        '2026-12-31',
        'BEST FRIENDS',
        'from-rose-300 to-pink-400',
        sampleImages[1] || sampleImages[0]
    );
    stmtPromo.finalize();
    console.log('✅ Promotions seeded.');

    // 6. Reviews
    db.run("DELETE FROM reviews");
    const stmtReviews = db.prepare("INSERT INTO reviews (customer_name, content, rating) VALUES (?, ?, ?)");
    const reviews = [
        { name: 'Chị Thanh Hằng (Phường 1, Đà Lạt)', content: 'Tiệm xinh xắn tone hồng nhạt sang đẹp cực kỳ! Nhân viên cắt da rất kỹ không hề đau tí nào. Sơn gel bền đến tận tháng sau vẫn chưa tróc!', rating: 5 },
        { name: 'Khách hàng Khánh Linh', content: 'Mình làm mẫu cô dâu ở đây được ai cũng khen. Tiệm phục vụ trà bánh chu đáo, làm cực kỳ tỉ mỉ. 10/10 chất lượng!', rating: 5 },
        { name: 'Bạn Phương Thảo', content: 'Lần đầu thử đắp bột ở NanaNail mà mê luôn. Form móng nhọn thon gọn tự nhiên, màu mắt mèo siêu ảo diệu!', rating: 5 },
        { name: 'Chị Mai Phương', content: 'Không gian thơm tho thư giãn, nhân viên lịch sự mến khách. Giá cả quá hợp lý so với chất lượng dịch vụ cao cấp.', rating: 5 },
        { name: 'Bạn Thùy Trang', content: 'Bộ nail ombre xinh xỉu! Đúng mẫu mình gửi trên Pinterest luôn. Chắc chắn sẽ quay lại làm thường xuyên.', rating: 5 },
    ];
    reviews.forEach(r => stmtReviews.run(r.name, r.content, r.rating));
    stmtReviews.finalize();
    console.log('✅ Reviews seeded.');

    // 7. Posts
    db.run("DELETE FROM posts");
    const stmtPosts = db.prepare(`
        INSERT INTO posts (title, slug, excerpt, content, cover_image, category, status, author)
        VALUES (?, ?, ?, ?, ?, ?, 'published', 'NanaNail Team')
    `);
    stmtPosts.run(
        'Top 5 Mẫu Nail Hot Trend 2026 Cho Nàng Thơ Đà Lạt',
        'top-5-mau-nail-hot-trend-2026',
        'Khám phá các phong cách nail mộng mơ từ Ombre pastel đến Mắt mèo kim cương đang chiếm trọn trái tim phái đẹp.',
        `Đà Lạt với không khí mát lành lãng mạn luôn là nguồn cảm hứng bất tận cho những bộ nail mang phong cách nhẹ nhàng, tinh tế. Dưới đây là top 5 mẫu nail đang làm mưa làm gió tại NanaNail mà bạn nhất định phải thử:

1. **Nail Ombre Phấn Hồng**: Sự chuyển màu mượt mà giữa tone hồng nude và trắng sữa tạo vẻ đẹp đài các, tự nhiên.
2. **Nail Mắt Mèo Kim Cương 9D**: Lớp nhũ từ tính tạo hiệu ứng dải ngân hà lấp lánh huyền ảo dưới ánh nắng.
3. **Nail Art Đính Đá Xà Cừ**: Điểm xuyết những mảnh xà cừ thiên nhiên lấp lánh mang lại vẻ sang trọng tuyệt đối.
4. **Nail Tráng Gương Thủy Tinh**: Phong cách hiện đại cá tính nhưng vẫn giữ nét thanh lịch.
5. **Nail Pháp Cổ Điển**: Sự kết hợp giản dị nhưng không bao giờ lỗi mốt.

Hãy ghé NanaNail Đà Lạt ngay hôm nay để sở hữu bộ móng ưng ý nhất!`,
        sampleImages[0],
        'Xu Hướng'
    );
    stmtPosts.run(
        'Bí Quyết Giữ Sơn Gel Bền Đẹp Trên 4 Tuần Không Bong Tróc',
        'bi-quyet-giu-son-gel-ben-dep',
        'Hướng dẫn chi tiết cách chăm sóc bộ móng gel tại nhà giúp móng luôn sáng bóng và chắc khỏe.',
        `Nhiều chị em thường thắc mắc tại sao cùng sơn gel nhưng có người giữ được hơn tháng, có người chỉ được vài ngày. Dưới đây là những bí kíp vàng từ kỹ thuật viên NanaNail:

- **Tránh tiếp xúc hóa chất mạnh**: Khi rửa bát hay dọn dẹp nhà cửa, hãy đeo găng tay cao su để bảo vệ lớp sơn bóng.
- **Dưỡng ẩm viền móng hàng ngày**: Sử dụng dầu dưỡng cuticle hoặc dầu coconut thoa nhẹ quanh viền móng mỗi tối trước khi đi ngủ.
- **Không dùng móng cạy vật cứng**: Hạn chế dùng đầu móng để bóc nhãn đĩa, mở nắp lon...
- **Sử dụng dịch vụ tháo gel chuyên nghiệp**: Tuyệt đối không tự bóc lớp gel tại nhà vì sẽ làm lột lớp sừng bảo vệ của móng tự nhiên.`,
        sampleImages[1] || sampleImages[0],
        'Mẹo Chăm Sóc'
    );
    stmtPosts.finalize();
    console.log('✅ Posts seeded.');

    // 8. Appointments
    db.run("DELETE FROM appointments");
    const stmtAppt = db.prepare(`
        INSERT INTO appointments (customer_name, customer_phone, service_id, services_list, appointment_date, time_slot, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const today = new Date().toISOString().split('T')[0];
    stmtAppt.run('Nguyễn Thị Minh Châu', '0912345678', 1, 'Sơn Gel Màu Cao Cấp, Nail Art Vẽ Tay', today, '09:30', 'Làm mẫu ombre hồng pastel đính đá nhẹ', 'confirmed');
    stmtAppt.run('Trần Hoàng Anh', '0987654321', 3, 'Đắp Bột Acrylic Form Hàn Quốc', today, '14:00', 'Muốn làm dáng móng nhọn kiêu sa', 'pending');
    stmtAppt.run('Lê Ngọc Bảo Trân', '0933445566', 2, 'Nail Cô Dâu Đính Đá Xà Cừ', today, '16:30', 'Sắp cưới tuần sau, tư vấn mẫu tone hồng nude', 'completed');
    stmtAppt.finalize();
    console.log('✅ Appointments seeded.');

    // 9. Loyalty Members
    db.run("DELETE FROM loyalty_members");
    const stmtLoyalty = db.prepare(`
        INSERT INTO loyalty_members (full_name, phone, email, points, tier, total_visits, total_spent, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmtLoyalty.run('Nguyễn Thị Minh Châu', '0912345678', 'minhchau@gmail.com', 450, 'Bạch Kim', 12, 3500000, 'Khách thích trà hoa cúc, ưa chuộng tông hồng baby');
    stmtLoyalty.run('Trần Hoàng Anh', '0987654321', 'hoanganh@gmail.com', 180, 'Vàng', 5, 1400000, 'Hay làm đắp bột mắt mèo');
    stmtLoyalty.run('Lê Ngọc Bảo Trân', '0933445566', 'baotran@gmail.com', 80, 'Đồng', 2, 650000, 'Khách mới giới thiệu');
    stmtLoyalty.finalize();
    console.log('✅ Loyalty members seeded.');

    // 10. Contacts & Messages
    db.run("DELETE FROM contacts");
    const stmtContacts = db.prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)");
    stmtContacts.run('Phạm Thu Hà', 'thuha@gmail.com', 'Cho mình hỏi tiệm có nhận làm nail cô dâu tận nơi không ạ?');
    stmtContacts.run('Đặng Mỹ Linh', 'mylinh@gmail.com', 'Mình muốn đặt lịch hẹn cho nhóm 4 người vào chiều thứ 7 này.');
    stmtContacts.finalize();

    db.run("DELETE FROM messages");
    const stmtMessages = db.prepare("INSERT INTO messages (content) VALUES (?)");
    stmtMessages.run('Dạ chào chị! NanaNail mở cửa từ 8:30 đến 20:00 tất cả các ngày trong tuần ạ.');
    stmtMessages.run('Chị có thể bấm đặt lịch trực tiếp trên website hoặc gọi 0965 371 841 nha.');
    stmtMessages.finalize();

    console.log('🎉 ALL DUMMY DATA SEEDED SUCCESSFULLY!');
    db.close();
});

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const DB_PATH = path.resolve(__dirname, 'toeic-voca.db');
const OUTPUT_PATH = path.resolve(__dirname, 'vocab-data.json');

const mapType = (type) => {
    const normalized = (type ?? '').toString().trim().toLowerCase();

    const numericMap = {
        '1': '(n)',
        '2': '(v)',
        '3': '(adj)',
        '4': '(adv)',
        '5': '(prep)',
        '6': '(conj)'
    };

    const textMap = {
        n: '(n)',
        v: '(v)',
        adj: '(adj)',
        adv: '(adv)',
        prep: '(prep)',
        conj: '(conj)'
    };

    return numericMap[normalized] || textMap[normalized] || '';
};

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error('❌ Không mở được file DB. Hãy kiểm tra đường dẫn!');
        console.error(err.message);
        return;
    }
    console.log('✅ Đã kết nối thành công tới toeic-voca.db');
});

const result = [];

db.serialize(() => {
    db.all("SELECT * FROM lessons ORDER BY ID", (err, lessons) => {
        if (err) {
            console.error('Lỗi query lessons:', err);
            return;
        }

        console.log(`🔍 Tìm thấy ${lessons.length} chủ đề. Đang xử lý...`);

        let processedCount = 0;

        lessons.forEach((lesson) => {
            db.all(`SELECT * FROM words WHERE LessonID = ?`, [lesson.ID], (err, words) => {
                if (err) {
                    console.error(`Lỗi lấy từ vựng lesson ${lesson.ID}:`, err);
                    words = [];
                }

                const formattedWords = words.map(w => ({
                    id: w.WordID.toString(),
                    term: w.Word,
                    type: mapType(w.Type),
                    meaning: w.Meaning, 
                    pronunciation: w.PhienAm || '', 
                    example: w.Example || '', 
                    audio: w.linkAudio, 
                    image: w.linkImage   
                }));

                result.push({
                    id: lesson.ID.toString(),
                    name: lesson.Lesson || `Topic ${lesson.ID}`,
                    image: lesson.linkImage,
                    words: formattedWords
                });

                processedCount++;

                if (processedCount === lessons.length) {
                    result.sort((a, b) => parseInt(a.id) - parseInt(b.id));

                    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2), 'utf8');
                    console.log(`🎉 XONG! Dữ liệu đã được xuất ra: ${OUTPUT_PATH}`);
                    db.close();
                }
            });
        });
    });
});
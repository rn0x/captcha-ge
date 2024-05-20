import { createCanvas, registerFont } from 'canvas';
import path from "node:path";
import fs from 'node:fs';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**
 * كلاس CaptchaGenerator لإنشاء CAPTCHA
 */
class CaptchaGenerator {
    /** 
     * إنشاء مثيل CaptchaGenerator
     * @param {Object} options - خيارات التهيئة لـ CAPTCHA
     * @param {string} options.characters - الأحرف المستخدمة في CAPTCHA
     */
    constructor(options = {}) {
        const root = path.resolve(process.cwd()); // project root directory (./)
        this.width = 200;
        this.height = 60;
        this.characters = options.characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        this.fontSize = 40;
        this.text = this.generateText();
        // تحميل الخطوط من المجلد
        this.fonts = this.loadFonts(path.join(__dirname, "fonts"));
    }

    /**
     * توليد نص CAPTCHA عشوائي
     * @returns {string} - النص CAPTCHA المولد
     */
    generateText() {
        let text = '';
        for (let i = 0; i < 6; i++) {
            text += this.characters.charAt(Math.floor(Math.random() * this.characters.length));
        }
        return text;
    }

    /**
     * توليد صورة CAPTCHA وإرجاعها كمصفوفة بايت
     * @returns {Promise<Buffer>} - صورة CAPTCHA المولدة كمصفوفة بايت
     */
    async generateImageCaptcha() {
        try {
            const canvas = createCanvas(this.width, this.height);
            const ctx = canvas.getContext('2d');

            // رسم خلفية
            const backgroundColor = this.getRandomVeryLightColor();
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, this.width, this.height);

            // رسم أشكال هندسية معقدة للتمويه
            for (let i = 0; i < 15; i++) {
                // اختيار نوع الشكل الهندسي بشكل عشوائي
                const shapeType = Math.random();

                // رسم خطوط بشكل عشوائي
                if (shapeType < 0.4) {
                    ctx.beginPath();
                    ctx.moveTo(Math.random() * this.width, Math.random() * this.height);
                    ctx.lineTo(Math.random() * this.width, Math.random() * this.height);
                    ctx.strokeStyle = this.getRandomColor(150, 200);
                    ctx.stroke();
                }
                // رسم دوائر بشكل عشوائي
                else if (shapeType < 0.8) {
                    ctx.beginPath();
                    ctx.arc(Math.random() * this.width, Math.random() * this.height, Math.random() * 20 + 10, 0, Math.PI * 2);
                    ctx.fillStyle = this.getRandomColor(150, 200);
                    ctx.fill();
                }
                // رسم مربعات بشكل عشوائي
                else {
                    ctx.fillRect(Math.random() * this.width, Math.random() * this.height, Math.random() * 30 + 10, Math.random() * 30 + 10);
                    ctx.fillStyle = this.getRandomColor(150, 200);
                    ctx.fill();
                }
            }

            // توليد تداخل الأحرف
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const fontFamily = this.fonts[Math.floor(Math.random() * this.fonts.length)];
            // رسم كل حرف بحجم ولون عشوائي
            for (let i = 0; i < this.text.length; i++) {
                try {
                    const randomFontSize = this.getRandomFontSize();
                    ctx.font = `${randomFontSize}px ${fontFamily}`;
                    const xPos = (i + 1) * (this.width / (this.text.length + 1));
                    const yPos = this.height / 2;

                    ctx.fillStyle = this.getRandomColor(0, 255);
                    ctx.fillText(this.text.charAt(i), xPos, yPos);
                } catch (error) {
                    console.log(error);
                }
            }

            // إرجاع الصورة كمصفوفة بايت
            return canvas.toBuffer('image/png');
        } catch (error) {
            console.error('Error creating CAPTCHA:', error);
            throw new Error('Failed to create CAPTCHA');
        }
    }

    /**
     * الحصول على نص CAPTCHA المولد وتنسيقه بطرق مختلفة.
     * @returns {Object} - كائن يحتوي على معلومات مهيأة عن النص المولد.
     * @property {string} original - النص الأصلي كما تم إنشاؤه.
     * @property {string} reversed - النص المعكوس.
     * @property {number} length - طول النص.
     * @property {string} originalUpperCase - النص الأصلي بكل حروفه كبيرة.
     * @property {string} originalLowerCase - النص الأصلي بكل حروفه صغيرة.
     * @property {string} reversedUpperCase - النص المعكوس بكل حروفه كبيرة.
     * @property {string} reversedLowerCase - النص المعكوس بكل حروفه صغيرة.
     */
    getText() {
        const formattedText = {
            length: this.text.length,
            original: this.text,
            reversed: this.text.split('').reverse().join(''), // النص المعكوس
            originalUpperCase: this.text.toUpperCase(), // النص الأصلي بكل حروفه كبيرة
            originalLowerCase: this.text.toLowerCase(), // النص الأصلي بكل حروفه صغيرة
            reversedUpperCase: this.text.split('').reverse().join('').toUpperCase(), // النص المعكوس بكل حروفه كبيرة
            reversedLowerCase: this.text.split('').reverse().join('').toLowerCase() // النص المعكوس بكل حروفه صغيرة
        };
        return formattedText;
    }

    /**
     * تحميل الخطوط من مجلد
     * @param {string} folderPath - مسار المجلد الذي يحتوي على الخطوط
     * @returns {string[]} - مصفوفة تحتوي على أسماء العائلات للخطوط المحملة
     */
    loadFonts(folderPath) {
        const fonts = [];
        const files = fs.readdirSync(folderPath);

        files.forEach((file) => {
            if (path.extname(file).toLowerCase() === '.ttf') {
                const fontPath = path.join(folderPath, file);
                const fontName = path.parse(file).name // استخراج اسم الملف بدون الامتداد
                try {
                    registerFont(fontPath, { family: fontName });
                    fonts.push(fontName);
                } catch (error) {
                    console.error(`Error loading font: ${fontPath}`, error);
                }
            }
        });

        return fonts;
    }


    /**
     * الحصول على لون عشوائي
     * @param {number} min - الحد الأدنى لقيمة RGB
     * @param {number} max - الحد الأعلى لقيمة RGB
     * @returns {string} - لون عشوائي بصيغة RGB
     */
    getRandomColor(min = 0, max = 255) {
        const r = Math.floor(Math.random() * (max - min + 1)) + min;
        const g = Math.floor(Math.random() * (max - min + 1)) + min;
        const b = Math.floor(Math.random() * (max - min + 1)) + min;
        return `rgb(${r},${g},${b})`;
    }

    /**
     * الحصول على لون فاتح جدًا عشوائي
     * @returns {string} - لون عشوائي بصيغة RGB
     */
    getRandomVeryLightColor() {
        const minBrightness = 220; // الحد الأدنى لسطوع اللون (0-255)

        // توليف لون فاتح جدًا
        const r = Math.floor(Math.random() * (255 - minBrightness + 1) + minBrightness);
        const g = Math.floor(Math.random() * (255 - minBrightness + 1) + minBrightness);
        const b = Math.floor(Math.random() * (255 - minBrightness + 1) + minBrightness);

        return `rgb(${r},${g},${b})`;
    }

    /**
     * الحصول على حجم خط عشوائي
     * @returns {number} - حجم خط عشوائي بين 80% و 120% من الحجم الأساسي
     */
    getRandomFontSize() {
        const baseFontSize = this.fontSize;
        const minFactor = 0.8; // عامل الحجم الأدنى
        const maxFactor = 1.5; // عامل الحجم الأعلى

        // حساب الحجم العشوائي
        const randomFactor = Math.random() * (maxFactor - minFactor) + minFactor;
        const randomFontSize = Math.round(baseFontSize * randomFactor);

        return randomFontSize;
    }
}

export default CaptchaGenerator;
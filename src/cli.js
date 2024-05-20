#!/usr/bin/env node

import CaptchaGenerator from "./index.js";
import fs from 'node:fs';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const root = path.resolve(process.cwd()); // project root directory (./)

// إنشاء مثيل من CaptchaGenerator مع الخيارات المناسبة
const captchaGenerator = new CaptchaGenerator({ characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' });

// توليد الصورة CAPTCHA
captchaGenerator.generateImageCaptcha().then((imageBuffer) => {
  // التحقق من وجود مسار حفظ محدد من خلال الـ CLI أو استخدام مسار افتراضي
  let imagePath = process.argv[2]; // استخدام المسار المحدد من خلال الـ CLI

  if (!imagePath) {
    // إذا لم يتم تحديد مسار الصورة، استخدام مسار افتراضي في نفس مجلد التشغيل
    imagePath = path.join(root, 'captcha.png');
  } else {
    // التأكد من توفر مسار الدليل وإنشاؤه إذا لم يكن موجودًا
    const dir = path.dirname(imagePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // حفظ الصورة كملف PNG
  fs.writeFileSync(imagePath, imageBuffer);
  console.log(`CAPTCHA created successfully: ${imagePath}`);

  // الحصول على النص CAPTCHA المولد
  const captchaText = captchaGenerator.getText();
  console.log(`CAPTCHA text: `, captchaText); // يمكنك استخدام أي من خصائص formattedText هنا
}).catch((error) => {
  console.error('Error creating CAPTCHA:', error);
});
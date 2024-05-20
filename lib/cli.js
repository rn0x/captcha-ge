#!/usr/bin/env node
"use strict";

var _index = _interopRequireDefault(require("./index.js"));
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _path = _interopRequireDefault(require("path"));
var _url = require("url");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _filename = (0, _url.fileURLToPath)(import.meta.url);
var _dirname = _path["default"].dirname(_filename);
var root = _path["default"].resolve(process.cwd()); // project root directory (./)

// إنشاء مثيل من CaptchaGenerator مع الخيارات المناسبة
var captchaGenerator = new _index["default"]({
  characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
});

// توليد الصورة CAPTCHA
captchaGenerator.generateImageCaptcha().then(function (imageBuffer) {
  // التحقق من وجود مسار حفظ محدد من خلال الـ CLI أو استخدام مسار افتراضي
  var imagePath = process.argv[2]; // استخدام المسار المحدد من خلال الـ CLI

  if (!imagePath) {
    // إذا لم يتم تحديد مسار الصورة، استخدام مسار افتراضي في نفس مجلد التشغيل
    imagePath = _path["default"].join(root, 'captcha.png');
  } else {
    // التأكد من توفر مسار الدليل وإنشاؤه إذا لم يكن موجودًا
    var dir = _path["default"].dirname(imagePath);
    if (!_nodeFs["default"].existsSync(dir)) {
      _nodeFs["default"].mkdirSync(dir, {
        recursive: true
      });
    }
  }

  // حفظ الصورة كملف PNG
  _nodeFs["default"].writeFileSync(imagePath, imageBuffer);
  console.log("CAPTCHA created successfully: ".concat(imagePath));

  // الحصول على النص CAPTCHA المولد
  var captchaText = captchaGenerator.getText();
  console.log("CAPTCHA text: ", captchaText); // يمكنك استخدام أي من خصائص formattedText هنا
})["catch"](function (error) {
  console.error('Error creating CAPTCHA:', error);
});
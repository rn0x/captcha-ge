<div align="center">

<img align="center" src = "https://komarev.com/ghpvc/?username=rn0x-captcha-ge&label=REPOSITORY+VIEWS&style=for-the-badge" alt ="Captcha-Generator"> <br><br>


</div>

# Captcha-Generator

captcha-ge is a Node.js library for generating CAPTCHA (Completely Automated Public Turing test to tell Computers and Humans Apart) images. It provides both a JavaScript API and a Command-Line Interface (CLI) for easy integration into web applications.

## Installation

To use captcha-ge in your Node.js project, follow these steps:

1. **Install Node.js:**
   - Make sure Node.js is installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).

2. **Install Captcha-Generator:**
   - Install Captcha-Generator using npm:
     ```bash
     npm install captcha-ge
     #or
     npm install -g captcha-ge
     ```

## Usage

### Using CaptchaGenerator Class (JavaScript API):

You can use the `CaptchaGenerator` class to programmatically create CAPTCHA images in your JavaScript code:

```javascript
import CaptchaGenerator from 'captcha-ge';

// Create an instance of CaptchaGenerator with options
const captchaGenerator = new CaptchaGenerator({
  characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
});

// Generate CAPTCHA image and save it to a file
captchaGenerator.generateImageCaptcha().then((imageBuffer) => {
  // Save the image to a file (e.g., captcha.png)
  fs.writeFileSync('captcha.png', imageBuffer);
  console.log('CAPTCHA image created successfully.');
}).catch((error) => {
  console.error('Error creating CAPTCHA:', error);
});
```

### Retrieving Text with `getText()`:

The `CaptchaGenerator` class also provides a method `getText()` to retrieve formatted text from the generated CAPTCHA:

```javascript
// Generate CAPTCHA text
const captchaText = captchaGenerator.getText();

console.log('Original Text:', captchaText.original);
console.log('Reversed Text:', captchaText.reversed);
console.log('Original UpperCase Text:', captchaText.originalUpperCase);
console.log('Original LowerCase Text:', captchaText.originalLowerCase);
console.log('Reversed UpperCase Text:', captchaText.reversedUpperCase);
console.log('Reversed LowerCase Text:', captchaText.reversedLowerCase);
console.log('Text Length:', captchaText.length);

// ==== OUTPUT ====
// Original Text: OU57A4
// Reversed Text: 4A75UO
// Original UpperCase Text: OU57A4
// Original LowerCase Text: ou57a4
// Reversed UpperCase Text: 4A75UO
// Reversed LowerCase Text: 4a75uo
// Text Length: 6
```

### cli

```bash

npm install -g captcha-ge

captcha-ge ./path/to/save/captcha.png

# OUTPUT
# CAPTCHA created successfully: C:\Users\hp\captcha.png
# CAPTCHA text:  {
#   length: 6,
#   original: 'HSQZQB',
#   reversed: 'BQZQSH',
#   originalUpperCase: 'HSQZQB',
#   originalLowerCase: 'hsqzqb',
#   reversedUpperCase: 'BQZQSH',
#   reversedLowerCase: 'bqzqsh'
# }

```
### Customization

You can customize the CAPTCHA generation by providing options to the `CaptchaGenerator` constructor, such as `characters`

### Examples

#### Integration with Express:

Here's an example of how to integrate Captcha-Generator with Express for generating CAPTCHA images on an HTTP endpoint:

```javascript
import express from 'express';
import CaptchaGenerator from 'captcha-ge';

const app = express();

// Middleware to generate and serve CAPTCHA image
app.get('/captcha', (req, res) => {
  const captchaGenerator = new CaptchaGenerator();
  captchaGenerator.generateImageCaptcha().then((imageBuffer) => {
    res.set({ 'Content-Type': 'image/png' });
    res.send(imageBuffer);
  }).catch((error) => {
    console.error('Error generating CAPTCHA:', error);
    res.status(500).send('Error generating CAPTCHA');
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

#### Integration with Telegram Bot:

You can integrate Captcha-Generator with a Telegram bot to send CAPTCHA images in a chat:

```javascript
import TelegramBot from 'node-telegram-bot-api';
import CaptchaGenerator from 'captcha-ge';

const botToken = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(botToken, { polling: true });

bot.onText(/\/captcha/, async (msg) => {
  const chatId = msg.chat.id;
  const captchaGenerator = new CaptchaGenerator();
  const imageBuffer = await captchaGenerator.generateImageCaptcha();

  bot.sendPhoto(chatId, imageBuffer, { caption: 'Please solve this CAPTCHA:' })
    .catch((error) => {
      console.error('Error sending CAPTCHA:', error);
      bot.sendMessage(chatId, 'Failed to send CAPTCHA. Please try again later.');
    });
});
```

## Dependencies

Captcha-Generator relies on the `canvas` library for image generation. Make sure to install all dependencies (`node-canvas` and its dependencies) for your environment.
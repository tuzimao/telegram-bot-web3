# Telegram Bot with Web3 Integration

This repository contains a basic Telegram bot designed to interact with Web3.

## Prerequisites

- [Node.js](https://nodejs.org/) and npm

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/tuzimao/telegram-bot-web3.git
   cd telegram-bot-web3
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:

   Create a `.env` file in the root directory and add your Telegram bot token:

   ```properties
   TELEGRAM_BOT_TOKEN=your_token_here
   ```

4. **Compile TypeScript (if applicable)**:

   ```bash
   npx tsc
   ```

## Running the Bot

Once you've set everything up, you can run the bot using:

```bash
node index.js
```

Open your bot dialog window on telegram and type `/start` you will see "Hello,World"

# VENUS WHALE TRACKING BOT
Tracking all action supply, borrow, flash_loan, liquidate on Venus Protocol (BSC)

This repository is open source. You can update a few line of code to tracking other protocols

Powered by https://txdecoder.xyz


## 1. Prepare telegram bot and telegram channel
- Open telegram
- Chat with @BotFather
- Type command `/newbot`
- Save telegram bot token to TELEGRAM_BOT_TOKEN in .env
- Create a new telegram channel
- Add above telegram to channel as admin
- Chat with @username_to_id_bot
- Enter telegram channel name to get CHAT_ID, saving to TELEGRAM_CHAT_ID to .env

## 2. Get API key from txdecoder.xyz
- Go to https://txdecoder.xyz
- Sign in with Google
- Upgrade account to Plan that support Websocket. https://txdecoder.xyz/#pricing
- Get API key , saving to TXDECODER_API_KEY in .env

## 3. Run
- Clone this repo
- Run below command

```bash
npm install
cp .env.sample .env
```

- Update .env file
```bash
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TXDECODER_API_KEY=
PROTOCOL=Venus
# min value 10_000 USD
THRESHOLD_VALUE_USD=10000
```

- Run command 
```bash
node index.js
```

## Example:
Venus whale tracking channel https://t.me/+RLhWXUGJsJ82MmQ9
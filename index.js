const { default: axios } = require('axios')
const { formatBigNumber } = require('./format')
const dotenv = require('dotenv')
dotenv.config()
const WebSocket = require('ws')

const EXPLORER_URL = process.env.EXPLORER_URL

const token = process.env.TELEGRAM_BOT_TOKEN
const target = process.env.TELEGRAM_CHAT_ID
const url = `https://api.telegram.org/bot${token}/sendMessage`

const sendTelegramMessage = async (msg, isHtmlMode = false) => {
    const data = {
        chat_id: target,
        text: msg,
    }
    if (isHtmlMode) {
        data.parse_mode = 'html'
        data.disable_web_page_preview = true
    }
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data,
        url,
    }
    console.log('Sending message:', data)
    return await axios(options)
}


const main = async () => {
    // Connect through the WebSocket proxy with authentication
    const apiKey = process.env.TXDECODER_API_KEY
    const proxyUrl = process.env.TXDECODER_WSS
    const ws = new WebSocket(proxyUrl, { headers: { 'x-api-key': apiKey }, rejectUnauthorized: false })

    ws.on('open', () => {
        console.log('Connected to TxDecoder WebSocket server')

        // Send the DEX message after connection is established
        const message = {
            type: 'LENDING',
            protocol: process.env.PROTOCOL,
            min_value_usd: Number(process.env.THRESHOLD_VALUE_USD)
        }
        ws.send(JSON.stringify(message))
        console.log('Sent message:', message)
    })

    ws.on('error', (error) => {
        console.error('WebSocket error:', error)
        process.exit(1)
      })
    
      ws.on('close', (code, reason) => {
        console.log(`Connection closed. Code: ${code}, Reason: ${reason}`)
        process.exit(0)
      })
    ws.on('message', (data) => {
        const message = JSON.parse(data)
        // Receive message from WebSocket, format is an object of User Actions
        // https://txdecoder.gitbook.io/docs/data-schema/user-action
        // {
        //     [transaction_hash_1]: [
        //         // List of user actions in transaction 1
        //     ],
        //     [transaction_hash_2]: [
        //         // List of user actions in transaction 2
        //     ]
        // }

        for (const txHash in message) {
            const userActions = message[txHash]
            if (!Array.isArray(userActions)) continue
            for (const userAction of userActions) {
                const { tokens, participants, tx_hash: txHash, value_usd: valueUsd, action, protocol, source } = userAction
                if (!txHash) continue
                if (action !== 'supply' && action !== 'borrow' && action !== 'flash_loan' && action !== 'liquidate') continue
                if (protocol !== process.env.PROTOCOL && source !== process.env.PROTOCOL) continue
                if (Number(valueUsd) < Number(process.env.THRESHOLD_VALUE_USD)) continue

                const msg =
                `🚨 VENUS — ${action.toUpperCase()} ${formatBigNumber(Number(tokens[0].ui_amount))} <a href="${EXPLORER_URL}/token/${tokens[0].address}">${tokens[0].symbol}</a> ($${formatBigNumber(Number(valueUsd))})\n`
                + `User: <code>${participants[0].address}</code>\n`
                + `<a href="${EXPLORER_URL}/tx/${txHash}">View on Explorer</a>\n`
                sendTelegramMessage(msg, true)
            }
        }
    })

}

main().catch(console.error)

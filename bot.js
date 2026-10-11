const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Initialize WhatsApp Client with specific compatibility arguments for WSL
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process'
        ]
    }
});

// Helper function to create the randomized delay
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Event: Draw the login QR Code in the terminal
client.on('qr', (qr) => {
    console.log('\n==================================================');
    console.log('SCAN THIS QR CODE WITH YOUR WHATSAPP APP TO LINK:');
    console.log('==================================================\n');
    qrcode.generate(qr, { small: true });
});

// Event: Triggers when the bot successfully logs in
client.on('ready', () => {
    console.log('\n[SUCCESS] Status View & Like Automation is Active and Safe!');
    console.log('You can now close this terminal window anytime.\n');
});

// Event: Listen for incoming status updates
client.on('message', async (msg) => {
    // Check if the message is coming from a status update broadcast channel
    if (msg.from === 'status@broadcast') {
        try {
            const sender = msg.author || msg.from;
            
            // Generate a random delay between 15 and 45 seconds to mimic human actions
            const randomSeconds = Math.floor(Math.random() * (45 - 15 + 1)) + 15;
            console.log(`[Status Detected] From: ${sender}. Pausing for ${randomSeconds}s to keep account safe...`);
            
            // Wait out the timer
            await delay(randomSeconds * 1000);

            // 1. View the status using the main client context
            const chat = await msg.getChat();
            await chat.sendSeen();
            console.log(`[+] Automatically viewed status from ${sender}`);

            // 2. Like the status (Sends a heart reaction)
            await msg.react('❤️');

            console.log(`[+] Successfully liked status from ${sender}`);

        } catch (error) {
            console.error('[-] Error interacting with status update:', error);
        }
    }
});

// Start the client engine
client.initialize();


const axios = require('axios');
require('dotenv').config();

class ChatGptPromptService {
    constructor() {
        this.apiKey = process.env.CHATGPT_API_KEY;
        this.model = process.env.CHATGPT_MODEL;
        this.apiUrl = process.env.CHATGPT_URL;
        this.timeout = Number(process.env.CHATGPT_HTTP_TIMEOUT) || 30000;

        this.endpoint = `${this.apiUrl}/chat/completions`;
    }

    async execute(prompt) {
        try {
            const { data } = await axios.post(
                this.endpoint,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    temperature: 0.7,
                },
                {
                    timeout: this.timeout,
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return data.choices?.[0]?.message?.content || null;
        } catch (error) {
            console.error(
                'Erro ao chamar a API do ChatGPT:',
                error.response?.data || error.message
            );

            throw new Error('Erro ao processar a solicitação do ChatGPT.');
        }
    }
}

module.exports = new ChatGptPromptService();

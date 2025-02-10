const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const token = process.env.ASANA_ACCESS_TOKEN;

async function uploadFile(file) {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", file.name);

        const response = await axios.post(
            "https://app.asana.com/api/1.0/attachments",
            formData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                    ...formData.getHeaders(),
                }
            }
        );

        console.log("Arquivo enviado com sucesso:", response.data);
        return response.data;
    } catch (error) {
        console.error("Erro ao enviar o arquivo:", error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = uploadFile;

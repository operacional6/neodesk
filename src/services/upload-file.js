const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const token = process.env.ASANA_ACCESS_TOKEN;

async function uploadFile(file, taskId) {
  try {
    const formData = new FormData();
    let fileBuffer = file.data;
    if (!Buffer.isBuffer(fileBuffer)) {
      fileBuffer = Buffer.from(file.data, 'base64');
    }
    formData.append("parent", taskId);
    formData.append("file", fileBuffer, file.name);

    const response = await axios.post(
      "https://app.asana.com/api/1.0/attachments",
      formData,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          ...formData.getHeaders()
        }
      }
    );

    console.log("Upload realizado com sucesso:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro no upload do arquivo:", error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = uploadFile;

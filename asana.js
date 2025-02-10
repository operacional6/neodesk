const axios = require('axios');
require('dotenv').config();
const uploadFile = require('./upload-file');  // Importa a função de upload

const token = process.env.ASANA_ACCESS_TOKEN;
const workspaceId = process.env.ASANA_WORKSPACE_ID;
const projectId = process.env.ASANA_PROJECT_ID;
const assigneeId = process.env.ASANA_ASSIGNEE_ID;

function generateTAPID() {
    return "TAP" + Math.floor(100000 + Math.random() * 900000);
}

async function sendToAsana(formJsonData) {
        const tapID = generateTAPID();

        console.log(formJsonData);

        if (!formJsonData.link || !formJsonData.tipo || !formJsonData.impacto || !formJsonData.email || !formJsonData.gestor) {
            throw new Error("Dados incompletos no formData");
        }
    // try {
    //     const tapID = generateTAPID();

    //     const taskData = {
    //         "data": {
    //             "workspace": workspaceId,
    //             "assignee": assigneeId,
    //             "projects": projectId,
    //             "name": `Novo TAP: ${tapID}`,
    //             "notes": `*Link do problema: ${formData.link}\n*Tipo: ${formData.tipo}\n${"*Descrição: " + formData.descricao || " "}\n*Impacto: ${formData.impacto}\n*E-mail: ${formData.email}\n*Gestor Imediato: ${formData.gestor}\n*TAP ID: ${tapID}`,
    //         }
    //     };

    //     console.log("Enviando payload para o Asana:", taskData);

    //     const taskResponse = await axios.post(
    //         "https://app.asana.com/api/1.0/tasks",
    //         taskData,
    //         {
    //             headers: {
    //                 "Authorization": `Bearer ${token}`,
    //                 "Content-Type": "application/json"
    //             }
    //         }
    //     );

    //     const taskId = taskResponse.data.data.id;
    //     console.log("Tarefa criada com sucesso:", taskResponse.data);

    //     if (formData.screenshot) {
    //       console.log("enviando imagem")
    //         const screenshotFile = formData.screenshot;
    //         const uploadResponse = await uploadFile(screenshotFile);
    //         const attachFileResponse = await axios.post(
    //           `https://app.asana.com/api/1.0/tasks/${taskId}/attachments`,
    //           {
    //               "file": uploadResponse.file,
    //           },
    //           {
    //               headers: {
    //                   "Authorization": `Bearer ${token}`,
    //                   "Content-Type": "application/json"
    //               }
    //           }
    //       );
          
    //       console.log("Arquivo de captura de tela enviado com sucesso:", uploadResponse);
    //     }

    //     return { data: taskResponse.data, tapID };

    // } catch (error) {
    //     console.error("Erro ao criar tarefa no Asana:", error.response ? error.response.data : error.message);
    //     throw error;
    // }
}

module.exports = sendToAsana;

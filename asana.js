const axios = require('axios');
require('dotenv').config();

const token = process.env.ASANA_ACCESS_TOKEN;
const workspaceId = process.env.ASANA_WORKSPACE_ID;
const assigneeId = process.env.ASANA_ASSIGNEE_ID;

console.log('Access Token:', token);
console.log('Workspace ID:', workspaceId);
console.log('Assignee ID:', assigneeId);

function generateTAPID() {
    return "TAP" + Math.floor(100000 + Math.random() * 900000);
}
  
  async function sendToAsana(formData) {
      console.log('formData' + formData);
    try {
      const tapID = generateTAPID();
  
      const taskData = {
        "data": {
          "workspace": `${process.env.ASANA_WORKSPACE_ID}`,  
          "assignee": `${process.env.ASANA_ASSIGNEE_ID}`, 
          "name": `Novo TAP: ${formData.sistema}`,
          "notes": `**Tipo:** ${formData.tipo}\n**Descrição:** ${formData.descricao}\n**E-mail:** ${formData.email}\n**Gestor:** ${formData.gestor}\n**TAP ID:** ${tapID}`,
          // Caso você tenha campos personalizados, descomente e ajuste a seguir:
          // custom_fields: {
          //   "ID_CAMPO_GESTOR": formData.gestor,
          //   "ID_CAMPO_EMAIL": formData.email,
          //   "ID_CAMPO_TAPID": tapID
          // }
        }
      };
  
      console.log("Enviando payload para o Asana:", taskData);
  
      const response = await axios.post(
        "https://app.asana.com/api/1.0/tasks",
        taskData,
        {
          headers: {
            "Authorization": `Bearer ${process.env.ASANA_ACCESS_TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      console.log("Tarefa criada com sucesso:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar tarefa no Asana:", error.response ? error.response.data : error.message);
      throw error;
    }
  }

module.exports = sendToAsana;

const axios = require('axios');
require('dotenv').config();

const token = process.env.ASANA_ACCESS_TOKEN;
const workspaceId = process.env.ASANA_WORKSPACE_ID;
const projectId = process.env.ASANA_PROJECT_ID;
const assigneeId = process.env.ASANA_ASSIGNEE_ID;

function generateTAPID() {
    return "TAP" + Math.floor(100000 + Math.random() * 900000);
}
  
  async function sendToAsana(formData) {
    try {
      const tapID = generateTAPID();
  
      const taskData = {
        "data": {
          "workspace": workspaceId,  
          "assignee": assigneeId, 
          "projects": projectId,
          "name": `Novo TAP: ${formData.sistema}`,
          "notes": `**Tipo:** ${formData.tipo}\n**Descrição:** ${formData.descricao}\n**E-mail:** ${formData.email}\n**Gestor:** ${formData.gestor}\n**TAP ID:** ${tapID}`,
          "custom_fields": {
            "1209334302156561": formData.gestor,
            "1209334302156563": formData.email,
            "1209334302156565": tapID
          }
        }
      };
  
      console.log("Enviando payload para o Asana:", taskData);
  
      const response = await axios.post(
        "https://app.asana.com/api/1.0/tasks",
        taskData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      console.log("Tarefa criada com sucesso:", response.data);
      return { data: response.data, tapID };
    } catch (error) {
      console.error("Erro ao criar tarefa no Asana:", error.response ? error.response.data : error.message);
      throw error;
    }
  }

module.exports = sendToAsana;

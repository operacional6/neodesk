document.addEventListener("DOMContentLoaded", function () {
    
    const cf = window.cf.ConversationalForm.startTheConversation({
        formEl: document.getElementById("form"),
        context: document.getElementById("cf-context"),
        data: [
            {
                question: "Qual sistema ou serviço está apresentando o problema?",
                name: "sistema",
                input: "radio",
                options: [
                    {label: "Hub", value: "Hub"},
                    {label: "Polopoly", value: "Polopoly"},
                    {label: "Neo Composer", value: "Neo Composer"},
                    {label: "Intera", value: "Intera"},
                    {label: "Diário do Nordeste", value: "Diário do Nordeste"},
                    {label: "Oráculo", value: "Oráculo"},
                    {label: "Outro", value: "Outro"}
                ]
            },
            {
                question: "Qual é o tipo de problema?",
                name: "tipo",
                input: "radio",
                options: [
                    {label: "Erro na interface", value: "Erro na interface"},
                    {label: "Falha em funcionalidade", value: "Falha em funcionalidade"},
                    {label: "Problema nos dados", value: "Problema nos dados"},
                    {label: "Desempenho ruim", value: "Desempenho ruim"}
                ]
            },
            {
                question: "Descreva o problema:",
                name: "descricao",
                input: "text"
            },
            {
                question: "Qual é o seu e-mail para contato?",
                name: "email",
                input: "email"
            },
            {
                question: "Quem é o seu gestor imediato?",
                name: "gestor",
                input: "text"
            }
        ],
        submitCallback: function () {
            const formData = cf.getFormData();
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            const jsonString = JSON.stringify(formObject);
        
            axios.post("/asana", jsonString, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => {
                console.log("Resposta do servidor:", response.data);
                cf.addRobotChatResponse(`Obrigado! Seu pedido foi registrado com ID ${response.data.tapID}. Nossa equipe retornará em breve.`);
            })
            .catch(error => {
                console.error("Erro na comunicação com o servidor:", error);
                cf.addRobotChatResponse("Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente mais tarde.");
            });
        }
    });
});

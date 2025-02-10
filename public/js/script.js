document.addEventListener("DOMContentLoaded", function () {
    
    const cf = window.cf.ConversationalForm.startTheConversation({
        formEl: document.getElementById("form"),
        context: document.getElementById("cf-context"),
        data: [
            {
                question: "Descreva bremente o problema:",
                name: "descricao",
                input: "text"
            },
            {
                question: "Qual é o tipo de problema?",
                name: "tipo",
                input: "radio",
                options: [
                    {label: "Algo aparece errado na página", value: "Algo aparece errado na página"},
                    {label: "O sistema não faz o que deveria", value: "O sistema não faz o que deveria"},
                    {label: "Lentidão, travamentos", value: "Lentidão, travamentos"},
                    {label: "Outro", value: "Outro"},
                ]
            },
            {
                question: "Descreva brevemente o problema:",
                name: "descricao",
                input: "text",
                conditions: [{ field: "tipo", value: "Outro" }]
            },
            {
                question: "O quanto isso está atrapalhando seu trabalho?",
                name: "impacto",
                input: "radio",
                options: [
                    {label: "Bloqueia atividades essenciais", value: "Bloqueia atividades essenciais"},
                    {label: "Prejudica, mas consigo continuar", value: "Prejudica, mas consigo continuar"},
                    {label: "Incômodo, mas tem solução alternativa", value: "Incômodo, mas tem solução alternativa"},
                    {label: "Não impacta, só queria informar", value: "Não impacta, só queria informar"},
                ]
            },
            {
                question: "Envie um print da tela para entendermos melhor o problema:",
                name: "screenshot",
                input: "file"
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

            console.log(jsonString);
            
            axios.post("/asana", jsonString, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => {
                if (response.data) {
                    console.log("Resposta do servidor:", response.data);
                    cf.addRobotChatResponse(`Obrigado! Seu pedido foi registrado com ID ${response.data.tapID}. Nossa equipe retornará em breve.`);
                }
            })
            .catch(error => {
                console.error("Erro na comunicação com o servidor:", error);
                cf.addRobotChatResponse("Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente mais tarde.");
            });
        }
    });
});

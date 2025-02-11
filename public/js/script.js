document.addEventListener("DOMContentLoaded", function () {
    
    const cf = window.cf.ConversationalForm.startTheConversation({
        formEl: document.getElementById("form"),
        context: document.getElementById("cf-context"),
        data: [
            {
                question: "Para começarmos, cole o link do sistema onde você encontrou o problema. Isso nos ajuda a identificar rapidamente!",
                name: "link",
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
                name: "anexo",
                input: "file",
                accept: "image/*",
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
            const cfData = cf.getFormData();
            const formObject = {};
            cfData.forEach((value, key) => {
                formObject[key] = value;
            });
            console.log("Dados do formulário (objeto):", formObject);

            const formData = new FormData();
            Object.keys(formObject).forEach(key => {
              formData.append(key, formObject[key]);
            });

            const fileInput = document.querySelector('input[name="anexo"]');
            if (fileInput && fileInput.files.length > 0) {
                formData.set("anexo", fileInput.files[0], fileInput.files[0].name);
            } else {
                console.log("Nenhum arquivo selecionado no campo anexo.");
            }
            
            axios.post("/asana", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            .then(response => {
                if (response.data) {
                    console.log("Resposta do servidor:", response.data);
                    cf.addRobotChatResponse(`Obrigado! Seu relato foi registrado com ID ${response.data.tapID}. Nossa equipe irá analisar e entraremos em contato se precisarmos de mais informações.`);
                }
            })
            .catch(error => {
                console.error("Erro na comunicação com o servidor:", error);
                cf.addRobotChatResponse("Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente mais tarde.");
            });
        }
    });
});

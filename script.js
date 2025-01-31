window.onload = function() {
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
        ]
    });
};

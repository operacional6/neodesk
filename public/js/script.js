document.addEventListener("DOMContentLoaded", function () {
    
    const cf = window.cf.ConversationalForm.startTheConversation({
        formEl: document.getElementById("form"),
        context: document.getElementById("cf-context"),
        flowStepCallback: function (dto, success, error) {
            if (dto.tag.name === "anexo") {
                const inputFile = document.querySelector('input[name="anexo"]');
                if (!inputFile.files.length) {
                    return error("Este campo é obrigatório!");
                }
            }

            if (dto.tag.name === "link") {
                const inputLink = document.querySelector('input[name="link"]');
                inputLink.value = inputLink.value.trim().replace(/(\.com|\.br|\.net|\.org|\.gov|\.edu)(\/.*)?$/, "$1");
            }

            if (dto.tag.name === "descricao") {
                const inputDescricao = document.querySelector('input[name="descricao"]');
                const descricaoValue = inputDescricao.value.trim();
        
                if (!descricaoValue) {
                    return error("Este campo é obrigatório!");
                }

                if (descricaoValue.length < 20) {
                    return error("Tamanho mínimo de 20 caracteres!");
                }
        
                if (descricaoValue.length > 300) {
                    return error("Tamanho máximo de 300 caracteres!");
                }
            }

            success();
        },
        submitCallback: function () {
            cf.addRobotChatResponse(`Registrando sua solicitação...`);
            setTimeout(() => {
                const textarea = document.querySelector("textarea");
                if (textarea) {
                    textarea.removeAttribute("placeholder");
                }
            }, 100);
            const cfData = cf.getFormData();
            const formData = new FormData();

            cfData.forEach((value, key) => formData.append(key, value));

            const fileInput = document.querySelector('input[name="anexo"]');
            if (fileInput?.files.length) {
                Array.from(fileInput.files).forEach(file => {
                    formData.append("anexo[]", file, file.name);
                });
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

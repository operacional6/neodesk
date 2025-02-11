document.addEventListener("DOMContentLoaded", function () {
    
    const cf = window.cf.ConversationalForm.startTheConversation({
        formEl: document.getElementById("form"),
        context: document.getElementById("cf-context"),
        flowStepCallback: function (dto, success, error) {
            if (dto.tag.name === "anexo") {
                const inputFile = document.querySelector('input[name="anexo"]');
                if (!inputFile.files.length) {
                    dto.errorMessage = "Este campo é obrigatório!";
                    return error();
                }
            }

            if (dto.tag.name === "link") {
                const inputLink = document.querySelector('input[name="link"]');
                inputLink.value = inputLink.value.trim().replace(/(\.com|\.br|\.net|\.org|\.gov|\.edu)(\/.*)?$/, "$1");
            }

            success();
        },
        submitCallback: function () {
            const cfData = cf.getFormData();
            const formData = new FormData();

            cfData.forEach((value, key) => formData.append(key, value));

            const fileInput = document.querySelector('input[name="anexo"]');
            if (fileInput?.files.length) {
                formData.set("anexo", fileInput.files[0], fileInput.files[0].name);
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

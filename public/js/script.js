document.addEventListener("DOMContentLoaded", function () {
    const cfContext = document.getElementById("cf-context");

    // Cria o checkbox (mas não exibe ainda)
    const checkboxDiv = document.createElement("div");
    checkboxDiv.style.textAlign = "center";
    checkboxDiv.style.marginTop = "8px";
    checkboxDiv.style.display = "none";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "nao-tem-imagem-checkbox";
    checkbox.name = "nao_tem_imagem";
    checkbox.value = "sim";
    const label = document.createElement("label");
    label.htmlFor = "nao-tem-imagem-checkbox";
    label.textContent = "Não tenho imagem para enviar";
    checkboxDiv.appendChild(checkbox);
    checkboxDiv.appendChild(label);

    // Cria o feedback
    const feedbackEl = document.createElement("div");
    feedbackEl.id = "upload-feedback";
    feedbackEl.style.fontSize = "12px";
    feedbackEl.style.color = "#555";
    feedbackEl.style.textAlign = "center";
    feedbackEl.style.display = "none";
    feedbackEl.textContent = "Nenhuma imagem anexada";

    // Insere checkbox e feedback no DOM
    cfContext.parentNode.insertBefore(checkboxDiv, cfContext.nextSibling);
    cfContext.parentNode.insertBefore(feedbackEl, checkboxDiv.nextSibling);

    // Atualiza feedback ao selecionar arquivos
    document.addEventListener("change", function (event) {
        if (event.target && event.target.type === "file" && event.target.name === "anexo") {
            const files = event.target.files.length;
            feedbackEl.textContent = files === 1 ? `1 imagem anexada` : `${files} imagens anexadas`;
            feedbackEl.style.display = files > 0 ? "block" : "none";
        }
    });

    const cf = window.cf.ConversationalForm.startTheConversation({
        formEl: document.getElementById("form"),
        context: cfContext,
        flowStepCallback: function (dto, success, error) {

            if (dto.tag.name === "anexo") {
                checkboxDiv.style.display = "block";
                // Feedback só aparece se houver arquivo
                const fileInput = document.getElementById("input-anexo");
                feedbackEl.style.display = fileInput.files.length > 0 ? "block" : "none";
                // Validação: exige imagem ou checkbox marcado
                if (!fileInput.files.length && !checkbox.checked) {
                    return error("Envie uma imagem ou marque a opção 'Não tenho imagem para enviar'.");
                }
            } else {
                checkboxDiv.style.display = "none";
                feedbackEl.style.display = "none";
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

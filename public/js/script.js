document.addEventListener("DOMContentLoaded", function () {
    const cfContext = document.getElementById("cf-context");

    // Cria o feedback (mantém como está)
    const feedbackEl = document.createElement("div");
    feedbackEl.id = "upload-feedback";
    feedbackEl.style.fontSize = "12px";
    feedbackEl.style.color = "#555";
    feedbackEl.style.textAlign = "center";
    feedbackEl.style.display = "none";
    feedbackEl.textContent = "Nenhuma imagem anexada";
    cfContext.parentNode.insertBefore(feedbackEl, cfContext.nextSibling);

    // Cria o checkbox (fora do CF, como antes)
    const checkboxDiv = document.createElement("div");
    checkboxDiv.style.textAlign = "center";
    checkboxDiv.style.marginTop = "8px";
    checkboxDiv.style.display = "none";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "nao-tem-imagem-checkbox";
    checkbox.name = "nao_tem_imagem";
    const label = document.createElement("label");
    label.htmlFor = "nao-tem-imagem-checkbox";
    label.textContent = "Não tenho imagem para enviar";
    checkboxDiv.appendChild(checkbox);
    checkboxDiv.appendChild(label);
    cfContext.parentNode.insertBefore(checkboxDiv, feedbackEl);

    // Atualiza feedback ao selecionar arquivos
    document.addEventListener("change", function (event) {
        if (event.target && event.target.type === "file" && event.target.name === "anexo") {
            const files = event.target.files.length;
            feedbackEl.textContent = files === 1 ? `1 imagem anexada` : `${files} imagens anexadas`;
            feedbackEl.style.display = files > 0 ? "block" : "none";
        }
    });

    // Monitora a aparição do <cf-input tag-type="file">
    let lastVisible = false;
    setInterval(() => {
        const cfFileInput = document.querySelector('cf-input[tag-type="file"]');
        if (cfFileInput && !lastVisible) {
            checkboxDiv.style.display = "block";
            lastVisible = true;
        } else if (!cfFileInput && lastVisible) {
            checkboxDiv.style.display = "none";
            lastVisible = false;
        }
    }, 100);

    const cf = window.cf.ConversationalForm.startTheConversation({
        formEl: document.getElementById("form"),
        context: cfContext,
        flowStepCallback: function (dto, success, error) {

             if (dto.tag.name === "anexo") {
                const fileInput = document.getElementById("input-anexo");
                const checkbox = document.getElementById("nao-tem-imagem-checkbox");
                if (!fileInput.files.length && !(checkbox && checkbox.checked)) {
                    return error("Envie uma imagem ou marque a opção 'Não tenho imagem para enviar'.");
                }
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
    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            console.log('Checkbox marcado - tentando avançar...');
            
            //Simula múltiplos eventos para garantir que funcione
            const cfFileInput = document.querySelector('cf-input[tag-type="file"] input');
            if (cfFileInput) {
                cfFileInput.focus();
                cfFileInput.value = "";
                
                // Dispara múltiplos eventos em sequência
                const events = [
                    new Event('input', { bubbles: true }),
                    new Event('change', { bubbles: true }),
                    new KeyboardEvent('keypress', {
                        bubbles: true,
                        cancelable: true,
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13
                    }),
                    new KeyboardEvent('keyup', {
                        bubbles: true,
                        cancelable: true,
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13
                    })
                ];
                
                events.forEach((event, index) => {
                    setTimeout(() => {
                        cfFileInput.dispatchEvent(event);
                    }, index * 50);
                });
                console.log('Eventos disparados para avançar...');
            }
        }
    });
});

const responseSectionElement = document.getElementById("response");
const responseContentParagraphElement = document.getElementById("responseContent");

const serverUrl = "http://localhost:8080/";

async function getServerResponse()
{
    return await fetch(serverUrl);
}

async function getServerMessage()
{
    const response = await getServerResponse();
    return await response.text();
}

async function updateResponse()
{
    const serverMessage = await getServerMessage();
    responseSectionElement.className = "";
    responseContentParagraphElement.textContent = serverMessage;
}
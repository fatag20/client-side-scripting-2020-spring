const serverUrl = "http://localhost:8080";

async function getServerResponse()
{
    return await fetch(serverUrl);
}

async function getServerText()
{
    const response = await getServerResponse();
    return await response.text();
}

const titleElement = document.getElementById("title");

window.setInterval(async () => {
        titleElement.textContent = await getServerText();
    },
    250);
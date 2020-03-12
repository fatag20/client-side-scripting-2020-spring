const serverUrl = "https://naive-guestbook.herokuapp.com";

async function postMessage(message)
{
    await post(`${serverUrl}/api/message`, message);
}

async function getMessages()
{
    const response = await fetch(`${serverUrl}/api/messages`);
    return response.json();
}

// From https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
async function post(url = '', data = {})
{
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'no-cors',
        body: JSON.stringify(data)
    });

    return response;
}
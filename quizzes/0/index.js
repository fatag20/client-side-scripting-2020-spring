const listElement = document.getElementById("list");
let numberOfClicks = 0;

function appendNewListItemElement()
{
    numberOfClicks++;

    const listItemElement = document.createElement("li");
    listItemElement.textContent = numberOfClicks;
    listElement.appendChild(listItemElement);
}

function alertMessage()
{
    alert("Message");
}
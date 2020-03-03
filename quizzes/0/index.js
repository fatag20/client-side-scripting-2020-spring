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

function printSomeNumbers()
{
    const numbers = [0, 1, 3, 4];
    numbers.forEach(number => console.log(number));
}

function returnSomeNumbers()
{
    const numbers = [0, 1, 3, 4, 6, 7, 8];
    return numbers.filter(x => x % 2 === 0);
}

function doSomethingMysterious()
{
    const headerElement = document.getElementById("title");
    headerElement.textContent = "Something";
}
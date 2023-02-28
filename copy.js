function findText(element)
{
  var output = [];

  if (element.textContent && element.textContent.length > 0)
  {
    output.push(element.innerText.trim());
  }

  if (element.children && element.children.length > 0)
  {
    for (var x = 0; x < element.children.length; x++)
    {
      findText(output, element.children[x]);
    }
  }

  return output.join(' ');
}

function getTableHeaders()
{
  var table = document.getElementsByTagName("table")[1];
  var headers = table.getElementsByTagName("th")

  header_position = {};

  for (h = 0; h < headers.length; h++)
  {
    text = findText(headers[h]);

    if (text.includes("Symbol"))
    {
      header_position['symbol'] = h + 1;
    }
    else if (text.includes("Name"))
    {
      header_position['name'] = h + 1;
    }
    else if (text.includes("Price"))
    {
      header_position['price'] = h + 1;
    }
    else if (text.includes("Current balance"))
    {
      header_position['balance'] = h + 1;
    }
    else if (text.includes("Quantity"))
    {
      header_position['quantity'] = h + 1;
    }
  }
  
  return header_position
}

headers = getTableHeaders();

var rows = document.getElementsByTagName("tr");
var fullOutput = '';

for (var x = 0; x < rows.length; x++)
{
  if (rows[x].cells.length == 10)
  {
    fullOutput += findText(rows[x].cells[headers['symbol']]) + '\t';
    fullOutput += findText(rows[x].cells[headers['name']]) + '\t';
    fullOutput += findText(rows[x].cells[headers['quantity']]) + '\t';
    fullOutput += findText(rows[x].cells[headers['price']]) + '\t';
    fullOutput += findText(rows[x].cells[headers['balance']]) + '\t';
    fullOutput += '\n';
  }
}

var textArea = document.createElement("textArea");
textArea.textContent = fullOutput;
document.body.appendChild(textArea);

textArea.select();
document.execCommand('copy');
textArea.blur();

document.body.removeChild(textArea);

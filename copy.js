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
      header_position['symbol'] = h;
    }
    else if (text.includes("Name"))
    {
      header_position['name'] = h;
    }
    else if (text.includes("Price"))
    {
      header_position['price'] = h;
    }
    else if (text.includes("Current balance"))
    {
      header_position['balance'] = h;
    }
    else if (text.includes("Quantity"))
    {
      header_position['quantity'] = h;
    }
  }

  return header_position
}

(() => {
  var btn = document.querySelector('[data-testid="expand-accounts"]');
  if (btn) btn.click();

  function headersReady() {
    try {
      var h = getTableHeaders();
      return h && h.symbol != null && h.quantity != null && h.price != null && h.balance != null;
    } catch (e) {
      return false;
    }
  }

  function runOriginal() {
    headers = getTableHeaders();
	  
    var rows = document.getElementsByTagName("tr");
    var fullOutput = '';

    for (var x = 0; x < rows.length; x++)
    {
      if (rows[x].cells.length == 10 && rows[x].getElementsByTagName('th').length != 9)
      {
        fullOutput += findText(rows[x].cells[headers['symbol']]).replace(/\n/, '\t') + '\t';
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
  }

  // If ready now, run immediately
  if (headersReady()) {
    runOriginal();
    return;
  }

  // Otherwise, observe until headers are ready
  var observer = new MutationObserver(function() {
    if (headersReady()) {
	    console.log('headers found');
      observer.disconnect();
      runOriginal();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });
})();


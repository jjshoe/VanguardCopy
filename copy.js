function findText(element)
{
  var output = [];

  if (element.textContent && element.textContent.length > 0)
  {
    output.push(element.textContent.trim());
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

var rows = document.getElementsByTagName("tr");

var fullOutput = '<textarea id="vanguard_copy" style="width: 0px;">';

for (var x = 0; x < rows.length; x++)
{
  if (rows[x].cells.length == 9 || rows[x].cells.length == 10)
  {
    var output = [];

    for (var y = 0; y < rows[x].cells.length; y++)
    {

      if (rows[x].cells[y].nodeName == 'TD')
      {
        output.push(findText(rows[x].cells[y]));
      }
    }

    if (output.length > 0) 
    {
      if (output[3].match(/-/))
      {
        fullOutput += output[0] + ',' + output[1] + ',' + output[4] + ',' + output[5] + ',' + output[8] + '\n';
      }
      else
      {
        fullOutput += output[0] + ',' + output[1] + ',' + output[3] + ',' + output[4] + ',' + output[7] + '\n';
      }
    }
  }
}

document.body.innerHTML += fullOutput + '</textarea>';

var textArea = document.getElementById('vanguard_copy');
textArea.select();
var result = document.execCommand('copy');

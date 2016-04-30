

function toConsole(message, status) {

  var element = document.createElement('li');
  element.innerHTML = message;

  switch(status) {
    case 'error':
      element.className = "errorLog";
      break;
    case 'warning':
      element.className = "warningLog";
      break;

      case 1:
        element.className = "errorLog";
        break;
      case 2:
        element.className = "warningLog";
        break;
  }

  $('#console').prepend(element);
}

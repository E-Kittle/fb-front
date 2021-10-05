// React escapes all characters which are then sent to the API for storage
// On return, these characters are still escaped so this returns them
// to their initial state

const htmlDecode = (input)  => {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }

export default htmlDecode
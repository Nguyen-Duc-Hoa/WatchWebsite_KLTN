export const convertToByteArray = (base64) => {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = [];
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
};

/*global chrome*/

export function wolai_fetch(
  url,
  method,
  data,
  success,
  token,
  fail = undefined,
  done = undefined
) {
  var myHeaders = {
    "Content-Type": "application/json; charset=utf-8",
  };
  if (token) {
    myHeaders["Authorization"] = token;
  }
  var requestOptions = {
    method: method || "POST",
    headers: myHeaders,
  };
  if (data) {
    requestOptions.body = JSON.stringify(data);
  }

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      success && success(result);
      done && done();
    })
    .catch((error) => {
      fail && fail(error);
      done && done();
      handleErrors(error);
    });
}

function handleErrors(error) {
  console.error(error);
}
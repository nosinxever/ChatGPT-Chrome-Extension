function sendChatGPTRequest(inputValue) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.openai.com/v1/chat/completions", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader(
      "Authorization",
      "Bearer xxx" //add your api key
    );
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(xhr.statusText);
        }
      }
    };
    xhr.onerror = function () {
      reject(xhr.statusText);
    };
    const data = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: inputValue }],
      temperature: 0,
      max_tokens: 2000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    xhr.send(data);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const inputText = document.getElementById("inputText");
  const outputText = document.getElementById("outputText");

  var history = [""];

  function sendMessage() {
    const inputValue = inputText.value;
    var prompt = history.join(" ") + " " + inputValue;

    sendChatGPTRequest(prompt + inputValue)
      .then((response) => {
        const result = JSON.parse(response);
        outputText.innerHTML =
          '<p class="You">' +
          inputValue +
          "</p>" +
          '<textarea  class="ChatGPT">' +
          result.choices[0].message.content +
          "</textarea>" +
          outputText.innerHTML;

        history.push("You: " + inputValue) + "\n";
        history.push("ChatGPT: " + result.choices[0].message.content + "\n");
      })
      .catch((error) => {
        outputText.innerHTML = "Error occurred: " + error;
      });
    inputText.value = "";
  }

  //   submitButton.addEventListener("click", sendMessage);
  inputText.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
});

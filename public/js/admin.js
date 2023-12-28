let isAuthenticated = false; // Флаг для отслеживания состояния аутентификации

// Функция для аутентификации
async function authenticate() {
  const login = prompt("Enter login:");
  const password = prompt("Enter password:");

  try {
    const response = await fetch("/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password }),
    });

    const result = await response.json();

    if (result.success) {
      isAuthenticated = true;
      console.log(isAuthenticated);
      fetchData(); // Загружаем данные после успешной аутентификации
    } else {
      alert("Authentication failed. Please try again.");
      console.log("ok");
    }
  } catch (error) {
    console.error("Authentication error:", error);
    alert("Authentication error. Please try again.");
  }
}

// Функция для сохранения данных
async function saveData() {
  // Проверяем состояние аутентификации перед сохранением данных
  if (isAuthenticated) {
    alert("Please authenticate first.");
  }

  var title = document.getElementById("title").value;
  var number = document.getElementById("number").value;
  var difficulty = document.getElementById("difficulty").value;
  var answer = document.getElementById("answer").value;
  var language = document.getElementById("language").value;

  var data = {
    title: title,
    number: number,
    difficulty: difficulty,
    answer: answer,
    language: language,
  };

  try {
    const response = await fetch("/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data, null, 1),
    });

    const result = await response.json();
    console.log(result);

    document.getElementById("title").value = "";
    document.getElementById("number").value = "";
    document.getElementById("difficulty").value = "";
    document.getElementById("answer").value = "";
    document.getElementById("language").value = "";

    fetchData();
  } catch (error) {
    console.error("Error:", error);
  }
}
let postData = document.querySelector("#postData");

postData.addEventListener("click", () => {
  saveData();
});

// Остальной код без изменений

async function deleteQuestion(postId) {
  try {
    const response = await fetch(`/delete/${postId}`, {
      method: "DELETE",
    });

    const result = await response.json();
    console.log(result);

    fetchData();
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchData() {
  try {
    const response = await fetch("/questions");
    const data = await response.json();

    console.log("Received data:", data);

    var dataList = document.getElementById("dataList");
    dataList.innerHTML = "";

    if (Array.isArray(data) && data.length > 0) {
      data.forEach((item) => {
        var listItem = document.createElement("li");
        listItem.classList.add("question-item");
        listItem.innerHTML = `
                    <strong>${item.title}</strong><br>
                    Number: ${item.number}<br>
                    Difficulty: ${item.difficulty}<br>
                    Answer: ${item.answer}<br>
                    Language: ${item.language}
                    <button onclick="deleteQuestion(${item.postId})">Delete</button>
                `;
        dataList.appendChild(listItem);
      });
    } else {
      console.error("Error: No data or unexpected data format");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

window.onload = function () {
  authenticate(); // Вызываем аутентификацию при загрузке страницы
};

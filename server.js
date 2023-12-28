const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(express.static("public"));

const publicPath = path.join(__dirname, "public");
const credentialsPath = path.join(__dirname, "credentials.json");

// Middleware для проверки аутентификации

const authenticate = async (req, res, next) => {
  try {
    const credentials = req.body;

    const savedCredentials = JSON.parse(
      await fs.readFile(credentialsPath, "utf-8")
    );

    if (
      credentials.login === savedCredentials.login &&
      credentials.password === savedCredentials.password
    ) {
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ success: false, error: "Authentication error" });
  }
};

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/questions", async (req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "questions.json"),
      "utf-8"
    );
    const dataArray = JSON.parse(data);
    res.json(Array.isArray(dataArray) ? dataArray : []);
  } catch (error) {
    console.error("Error reading questions.json:", error.message);
    res
      .status(500)
      .json({ success: false, error: "Error reading questions.json" });
  }
});
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
app.post("/save", async (req, res) => {
  const questionData = req.body;
  const newQuestionId = generateUniqueId(); // You need to implement a function to generate a unique id

  // Assign the id to the question data
  questionData.id = newQuestionId;

  // Add the new question to the existing data

  try {
    const currentData = JSON.parse(
      await fs.readFile(path.join(__dirname, "questions.json"), "utf-8")
    );
    currentData.push(questionData);
    await fs.writeFile(
      path.join(__dirname, "questions.json"),
      JSON.stringify(currentData, null, 2)
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Добавим обработчик DELETE запроса для удаления вопроса
app.delete("/delete/:id", async (req, res) => {
  const questionPostId = req.params.id;

  try {
    const currentData = JSON.parse(
      await fs.readFile(path.join(__dirname, "questions.json"), "utf-8")
    );
    console.log("Current data:", currentData);

    const updatedData = currentData.filter(
      (item) => item.id === questionPostId
    );
    console.log("Updated data:", updatedData);

    await fs.writeFile(
      path.join(__dirname, "questions.json"),
      JSON.stringify(updatedData, null, 2)
    );
    console.log("Question deleted successfully");
    res.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/authenticate", async (req, res) => {
  const credentials = req.body;

  try {
    const savedCredentials = JSON.parse(
      await fs.readFile(credentialsPath, "utf-8")
    );

    if (
      credentials &&
      credentials.login === savedCredentials.login &&
      credentials.password === savedCredentials.password
    ) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, error: "Authentication failed" });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ success: false, error: "Authentication error" });
  }
});
app.use("/save", authenticate);
app.use("/delete", authenticate);
// Применяем middleware только к маршрутам для сохранения и удаления

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

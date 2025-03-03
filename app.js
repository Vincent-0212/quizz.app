let score = 0;
let currentQuestionIndex = 0;
let selectedQuestions = [];
let selectedCategories = JSON.parse(localStorage.getItem("selectedCategories")) || [];
let selectedDifficulty = localStorage.getItem("selectedDifficulty") || "FACILE";

// Dictionnaire pour traduire les catégories
const categoryNames = {
    "SCIE": "Science & Nature",
    "HIST": "Histoire",
    "GEOG": "Géographie",
    "ARTL": "Art et Littérature",
    "CULT": "Culture Générale",
    "MYTH": "Mythologie"
};

function fetchQuestions() {
    if (selectedCategories.length === 0) {
        alert("Veuillez sélectionner au moins une catégorie.");
        window.location.href = "settings.html";
        return;
    }

    fetch("http://localhost:3000/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: selectedCategories, difficulty: selectedDifficulty })
    })
    .then(response => response.json())
    .then(data => {
        if (data.length < 20) {
            alert(`Erreur : Pas assez de questions disponibles en ${selectedDifficulty} !`);
            console.error("Questions disponibles :", data);
            window.location.href = "settings.html";
            return;
        }

        selectedQuestions = getUniqueRandomQuestions(data, 20);
        localStorage.setItem("selectedQuestions", JSON.stringify(selectedQuestions));
        loadQuestion();
    })
}

function getUniqueRandomQuestions(questions, count) {
    let shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function loadQuestion() {
    if (currentQuestionIndex >= selectedQuestions.length) {
        localStorage.setItem("finalScore", score);
        window.location.href = "score.html";
        return;
    }

    let question = selectedQuestions[currentQuestionIndex];
    let categoryFullName = categoryNames[question.CATEGORIE] || "Catégorie inconnue";

    document.getElementById("question").innerText = question.QUESTION;
    document.getElementById("reponse").innerText = "Réponse : " + question.REPONSE;
    document.getElementById("theme").innerText = categoryFullName;
    document.getElementById("question-number").innerText = currentQuestionIndex + 1;
    document.getElementById("score").innerText = score;
    document.getElementById("difficulty").innerText = selectedDifficulty;
}

function validateAnswer(correct) {
    if (correct) score++;
    currentQuestionIndex++;
    loadQuestion();
}

document.addEventListener("DOMContentLoaded", fetchQuestions);

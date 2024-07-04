let question = document.querySelector(".que");
let option_box = document.querySelector(".option");
let Allopt = document.querySelectorAll(".opt");
let topics = document.querySelectorAll(".topic-menu");
let QuizeArea = document.querySelector(".quize");
let topicArea = document.querySelector(".topic-menu");
let result = document.querySelector(".result");
let note = document.querySelector(".note");
let modeP = document.querySelector(".mode");
let sun = document.querySelector(".sun");
let moon = document.querySelector(".moon");
let reviewAnsSec = document.querySelector(".reviewAns");
let answers = document.querySelector(".answers");
QuizeArea.classList.add("hide");

let apiData; //Question Array feched from API
let Score = 0; //Score Count variable
let QNo = 0; //Total No. of Quesion count variable
let answer; //variable for storing answer
const TotalQue = 10; // total no. of questions
let mode = 1; //variable for theme
let gameStatus;
//Function For Display  Questions
function show_question(que) {
  document.querySelector(".Qno").textContent = QNo + 1;
  question.innerHTML = `${que}`;
}

// Function For Display options
function show_Option(option) {
  let i = 0;
  for (const index of Allopt) {
    index.innerHTML = `${option[i++]}`;
  }
}

//Function For Varify Answer
function checkOption(event) {
  if (event.target.textContent == answer) {
    Score++; //score increase when answer is correct
  }
  QNo++; // increment Question Variable
  start(); // for change Question After Each Selection
}

// Function For shuffle options Randomly
function randomN(arr) {
  let ans = [];
  let o = [];
  let i = 0;
  while (i < arr.length) {
    let b = Math.floor(Math.random() * arr.length);
    if (!o.includes(b)) {
      ans.push(arr[b]);
      o.push(b);
      i++;
    }
  }
  return ans;
}

//Function For Show Result
function ShowResult() {
  result.querySelector(".score").textContent = `${Score} /`;
  QuizeArea.classList.add("hide");
  result.classList.remove("hide");
  console.log("game over with Score", Score);
}

//function for go to new game
function reload() {
  QNo = 0;
  Score = 0;
  result.classList.add("hide");
  topicArea.classList.remove("hide");
}

function ShowAnswers() {
  let i = 1;
  for (const index of apiData) {
    answers.innerHTML += `
      <div class"ans">
      <div class="Q">Q.${i++}: ${index.question}</div>
      <div class="A">Ans: ${index.correct_answer}</div>
      </div>
      `;
    console.log(`Q.${i}: ${index.question}`);
    console.log(`Ans: ${index.correct_answer}`);
  }
}
function closeAns() {
  reviewAnsSec.classList.add("hide");
  answers.innerHTML = "";
}
function review() {
  reviewAnsSec.classList.remove("hide");
  ShowAnswers();
}
//function for next Question
function start() {
  // console.log(`SCORE = ${Score}  & QUESTION NO = ${QNo + 1}`);

  if (QNo == TotalQue) {
    gameStatus = false;
    ShowResult();
    return;
  }

  let newQue = apiData[QNo];
  let question = newQue.question;
  answer = newQue.correct_answer;
  let options = newQue.incorrect_answers.concat(answer);
  let randomOptions = randomN(options);
  show_Option(randomOptions);
  show_question(question);

  // console.log("ques = ", question);
  // console.log(`Option = ${options} & ANSWER = ${answer}`);
}

//Function for Fetch DATA  FROM API
function fetchURL(category) {
  let url = `https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        fetchURL();
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      apiData = data.results;
      console.log(apiData);
      start();
    })
    .catch((error) => console.error("Error In fetching :", error));
}

//Button on Note Section
function hideNote() {
  note.classList.add("hide");
  result.classList.add("hide");
  document.querySelector("main").classList.add("hide");
  document.querySelector(".loader").classList.remove("hide");
  setTimeout(function () {
    document.querySelector(".loader").classList.add("hide");
    document.querySelector("main").classList.remove("hide");
    QuizeArea.classList.remove("hide");
  }, 1200);
}

//Add Event listener to Options
for (const index of Allopt) {
  index.addEventListener("click", checkOption);
}

//Event on Topic Card
topics.forEach((val) => {
  val.addEventListener("click", (e) => {
    gameStatus = true;
    let category = e.target.id;
    fetchURL(category);
    console.log(category);
    note.classList.remove("hide");
    topicArea.classList.add("hide");
  
  });
});

//for Chane mode
function changMode() {
  let root = document.documentElement;
  if (mode == 1) {
    root.style.setProperty("--bgColor", "#171717");
    root.style.setProperty("--topicCard", "#DA0037");
    root.style.setProperty("--topicCardHover", "#5536f0");
    root.style.setProperty("--optionCard", "#604CC3");
    root.style.setProperty("--optionCardHover", "#2a10ad");
    root.style.setProperty("--resultCard", "#444444");
    root.style.setProperty("--reloadBTN", "#5536f0");
    root.style.setProperty("--reloadBTNHover", "#ff0040");
    root.style.setProperty("--noteClr", "#444444");
    root.style.setProperty("--Qno", "#DA0037");
    root.style.setProperty("--bodyCLR", "white");
    mode = 0;
  } else {
    root.style.setProperty("--bgColor", "#80C4E9");
    root.style.setProperty("--topicCard", "#FF7F3E");
    root.style.setProperty("--topicCardHover", "rgb(230, 102, 38)");
    root.style.setProperty("--optionCard", "#FFF6E9");
    root.style.setProperty("--optionCardHover", "#d6d4d1");
    root.style.setProperty("--resultCard", "#fff");
    root.style.setProperty("--reloadBTN", "#604CC3");
    root.style.setProperty("--reloadBTNHover", "#4228c4");
    root.style.setProperty("--noteClr", "#FFF6E9");
    root.style.setProperty("--Qno", "#4228c4");
    root.style.setProperty("--bodyCLR", "#000000");
    mode = 1;
  }
  sun.classList.toggle("hide");
  moon.classList.toggle("hide");
}

modeP.addEventListener("click", changMode);

window.addEventListener("resize", function (e) {
  if (gameStatus) {
    location.reload();
  }
});

document.addEventListener("visibilitychange", (event) => {
  if (document.visibilityState != "visible" && gameStatus) {
    location.reload();
  }
});

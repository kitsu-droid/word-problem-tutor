// Menu Drawer
const sideMenu = document.getElementById("side-menu");
const menuOverlay = document.getElementById("menu-overlay");
const menuToggle = document.getElementById("menu-toggle");

menuToggle.addEventListener("click", () => {
  sideMenu.classList.toggle("open");
  if(window.innerWidth < 768) menuOverlay.classList.toggle("active");
});

menuOverlay.addEventListener("click", () => {
  sideMenu.classList.remove("open");
  menuOverlay.classList.remove("active");
});

// Mode Switch
function switchMode(modeId){
  document.querySelectorAll(".mode").forEach(m => m.classList.remove("active"));
  document.getElementById(modeId).classList.add("active");
  sideMenu.classList.remove("open");
  menuOverlay.classList.remove("active");
}

// Word → Equation
const parseBtn = document.getElementById("parse-btn");
const problemText = document.getElementById("problem-text");
const progressBar = document.getElementById("progress-bar");
const wordProblem = document.getElementById("word-problem");
const answerContainer = document.getElementById("answer-container");
const userAnswerInput = document.getElementById("user-answer");
const submitAnswer = document.getElementById("submit-answer");
const feedback = document.getElementById("feedback");

let steps=[], correctAnswer=null;

function generateEquation(text){
  text=text.toLowerCase().trim();
  const words={zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20};
  Object.keys(words).forEach(w=>text=text.replace(new RegExp("\\b"+w+"\\b","gi"),words[w]));
  text=text.replace(/\btwice (a )?number\b/g,"2x");
  text=text.replace(/\bthrice (a )?number\b|\btriple (a )?number\b/g,"3x");
  text=text.replace(/\bhalf (a )?number\b/g,"x/2");
  text=text.replace(/\b(a number|the number)\b/g,"x");
  text=text.replace(/\bdivided by\b/g,"/").replace(/\btimes\b/g,"*").replace(/\bplus\b/g,"+").replace(/\bminus\b/g,"-").replace(/\bis\b|\bequals\b/g,"=");
  text=text.replace(/\s([+-/=])\s/g," $1 ");
  const sides=text.split("=");
  if(sides.length!==2) return null;
  let lhs=sides[0].trim(), rhs=sides[1].trim();
  if(!lhs.includes("x") && rhs.includes("x")) [lhs,rhs]=[rhs,lhs];
  return `${lhs} = ${rhs}`;
}

function generateSteps(eq){
  let [lhs,rhs]=eq.split("="); lhs=lhs.trim(); rhs=rhs.trim();
  let arr=[]; arr.push(`Start with the equation: ${lhs} = ${rhs}`);
  let constMatches=lhs.match(/([+-]?\d+(?!x))/g)||[];
  constMatches.forEach(c=>{
    let v=parseFloat(c); let op=v>=0?"Subtract":"Add";
    arr.push(`${op} ${Math.abs(v)} from both sides.`);
  });
  let coefMatch=lhs.match(/([+-]?\d*.?\d*)x/); let coef=coefMatch&&coefMatch[1]!=""?parseFloat(coefMatch[1]):1;
  if(coef!==1) arr.push(`Divide both sides by ${coef} to isolate x.`);
  else arr.push("x is already isolated.");
  arr.push("Now solve for x and enter your answer.");
  return arr;
}

function solveEquation(eq){
  let [lhs,rhs]=eq.split("="); lhs=lhs.trim(); rhs=rhs.trim();
  let coefMatch=lhs.match(/([+-]?\d*.?\d*)x/); let coef=coefMatch&&coefMatch[1]!=""?parseFloat(coefMatch[1]):1;
  let lhsConst=(lhs.match(/([+-]?\d+(?!x))/g)||[]).reduce((a,c)=>a+parseFloat(c),0);
  return (parseFloat(rhs)-lhsConst)/coef;
}

function showStepsAutomatically(){
  let currentStep=0; problemText.innerHTML=""; progressBar.style.width="0%";
  function showStep(i){
    if(i>=steps.length){ progressBar.style.width="100%"; answerContainer.classList.add("show"); return;}
    let stepP=document.createElement("p"); stepP.className="step"; problemText.appendChild(stepP);
    let charIndex=0;
    function typeChar(){ 
      if(charIndex<steps[i].length){ stepP.textContent+=steps[i][charIndex]; charIndex++; setTimeout(typeChar,25);}
      else{ progressBar.style.width=((i+1)/steps.length)*100+"%"; setTimeout(()=>showStep(i+1),600); } 
    }
    typeChar();
  }
  showStep(0);
}

parseBtn.addEventListener("click",()=>{
  const eq=generateEquation(wordProblem.value.trim());
  if(!eq){problemText.textContent="Try: 'Twice a number plus 5 equals 15'"; return;}
  steps=generateSteps(eq);
  correctAnswer=solveEquation(eq);
  answerContainer.classList.remove("show"); userAnswerInput.value=""; feedback.textContent="";
  showStepsAutomatically();
});

submitAnswer.addEventListener("click",()=>{
  const userVal=parseFloat(userAnswerInput.value);
  if(Math.abs(userVal-correctAnswer)<1e-6){ feedback.textContent="✅ Correct! Well done."; feedback.style.color="green";}
  else { feedback.textContent="❌ Incorrect. Try again."; feedback.style.color="red"; }
});

// Equation → Word
const convertBtn=document.getElementById("convert-btn");
const eqInput=document.getElementById("equation-input");
const wordOutput=document.getElementById("word-output");

convertBtn.addEventListener("click",()=>{
  let eq=eqInput.value.trim();
  if(!eq.includes("x")||!eq.includes("=")){ wordOutput.textContent="Enter valid equation like 2x + 5 = 15."; return;}
  let [lhs,rhs]=eq.split("="); lhs=lhs.trim(); rhs=rhs.trim();
  let coef=(lhs.match(/([+-]?\d*)x/)[1]||1);
  let constVal=lhs.replace(/x/,"").trim();
  let wp=`The number multiplied by ${coef}`;
  if(constVal) wp+=` and then ${constVal>0?"add":"subtract"} ${Math.abs(constVal)}`;
  wp+=` equals ${rhs}.`;
  wordOutput.textContent=wp;
});                                             

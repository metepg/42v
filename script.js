const questions = [
    { q: "Mikä on Kornin vuonna 1994 julkaistun debyyttialbumin nimi?", a: ["Life Is Peachy", "Follow the Leader", "Korn", "Issues"], correct: 2 },
    { q: "Mikä tunnettu suomalainen näyttelijä on syntynyt Helsingin Suutarilassa?", a: ["Jasper Pääkkönen", "Peter Franzén", "Antti Luusuaniemi", "Eero Aho"], correct: 0 },
    { q: "Kuka toimi Cannibal Corpsen laulajana albumilla 'Eaten Back to Life'?", a: ["George 'Corpsegrinder' Fisher", "Chris Barnes", "Alex Webster", "Paul Mazurkiewicz"], correct: 1 },
    { q: "Mikä on suurin planeetta aurinkokunnassamme?", a: ["Mars", "Maa", "Jupiter", "Saturnus"], correct: 2 },
    { q: "Mikä seuraavista laskimotukoksen oireista on tyypillinen 'Homanin oire', jota terveydenhuollossa arvioidaan?", a: ["Pohjekipu dorsaalifleksiossa", "Punoittava ihottuma sääressä", "Jalan kylmyys", "Kova kutina nilkassa"], correct: 0 },
    { q: "Mikä on miesten ja naisten virallisen pelipallon suurin kokoero?", a: ["Miehet pelaavat koko 7 pallolla, naiset koko 6 pallolla", "Molemmat pelaavat koko 7 pallolla", "Molemmat pelaavat koko 6 pallolla", "Naiset pelaavat koko 5 pallolla"], correct: 0 },
    { q: "Mikä seuraavista on tunnettu maamerkki Helsingin Torpparinmäessä?", a: ["Torpparinmäen koulu", "Torpparinmäen vanha mylly", "Torpparinmäen kirkko", "Torpparinmäen uimahalli"], correct: 0 },
    { q: "Mikä on Suomessa terveydenhoitajan lakisääteinen tehtävä äitiysneuvolassa?", a: ["Kirurgiset toimenpiteet", "Raskauden seuranta ja hyvinvoinnin tukeminen", "Reseptien kirjoittaminen itsenäisesti", "Potilaan leikkaushoito"], correct: 1 },
    { q: "Miksi Mete alkoi kuuntelemaan Slipknottia?", a: ["Hän kuuli toisesta huoneesta Eyelessin riffin ja joutui kuuntelemaan koko levyn läpi löytääkseen sen", "Sisko pakotti", "Hän näki bändin musiikkivideon (Wait and Bleed) televisiossa"], correct: 0 },
    { q: "Mikä on maailman pisin joki?", a: ["Niili", "Amazon", "Jangtse", "Mississippi"], correct: 0 },
    { q: "Kenen NES-kokoelmaan klassikkopeli 'Little Samson' kuului?", a: ["Mete", "Mellu", "Rate", "Ellu"], correct: 1}
];

// Ladataan highScoret localStoragesta tai käytetään oletusarvoja
let highScores = JSON.parse(localStorage.getItem('quizHighScores')) || [
    { name: "Teemu T.", score: 100 },
    { name: "Fred Durst", score: 90 },
    { name: "Mete G.", score: 86 },
    { name: "Jonathan Davis", score: 70 },
    { name: "Serj Tankian", score: 60 },
    { name: "Corey Taylor", score: 50 },
    { name: "Jill Valentine", score: 40 },
    { name: "Jimmy Pop", score: 30 },
    { name: "Psy", score: 20 },
    { name: "George Fisher", score: 10 }
];

let currentQIndex = 0;
let score = 0;

const qDisplay = document.getElementById('question-display');
const optDisplay = document.getElementById('options-display');
const btn = document.getElementById('submit-btn');
const feedback = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score');

// Prize Dialog elements
const prizeDialog = document.getElementById('prize-dialog');
const prizeDialogClose = document.querySelector('.prize-dialog-close');
const prizeDialogText = document.querySelector('.prize-dialog-text'); // No need, text is static for now
const prizeDialogContact = document.querySelector('.prize-dialog-contact'); // No need, text is static for now

// Screen switching
const startBtn = document.getElementById('start-btn');
const introScreen = document.getElementById('intro-screen');
const gameScreen = document.getElementById('game-screen');

startBtn.addEventListener('click', () => {
    introScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    loadQuestion();
});

function updateScoreDisplay() {
    const totalQuestions = questions.length;
    const maxScore = totalQuestions * 10;
    
    // Calculate current maximum possible score based on which questions we've passed
    // But since the user asked for simple "current/total", let's use:
    // Pisteet: 10/100 (if answering 1st question, max is 100)
    // For bonus, it seems like total becomes 110 or 120 depending on how many bonus questions there are.
    // The current total is always 10 * totalQuestions.
    
    scoreDisplay.innerText = `Pisteet: ${score}/${maxScore}`;
}

function loadQuestion() {
    if (currentQIndex >= questions.length) {
        endGame();
        return;
    }
    
    updateScoreDisplay();
    
    const q = questions[currentQIndex];
    const isBonus = currentQIndex >= 10;
    
    // Reset classes
    qDisplay.className = "";
    if (isBonus) {
        qDisplay.classList.add('bonus-question');
        qDisplay.innerHTML = `<h2 class="bonus-title">BONUSKYSYMYS!</h2>${q.q}`;
    } else {
        qDisplay.innerText = q.q;
    }

    optDisplay.innerHTML = "";
    q.a.forEach((opt, index) => {
        const label = document.createElement('label');
        label.className = 'option-label';
        label.innerHTML = `<input type="radio" name="option" value="${index}"> ${opt}`;
        optDisplay.appendChild(label);
    });
    feedback.innerText = "";
    btn.disabled = false;
    btn.innerText = "VASTAA";
}


function endGame() {
    const userName = prompt("Peli loppu! Anna nimesi:");
    const finalName = userName || "Pelaaja";
    highScores.push({ name: finalName, score: score });
    highScores.sort((a, b) => b.score - a.score);

    // Pidä vain top 10
    highScores = highScores.slice(0, 10);

    // Tallennetaan localStorageen
    localStorage.setItem('quizHighScores', JSON.stringify(highScores));

    qDisplay.innerHTML = "<h2>TOP-10</h2>";
    optDisplay.innerHTML = `
        <table>
            <thead><tr><th>Sija</th><th>Nimi</th><th>Pisteet</th></tr></thead>
            <tbody>
                ${highScores.map((entry, index) => {
                    const isUser = entry.name === finalName && entry.score === score;
                    const style = isUser ? 'style="color: red; font-weight: bold;"' : '';
                    return `
                    <tr>
                        <td>${index + 1}.</td>
                        <td ${style}>${entry.name}</td>
                        <td ${style}>${entry.score}</td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>
    `;

    // Bonus reward logic
    if (score === (questions.length * 10)) {
        startFireworks();
        const prizeBtn = document.createElement('button');
        prizeBtn.innerText = "LUNASTA PALKINTO";
        prizeBtn.classList.add('prize-button-animate');
        prizeBtn.style.marginTop = "20px";
        prizeBtn.style.backgroundColor = "#ffd700";
        prizeBtn.style.color = "#000";
        prizeBtn.onclick = () => {
            prizeDialog.style.display = 'flex';
        };
        optDisplay.appendChild(prizeBtn);
    }

    // Close prize dialog
    prizeDialogClose.onclick = () => {
        prizeDialog.style.display = 'none';
    };
    window.onclick = (event) => {
        if (event.target == prizeDialog) {
            prizeDialog.style.display = 'none';
        }
    };

    btn.style.display = "none";
    feedback.innerText = "";
    scoreDisplay.innerText = "Loppupisteesi: " + score;
}

function startFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    canvas.style.display = 'block';
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // Yksinkertainen ilotulitus-animaatio
    let particles = [];
    function createFirework(x, y) {
        for (let i = 0; i < 30; i++) {
            particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                alpha: 1,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = particles.filter(p => p.alpha > 0);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.02;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fillRect(p.x, p.y, 3, 3);
        });
        if (Math.random() < 0.1) createFirework(Math.random() * canvas.width, Math.random() * canvas.height);
        requestAnimationFrame(animate);
    }
    animate();
}

btn.addEventListener('click', () => {
    // Check if we are ready for next question or submitting
    if (btn.innerText === "SEURAAVA") {
        currentQIndex++;
        // Re-check bonus condition
        if (currentQIndex === 10 && score < 100) {
            alert("Et saanut kaikkia 10 ensimmäistä kysymystä oikein, peli päättyy tähän.");
            endGame();
            return;
        }
        loadQuestion();
        return;
    }

    const selected = document.querySelector('input[name="option"]:checked');
    if (!selected) {
        alert("Valitse vastaus!");
        return;
    }
    
    btn.disabled = true;

    // Feedback
    const correctAnswerIndex = questions[currentQIndex].correct;
    const allOptions = document.querySelectorAll('input[name="option"]');
    const allLabels = document.querySelectorAll('.option-label');

    allOptions.forEach((option, index) => {
        option.disabled = true;
        const label = allLabels[index];
        if (index === correctAnswerIndex) {
            label.classList.add('correct');
        } else {
            label.classList.add('incorrect');
        }
    });

    if (parseInt(selected.value) === questions[currentQIndex].correct) {
        score += 10;
        feedback.innerText = "Oikein!";
        feedback.style.color = "green";
    } else {
        feedback.innerText = "Väärin!";
        feedback.style.color = "red";
    }
    updateScoreDisplay();
    btn.innerText = "SEURAAVA";
    btn.disabled = false;
});

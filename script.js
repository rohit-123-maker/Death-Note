  window.onload = () => {
    const savedUser = localStorage.getItem("loggedInUser");
    const hasSetPass = localStorage.getItem(PASS_KEY);

    if (savedUser) {
        onLoginSuccess(savedUser);
    } else if (!hasSetPass) {
        showView('setup'); 
    } else {
        showView('login');
    }
};


    /* 🔧 CONFIG & STORAGE KEYS */
    const STORAGE_KEY = 'deathNote_entries';
    const PASS_KEY = 'deathNote_pass';
    const MASTER_PASS = 'Kira@123';
    const SECURITY_KEY = 'deathNote_security';
    const THEME_KEY = "theme";
    
    /* LOAD THEME */
    if (localStorage.getItem(THEME_KEY) === "dark") {
        document.body.classList.add("dark");
        document.getElementById("theme-btn").innerText = "☠️";
    }
    
    function toggleTheme() {
        const isDark = document.body.classList.toggle("dark");
        document.getElementById("theme-btn").innerText = isDark ? "☠️" : "☠ ";
        localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    }
    
    /* 🔄 INITIAL CHECK & VIEW CONTROLLER */
    window.onload = () => {
        const savedUser = localStorage.getItem("loggedInUser");
        if (savedUser) {
            onLoginSuccess(savedUser);
        } else if (!localStorage.getItem(PASS_KEY)) {
            showView('setup'); // पहली बार आने पर सेटअप दिखाएं
        }
    };
    
    function showView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        const target = document.getElementById('view-' + viewId);
        if (target) target.classList.add('active');
        if (document.getElementById("error")) document.getElementById("error").innerText = "";
    }
    
    /* 🆕 FIRST TIME SETUP LOGIC */
    function handleSetup() {
        const newPass = document.getElementById("setup-pass").value;
        const question = document.getElementById("setup-q").value;
        const answer = document.getElementById("setup-a").value;
        
        if (newPass && question && answer) {
            localStorage.setItem(PASS_KEY, newPass);
            localStorage.setItem(SECURITY_KEY, JSON.stringify({ q: question, a: answer }));
            alert("Death Note is now yours. Don't forget your password!");
            showView('login');
        } else {
            alert("Fill everything to claim the Death Note! 🩸");
        }
    }
    
    /* 🔐 LOGIN LOGIC */
    function handleLogin() {
        const passInp = document.getElementById("password").value;
        const savedPass = localStorage.getItem(PASS_KEY);
        
        if (passInp === savedPass) {
            onLoginSuccess("Kira");
            burst();
        } else {
            document.getElementById("error").innerText = "Wrong Password! You are not Kira. 👹";
        }
    }
    
    /* 🔑 FORGOT PASSWORD LOGIC */
    function handleForgot() {
        const securityData = JSON.parse(localStorage.getItem(SECURITY_KEY));
        const userAnswer = prompt(securityData.q);
        
        if (userAnswer && userAnswer.toLowerCase() === securityData.a.toLowerCase()) {
            const newPass = prompt("Answer correct! Enter new password:");
            if (newPass) {
                localStorage.setItem(PASS_KEY, newPass);
                alert("Password changed successfully.");
            }
        } else {
            alert("Wrong answer. You are not the chosen one.");
        }
    }
    
    /* 🎯 SUCCESS CALLBACK & REMAINING FUNCTIONS */
    function onLoginSuccess(user) {
        localStorage.setItem("loggedInUser", user);
        document.getElementById("user-display").innerText = user;
        showView('dashboard');
    }
    
    function handleLogout() {
        localStorage.removeItem("loggedInUser");
        showView('welcome');
    }
    

    function showMessage(msg, type) {
        const status = document.getElementById('status');
        status.innerText = msg;
        status.className = type;
        setTimeout(() => {
            status.innerText = "";
            status.className = "";
        }, 4000);
    }

    function saveEntry() {
        const input = document.getElementById('diaryInput');
        const entry = input.value.trim();

        if (!entry) {
            showMessage("Write something with your blood first! 🩸", "error");
            return;
        }

        const date = new Date().toLocaleString([], { 
            year: 'numeric', month: 'short', day: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        });
        
        const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        savedData.push({ date, content: entry });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));

        input.value = "";
        showMessage("Your painful words are safely locked in the Death Note. ☠️📝", "success");
    }

    function showPasswordModal() {
        document.getElementById('passwordModal').style.display = 'flex';
        document.getElementById('passInput').focus();
    }

    function closeModal() {
        document.getElementById('passwordModal').style.display = 'none';
        document.getElementById('passInput').value = '';
    }

    function verifyPassword() {
        const pass = document.getElementById('passInput').value;
        if (pass === MASTER_PASS) {
            closeModal();
            renderEntries();
        } else {
            const modalContent = document.querySelector('.modal-content');
            modalContent.style.animation = 'none';
            void modalContent.offsetWidth; // trigger reflow
            modalContent.style.animation = 'slideUp 2.9s ease-out';
            showMessage("Wrong password! Do you want to die. 👹", "error");
            document.getElementById('passInput').value = '';
        }
    }

    function renderEntries() {
        const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const displayArea = document.getElementById('entriesDisplay');
        const listArea = document.getElementById('entriesList');

        if (savedData.length === 0) {
            showMessage("Till now no one's name has been written on the death note. Start killing! 😈", "error");
            return;
        }

        listArea.innerHTML = "";
        [...savedData].reverse().forEach(entry => {
            const card = document.createElement('div');
            card.className = 'entry-card';
            card.innerHTML = `
                <span class="entry-date">${entry.date}</span>
                <p style="margin: 0; line-height: 1.5;">${entry.content}</p>
            `;
            listArea.appendChild(card);
        });

        displayArea.style.display = "block";
        displayArea.scrollIntoView({ behavior: 'smooth' });
        showMessage("Welcome back, Kira! 🎭", "success");
    }

    function closeEntries() {
        document.getElementById('entriesDisplay').style.display = 'none';
    }

    // Allow "Enter" key for password
    document.getElementById('passInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifyPassword();
    });
    

    /* 🏚️ EXIT */
    function exitToHome() {
        const confirmExit = confirm("Do you have to go back to life? get out now?");
        if(confirmExit) {
            document.body.innerHTML = `<!DOCTYPE html>
                <html lang="en">
                <head>
                <meta http-equiv="refresh" content="3; url=https://vishwakarmarohit0266.github.io/" loading="lazy">
                 <style>
                .dots {
                 font-size: 30px;
                 text-align: center;
                 color: red;
                 }
                 .dots span {
                 animation-name: dotsAnim;
                 animation-duration: 1.5s;
                 animation-iteration-count: infinite;
                 animation-fill-mode: both;
                 display: inline-block;
                 }
                 .dots span:nth-child(1) {
                 animation-delay: 0s;
                 }
                 .dots span:nth-child(2) {
                 animation-delay: 0.3s;
                 }
                 .dots span:nth-child(3) {
                 animation-delay: 0.6s;
                 }
                 @keyframes dotsAnim {
                 0%, 20% { color: #ccc; }
                 50% { color: #3498db; }
                 100% { color: #ccc; }
                 }
                 </style>
                </head>
                <body>
                <div class="body-2">
                <div class="body-3">
                <div class="body-4">
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; color: white; font-family: 'Cursive ', cursive,'Segoe UI', sans-serif; text-align: center;">
                    <b><h1 style="font-size: 3rem; color: smokewhile;">Goodbye! ☠️</h1></b>
                    <p style="font-size: 2.2rem;">
                    <div class="dots">
                     Redirecting to life <span>.</span><span>.</span><span>.</span>
                 </div></p>
                    <div class="container"><button class="primary-btn" style="padding: 15px, 25px;" onclick="location.reload()">Go Back to Death Note ☠️</button></div>
                </div>
                </div>
                </div>
                </div>
                </body>
                </html>
            `;
        }
    }
    
    /* 🖤 EMOJIS FLOAT */
    const emojis = ["🖤","☠","🖤","😈","👿","👹","👺","💀","☠️","🎃","🩸","🥷🏻","🦴","🪓","🔪","🗡️","⚔️","🏴‍☠️"];
    setInterval(()=>{
        let e = document.createElement("div");
        e.className = "heart";
        e.innerText = emojis[Math.floor(Math.random()*emojis.length)];
        e.style.left = Math.random()*100 + "vw";
        e.style.fontSize = (15 + Math.random()*25) + "px";
        e.style.animationDuration = (5 + Math.random()*5) + "s";
        document.body.appendChild(e);
        setTimeout(() => e.remove(), 10000);
    }, 600);

    /* ☠️ SPARKLES */
    setInterval(()=>{
        let s = document.createElement("div");
        s.className = "sparkle";
        s.style.left = Math.random()*100 + "vw";
        s.style.top = Math.random()*100 + "vh";
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 2000);
    }, 400);

    /* MOUSE TRAIL */
    document.addEventListener("mousemove", e => {
        let t = document.createElement("div");
        t.className = "sparkle";
        t.style.left = e.clientX + "px";
        t.style.top = e.clientY + "px";
        t.style.background = "var(--primary)";
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 800);
    });

    /* SUCCESS BURST */
    function burst(){
        for(let i=0; i<30; i++){
            let b = document.createElement("div");
            b.className = "heart";
            b.innerText = "☠️";
            b.style.left = "50vw";
            b.style.bottom = "50vh";
            b.style.fontSize = "24px";
            // Random scatter
            const x = (Math.random() - 0.5) * 400;
            const y = (Math.random() - 0.5) * 400;
            b.style.transform = `translate(${x}px, ${y}px)`;
            b.style.animation = "sparkleAnim 1s ease-out forwards";
            document.body.appendChild(b);
            setTimeout(() => b.remove(), 1000);
        }
    }
    
     //   Pop-up Close Function 
        function closePopup(id) {
            document.getElementById(id).style.display = 'none';
        }

    function confirmLeave() {
    return confirm("☠️ Do you really want to die? ☠️");
}

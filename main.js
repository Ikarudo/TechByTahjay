// main.js — site bootstrapping, intro, and scroll/typing animations.

(function () {
    "use strict";

    const prefersReducedMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.addEventListener("DOMContentLoaded", function () {
        const overlay = document.getElementById("terminal-overlay");
        const main = document.getElementById("main-content");

        let revealed = false;
        function revealSite() {
            if (revealed) return;
            revealed = true;
            if (overlay) overlay.style.display = "none";
            if (main) {
                main.style.display = "block";
                requestAnimationFrame(function () { main.classList.add("show"); });
            }
            initSite();
        }

        // Skip the intro for repeat visits (per tab session) and reduced motion.
        const introSeen = (function () {
            try { return sessionStorage.getItem("tbt_intro") === "1"; }
            catch (e) { return false; }
        })();

        if (prefersReducedMotion || introSeen || !overlay || !main) {
            revealSite();
        } else {
            try { sessionStorage.setItem("tbt_intro", "1"); } catch (e) {}
            runIntro(overlay, revealSite);
        }
    });

    // ---- Intro terminal animation ----------------------------------------
    function runIntro(overlay, done) {
        const typingCommand = document.getElementById("typing-command");
        const terminalOutput = document.getElementById("terminal-output");
        const loadingBar = document.getElementById("loading-bar");
        const commands = ["exec ./tahjay.dev", "Server starting...", "Website loading..."];

        let finished = false;
        function finish() {
            if (finished) return;
            finished = true;
            cleanup();
            if (overlay) {
                overlay.style.transition = "opacity 0.45s ease";
                overlay.style.opacity = "0";
                setTimeout(done, 450);
            } else {
                done();
            }
        }

        // Let the visitor skip with a click or any key.
        function onKey(e) { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish(); }
        function onClick() { finish(); }
        function cleanup() {
            document.removeEventListener("keydown", onKey);
            if (overlay) overlay.removeEventListener("click", onClick);
        }
        document.addEventListener("keydown", onKey);
        if (overlay) {
            overlay.addEventListener("click", onClick);
            overlay.style.cursor = "pointer";
            overlay.setAttribute("title", "Click or press any key to skip");
        }

        // Failsafe: never trap the visitor if something stalls.
        setTimeout(finish, 6000);

        let ci = 0, chi = 0;
        function typeCommand() {
            if (finished) return;
            if (ci >= commands.length) { startLoadingBar(); return; }
            const cmd = commands[ci];
            if (chi < cmd.length) {
                if (typingCommand) typingCommand.textContent += cmd[chi];
                chi++;
                setTimeout(typeCommand, 28);
            } else {
                setTimeout(function () {
                    if (finished) return;
                    if (terminalOutput) {
                        const line = document.createElement("div");
                        line.className = "line";
                        line.textContent = "$ " + cmd;
                        terminalOutput.appendChild(line);
                    }
                    if (typingCommand) typingCommand.textContent = "";
                    chi = 0; ci++;
                    setTimeout(typeCommand, 220);
                }, 160);
            }
        }

        function startLoadingBar() {
            if (finished) return;
            if (terminalOutput) {
                const line = document.createElement("div");
                line.className = "line";
                line.textContent = "Loading website...";
                terminalOutput.appendChild(line);
            }
            let progress = 0;
            const id = setInterval(function () {
                if (finished) { clearInterval(id); return; }
                progress += 4;
                if (loadingBar) loadingBar.style.width = progress + "%";
                if (progress >= 100) {
                    clearInterval(id);
                    setTimeout(finish, 350);
                }
            }, 22);
        }

        setTimeout(typeCommand, 500);
    }

    // ---- Everything that runs once the site is visible -------------------
    let inited = false;
    function initSite() {
        if (inited) return;
        inited = true;

        // ScrollSpy is initialised declaratively via data-bs-spy on <body>.

        if (prefersReducedMotion) {
            const vid = document.getElementById("bg-video");
            if (vid && vid.pause) vid.pause();
        }

        initNavbar();
        initHeroTyping();
        initTypingSection("about", "#about-typed", buildAboutTyper);
        initTypingSection("qualifications", "#skills-typed", buildSkillsTyper);
        initSectionReveals();
        maybeLoadSpline();
    }

    // Navbar background on scroll — throttled with requestAnimationFrame.
    function initNavbar() {
        const navbar = document.getElementById("navbar");
        if (!navbar) return;
        let ticking = false;
        function update() {
            navbar.classList.toggle("navbar-scrolled", window.scrollY > 30);
            ticking = false;
        }
        update();
        window.addEventListener("scroll", function () {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
    }

    function initHeroTyping() {
        const el = document.getElementById("hero-typed");
        if (!el) return;
        const phrases = ["Programing Tutor", "Student Leader", "IT Professional", "Web Developer", "App Developer"];
        if (prefersReducedMotion) { el.textContent = "Web Developer"; return; }

        let p = 0, c = 0, deleting = false;
        function loop() {
            if (document.hidden) { setTimeout(loop, 400); return; } // pause when tab is hidden
            const phrase = phrases[p];
            c += deleting ? -1 : 1;
            el.textContent = phrase.slice(0, c);
            let delay = deleting ? 60 : 110;
            if (!deleting && c === phrase.length) { delay = 1200; deleting = true; }
            else if (deleting && c === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 500; }
            setTimeout(loop, delay);
        }
        loop();
    }

    // Generic: type text into an element when its section scrolls into view.
    function initTypingSection(sectionId, targetSelector, builder) {
        const section = document.getElementById(sectionId);
        const target = document.querySelector(targetSelector);
        if (!section || !target) return;

        const run = builder(target);
        if (prefersReducedMotion) { run.instant(); return; }

        if (!("IntersectionObserver" in window)) { run.instant(); return; }
        const io = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { setTimeout(run.animate, 250); obs.disconnect(); }
            });
        }, { threshold: 0.4 });
        io.observe(section);
    }

    function buildAboutTyper(el) {
        const text = "I'm Tahjay Ulett, an IT student truly passionate about Technology, I am constantly trying to learn new skills " +
            "and develop the ones I have now. I have experince in web design and app development with a profound interest in artificial intelligence. " +
            "I enjoy building creative digital solutions and continuously learning new technologies to stay ahead in the tech world. I believe that knowledge is power, " +
            "so I strive to learn as much as I can. I also do freelance work, so if you need a website or app, feel free to reach out to me.";
        return {
            instant: function () { el.textContent = text; },
            animate: function () {
                let i = 0;
                (function tick() {
                    el.textContent = text.slice(0, i);
                    if (i++ <= text.length) setTimeout(tick, 16);
                })();
            }
        };
    }

    function buildSkillsTyper(el) {
        const skills = [
            '"BSc IT Student"',
            '"Microsoft Certified: Azure AI Fundamentals"',
            '"Proficient in HTML, JavaScript (React), PHP, and C# (Dotnet)"',
            '"Web Design & UI/UX Principles"',
            '"Cross Platform App Development (React Native)"',
            '"AI & Machine Learning Fundamentals"',
            '"Teamwork, Leadership & Communication Skills"'
        ];

        // Build one row per array element: an index gutter ([0]..[6], true to
        // Skills[7]) + the string literal + a trailing comma.
        el.classList.add("cpp-array");
        const rows = skills.map(function (text, i) {
            const line = document.createElement("div");
            line.className = "cpp-line";

            const gutter = document.createElement("span");
            gutter.className = "cpp-gutter";
            gutter.setAttribute("aria-hidden", "true");
            gutter.textContent = "[" + i + "]";

            const val = document.createElement("span");
            val.className = "cpp-str";

            const comma = document.createElement("span");
            comma.className = "cpp-punct";
            comma.textContent = i < skills.length - 1 ? "," : "";

            line.appendChild(gutter);
            line.appendChild(val);
            line.appendChild(comma);
            return { line: line, val: val, comma: comma, text: text };
        });

        function mount() {
            el.textContent = "";
            rows.forEach(function (r) { el.appendChild(r.line); });
        }

        return {
            instant: function () {
                mount();
                rows.forEach(function (r) { r.val.textContent = r.text; });
            },
            animate: function () {
                mount();
                rows.forEach(function (r) { r.comma.style.visibility = "hidden"; });
                let ri = 0, ci = 0;
                (function tick() {
                    if (ri >= rows.length) return;
                    const r = rows[ri];
                    r.val.textContent = r.text.slice(0, ci);
                    r.line.classList.add("is-typing");
                    if (ci < r.text.length) {
                        ci++;
                        setTimeout(tick, 16);
                    } else {
                        r.comma.style.visibility = "visible";
                        r.line.classList.remove("is-typing");
                        ci = 0;
                        ri++;
                        setTimeout(tick, 300);
                    }
                })();
            }
        };
    }

    // Section + card entrance reveals.
    function initSectionReveals() {
        if (!("IntersectionObserver" in window)) {
            document.querySelectorAll("section.section-animate").forEach(function (s) { s.classList.add("visible"); });
            return;
        }
        const sectionIO = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { entry.target.classList.add("visible"); obs.unobserve(entry.target); }
            });
        }, { threshold: 0.2 });
        document.querySelectorAll("section.section-animate").forEach(function (s) { sectionIO.observe(s); });

        const cardIO = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = "translateY(0) scale(1)";
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        document.querySelectorAll(".card").forEach(function (c) { cardIO.observe(c); });
    }

    // Spline is heavy WebGL: only load it on capable, motion-friendly desktops.
    function maybeLoadSpline() {
        const wrap = document.querySelector(".spline-3d-wrapper");
        if (!wrap) return;
        const saveData = navigator.connection && navigator.connection.saveData;
        const allow = !prefersReducedMotion &&
            window.matchMedia("(min-width: 992px)").matches &&
            !saveData;
        if (!allow) { wrap.style.display = "none"; return; }

        function load() {
            if (window.__splineLoaded) return;
            window.__splineLoaded = true;
            const s = document.createElement("script");
            s.type = "module";
            s.src = "https://unpkg.com/@splinetool/viewer@1.10.32/build/spline-viewer.js";
            document.head.appendChild(s);
        }
        if ("requestIdleCallback" in window) requestIdleCallback(load, { timeout: 2500 });
        else setTimeout(load, 1200);
    }
})();

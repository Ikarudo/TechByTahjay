// projects.js — animates the "git log" projects terminal.
// Progressive enhancement: with no JS or reduced motion, the section is fully
// visible and static. Animation only runs when the user allows motion.

(function () {
    "use strict";

    const log = document.querySelector(".commit-log");
    if (!log) return;

    const reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cmdEl = log.querySelector(".cl-cmd__type");
    const hashEls = Array.prototype.slice.call(log.querySelectorAll(".cl-hash"));
    const HEX = "0123456789abcdef";

    // Settle every hash to its final value (used for the static / reduced path).
    function settleHashes() {
        hashEls.forEach(function (el) { el.textContent = el.dataset.hash; });
    }

    if (reduceMotion) {
        if (cmdEl) cmdEl.textContent = cmdEl.dataset.cmd || cmdEl.textContent;
        settleHashes();
        return; // no entrance animation
    }

    // Motion allowed: start hidden, reveal on scroll.
    log.classList.add("anim");
    if (cmdEl) cmdEl.textContent = "";
    hashEls.forEach(function (el) { el.textContent = ""; });

    function typeCommand(done) {
        if (!cmdEl) { done(); return; }
        const text = cmdEl.dataset.cmd || "";
        let i = 0;
        (function tick() {
            cmdEl.textContent = text.slice(0, i);
            if (i++ < text.length) {
                setTimeout(tick, 38);
            } else {
                done();
            }
        })();
    }

    // Scramble a hash through random hex, then settle to its real value.
    function scrambleHash(el, delay) {
        const finalText = el.dataset.hash;
        const len = finalText.length;
        let ticks = 0;
        const totalTicks = 12;
        setTimeout(function () {
            const id = setInterval(function () {
                if (ticks >= totalTicks) {
                    clearInterval(id);
                    el.textContent = finalText;
                    return;
                }
                let s = "";
                for (let j = 0; j < len; j++) {
                    // lock in characters progressively from the left
                    s += (j < (ticks / totalTicks) * len)
                        ? finalText[j]
                        : HEX[(Math.random() * 16) | 0];
                }
                el.textContent = s;
                ticks++;
            }, 45);
        }, delay);
    }

    let played = false;
    function play() {
        if (played) return;
        played = true;
        log.classList.add("is-live");
        typeCommand(function () {
            hashEls.forEach(function (el, idx) { scrambleHash(el, idx * 130); });
        });
    }

    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { play(); obs.disconnect(); }
            });
        }, { threshold: 0.25 });
        io.observe(log);
    } else {
        play();
    }
})();

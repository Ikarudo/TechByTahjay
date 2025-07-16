// main.js
// Animate sections and cards on scroll

document.addEventListener("DOMContentLoaded", function () {
    // Enable Bootstrap scrollspy
    var scrollSpy = new bootstrap.ScrollSpy(document.body, {
        target: '#navbar',
        offset: 70
    });

    // Navbar transparency on scroll
    const navbar = document.getElementById('navbar');
    function updateNavbar() {
        if (window.scrollY > 30) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }
    updateNavbar();
    window.addEventListener('scroll', updateNavbar);

    // Typing animation for hero subtitle
    const phrases = [
        'IT Student',
        'Web Designer',
        'App Developer',
        'AI Enthusiast'
    ];
    let currentPhrase = 0;
    let currentChar = 0;
    let isDeleting = false;
    const typedElem = document.getElementById('hero-typed');

    function typeLoop() {
        if (!typedElem) return;
        let phrase = phrases[currentPhrase];
        if (isDeleting) {
            currentChar--;
        } else {
            currentChar++;
        }
        typedElem.textContent = phrase.slice(0, currentChar);
        let delay = isDeleting ? 60 : 110;
        if (!isDeleting && currentChar === phrase.length) {
            delay = 1200;
            isDeleting = true;
        } else if (isDeleting && currentChar === 0) {
            isDeleting = false;
            currentPhrase = (currentPhrase + 1) % phrases.length;
            delay = 500;
        }
        setTimeout(typeLoop, delay);
    }
    typeLoop();

    // About section typing effect
    const aboutText = `I'm Tahjay Ulett, an IT student passionate about technology. I am truly passionate about Technology, I am constantly trying to learn new skills
and develop the ones I have now. I have experince in web design and app development with a profound interest in artificial intelligence. 
I enjoy building creative digital solutions and continuously learning new technologies to stay ahead in the tech world.
I believe that knowledge is power, so I strive to learn as much as I can.`;
    let aboutTypedStarted = false;
    const aboutTypedElem = document.getElementById('about-typed');
    function typeAboutText(idx = 0) {
        if (!aboutTypedElem) return;
        if (idx <= aboutText.length) {
            aboutTypedElem.textContent = aboutText.slice(0, idx);
            setTimeout(() => typeAboutText(idx + 1), aboutText[idx - 1] === '\n' ? 250 : 22);
        }
    }
    function scrollToAbout() {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    // Observer to trigger typing when About is visible
    const aboutObserver = new window.IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !aboutTypedStarted) {
                aboutTypedStarted = true;
                setTimeout(() => typeAboutText(1), 350);
                setTimeout(scrollToAbout, 200);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }

    // Skills section typing effect
    const skillsArray = [
        '"BSc IT Student"',
        '"Proficient in HTML, JavaScript (React), PHP, and C# (Dotnet)"',
        '"Web Design & UI/UX Principles"',
        '"Cross Platform App Development (React Native)"',
        '"AI & Machine Learning Fundamentals"',
        '"Teamwork, Leadership & Communication Skills"'
    ];
    let skillsTypedStarted = false;
    const skillsTypedElem = document.getElementById('skills-typed');
    function typeSkillsText(idx = 0, arrIdx = 0) {
        if (!skillsTypedElem) return;
        // Compose the array as typed
        let prefix = '';
        for (let i = 0; i < arrIdx; i++) {
            prefix += '    ' + skillsArray[i] + (i < skillsArray.length - 1 ? ',\n' : '\n');
        }
        let current = arrIdx < skillsArray.length ? '    ' + skillsArray[arrIdx].slice(0, idx) : '';
        let comma = (arrIdx < skillsArray.length - 1 && idx === skillsArray[arrIdx].length) ? ',' : '';
        skillsTypedElem.textContent = prefix + current + comma;
        if (arrIdx < skillsArray.length) {
            if (idx < skillsArray[arrIdx].length) {
                setTimeout(() => typeSkillsText(idx + 1, arrIdx), 18);
            } else {
                setTimeout(() => typeSkillsText(0, arrIdx + 1), 350);
            }
        }
    }
    function scrollToSkills() {
        const skillsSection = document.getElementById('qualifications');
        if (skillsSection) {
            skillsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    // Observer to trigger typing when Skills is visible
    const skillsObserver = new window.IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillsTypedStarted) {
                skillsTypedStarted = true;
                setTimeout(() => typeSkillsText(1, 0), 350);
                setTimeout(scrollToSkills, 200);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    const skillsSection = document.getElementById('qualifications');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // Intersection Observer for section entrance animations
    const observer = new window.IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, {threshold: 0.2});

    document.querySelectorAll('section.section-animate').forEach(section => {
        observer.observe(section);
    });

    // Animate cards individually
    const cardObserver = new window.IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0) scale(1)';
                obs.unobserve(entry.target);
            }
        });
    }, {threshold: 0.15});
    document.querySelectorAll('.card').forEach(card => {
        cardObserver.observe(card);
    });
});

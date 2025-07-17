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
    const aboutText = `I'm Tahjay Ulett, an IT student truly passionate about Technology, I am constantly trying to learn new skills
                and develop the ones I have now. I have experince in web design and app development with a profound interest in artificial intelligence. 
                I enjoy building creative digital solutions and continuously learning new technologies to stay ahead in the tech world. I believe that knowledge is power, 
                so I strive to learn as much as I can. I also do freelance work, so if you need a website or app, feel free to reach out to me.`;
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
        '"Microsoft Certified: Azure AI Fundamentals"',
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

// Linux Terminal Startup Animation
document.addEventListener('DOMContentLoaded', function() {
    const terminalOverlay = document.getElementById('terminal-overlay');
    const typingCommand = document.getElementById('typing-command');
    const terminalOutput = document.getElementById('terminal-output');
    const loadingBar = document.getElementById('loading-bar');
    const mainContent = document.getElementById('main-content');
    const commands = [
        'exec ./tahjay.dev',
        'Server starting...',
        'Website loading...'
    ];
    
    let commandIndex = 0;
    let charIndex = 0;
    
    function typeCommand() {
        if (commandIndex < commands.length) {
            const currentCommand = commands[commandIndex];
            
            if (charIndex < currentCommand.length) {
                typingCommand.textContent += currentCommand[charIndex];
                charIndex++;
                setTimeout(typeCommand, 50);
            } else {
                // Command finished typing
                setTimeout(() => {
                    // Add to output
                    const outputLine = document.createElement('div');
                    outputLine.className = 'line';
                    outputLine.textContent = `$ ${currentCommand}`;
                    terminalOutput.appendChild(outputLine);
                    
                    // Clear typing area
                    typingCommand.textContent = '';
                    charIndex = 0;
                    commandIndex++;
                    
                    // Move to next command
                    setTimeout(typeCommand, 500);
                }, 300);
            }
        } else {
            // All commands typed, start loading bar
            setTimeout(startLoadingBar, 50);
        }
    }
    
    function startLoadingBar() {
        const loadingLine = document.createElement('div');
        loadingLine.className = 'line';
        loadingLine.textContent = 'Loading website...';
        terminalOutput.appendChild(loadingLine);
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            loadingBar.style.width = progress + '%';
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    const completeLine = document.createElement('div');
                    completeLine.className = 'line';
                    completeLine.textContent = 'Website loaded successfully!';
                    terminalOutput.appendChild(completeLine);
                    
                    setTimeout(() => {
                        // Fade out terminal
                        terminalOverlay.style.opacity = '0';
                        terminalOverlay.style.transition = 'opacity 0.5s';
                        
                        setTimeout(() => {
                            terminalOverlay.style.display = 'none';
                            mainContent.style.display = 'block';
                            
                            // Fade in main content
                            setTimeout(() => {
                                mainContent.classList.add('show');
                            }, 100);
                        }, 500);
                    }, 1000);
                }, 500);
            }
        }, 50);
    }
    
    // Start the animation
    setTimeout(typeCommand, 1000);
});

(function () {
    // 1. Inject Global Styles
    const style = document.createElement('style');
    style.textContent = `
        .re-sentence {
            transition: all 0.3s ease;
            cursor: pointer;
            line-height: 1.8;
            font-size: 1.25em; /* Increase font size relative to container */
        }
        
        .re-word {
            display: inline-block;
            margin-right: 0.25em; /* Increase space between words */
        }

        /* Focus Mode Styles */
        body.re-focus-mode .re-sentence {
            filter: blur(2px);
            opacity: 0.6;
            transition: filter 0.5s ease, opacity 0.5s ease;
        }

        body.re-focus-mode .re-sentence:hover {
            filter: blur(1px);
            opacity: 0.8;
        }

        body.re-focus-mode .re-sentence.re-active {
            filter: none !important;
            opacity: 1 !important;
            background-color: #FFFACD; /* LemonChiffon Highlight */
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            color: black;
            border-radius: 4px;
            padding: 4px 8px;
            transform: scale(1.02);
            z-index: 1000;
            position: relative;
            border-left: 5px solid #FFD700;
            transition: none !important; /* Instant Unblur */
        }
        
        /* Ensure children are also unblurred immediately */
        body.re-focus-mode .re-sentence.re-active .re-word {
            filter: none !important;
            opacity: 1 !important;
            transition: none !important;
        }

        /* Mic Button Styles */
        #re-mic-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #3182CE;
            color: white;
            border: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        #re-mic-btn:hover {
            transform: scale(1.1);
        }

        #re-mic-btn.re-listening {
            background: #E53E3E; /* Red when listening */
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(229, 62, 62, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(229, 62, 62, 0); }
            100% { box-shadow: 0 0 0 0 rgba(229, 62, 62, 0); }
        }

        /* Tooltip for functionality */
        .re-tooltip {
            position: absolute;
            bottom: 70px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
        }
        #re-mic-btn:hover .re-tooltip {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // Activates Focus Mode on first run
    document.body.classList.add('re-focus-mode');

    let activeSentence = null;
    let recognition = null;
    let isListening = false;
    let allSentences = []; // simplified array for navigation

    let currentSentenceTranscript = ""; // Persistent history for the current sentence

    // --- Voice Logic ---
    function initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn("Web Speech API not supported.");
            alert("Your browser does not support Voice Navigation. Please use Chrome.");
            return;
        }

        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            console.log("Speech Service Started");
            const btn = document.getElementById('re-mic-btn');
            if (btn) btn.classList.add('re-listening');
        };

        recognition.onresult = (event) => {
            if (!activeSentence) return;

            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    const finalText = event.results[i][0].transcript;
                    console.log("Final Speech Chunk:", finalText);
                    currentSentenceTranscript += " " + finalText; // Accumulate
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            // Visual Feedback in Tooltip
            const btn = document.getElementById('re-mic-btn');
            if (btn) {
                const tooltip = btn.querySelector('.re-tooltip span');
                // Show last 3 words of what is being heard
                const display = (interimTranscript || currentSentenceTranscript).slice(-30);
                if (tooltip) tooltip.innerText = display ? `...${display}` : "Listening...";
            }

            // Combine history + current interim for checking
            const fullTranscript = (currentSentenceTranscript + " " + interimTranscript).trim();

            if (fullTranscript) {
                // console.log("Full Context:", fullTranscript); // Optional: Debugging
                checkMatch(fullTranscript);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech error", event.error);
            if (event.error === 'not-allowed') {
                alert("Please allow microphone access to use Voice Navigation.");
                toggleMic(false);
            }
        };

        recognition.onend = () => {
            if (isListening) {
                console.log("Speech recognition ended. Restarting in 1s...");

                // Longer delay to break rapid failure loops
                setTimeout(() => {
                    if (isListening) {
                        try {
                            // Ensure it's fully stopped before restarting
                            recognition.stop();
                        } catch (e) { }

                        try {
                            recognition.start();
                        } catch (e) {
                            console.warn("Retrying start failed:", e);
                        }
                    }
                }, 1000); // Increased from 500ms to 1000ms for stability
            }
        };
    }

    function checkMatch(transcript) {
        if (!activeSentence) return;

        // Clean text: Replace punctuation with SPACE to prevent word merging (e.g. "one:two" -> "one two")
        const clean = (t) => t.toLowerCase().replace(/[^\w\s]|_/g, " ").replace(/\s+/g, " ").trim();

        const targetText = clean(activeSentence.innerText);
        const spokenText = clean(transcript);

        // Remove common written-out punctuation words from spoken text if they appear (just in case)
        // e.g. if user literally says "comma" or voice engine outputs it
        const spokenWordsCleaned = spokenText.split(' ').filter(w => !['comma', 'period', 'colon', 'semicolon', 'dash', 'hyphen'].includes(w)).join(' ');

        const targetWords = targetText.split(' ');
        if (targetWords.length === 0) return;

        // Smart Logic: "Move only after I complete reading"
        // We only look for the absolute END of the sentence.

        const lastWord = targetWords[targetWords.length - 1];
        const secondLastWord = targetWords.length > 1 ? targetWords[targetWords.length - 2] : null;

        // Common words that shouldn't trigger a move if they are merely "second to last"
        // (Prevent jumping on "the", "to", "and" unless it's the actual end)
        const COMMON_FILLERS = ['the', 'and', 'to', 'of', 'in', 'is', 'it', 'a', 'an'];

        let matchFound = false;

        // Condition 1: Spoken text contains the LAST word (Strongest signal)
        if (lastWord && lastWord.length > 1 && spokenWordsCleaned.includes(lastWord)) {
            matchFound = true;
            console.log(`Matched Last Word: "${lastWord}"`);
        }
        // Condition 2: Spoken text contains SECOND to last word, BUT it must be unique (not a filler)
        else if (secondLastWord &&
            secondLastWord.length > 2 &&
            !COMMON_FILLERS.includes(secondLastWord) &&
            spokenWordsCleaned.includes(secondLastWord)) {
            matchFound = true;
            console.log(`Matched Unique Second-Last Word: "${secondLastWord}"`);
        }

        if (matchFound) {
            console.log("✅ Sentence Completed! Advancing...");
            advanceSentence();
        }
    }

    function advanceSentence() {
        if (!activeSentence) return;

        // Reset history for the next sentence
        currentSentenceTranscript = "";
        console.log("History cleared for new sentence.");

        const currentIndex = allSentences.indexOf(activeSentence);
        if (currentIndex < allSentences.length - 1) {
            setActive(allSentences[currentIndex + 1]);
        }
    }

    function toggleMic(forceState) {
        if (!recognition) initSpeechRecognition();
        if (!recognition) return;

        const btn = document.getElementById('re-mic-btn');
        const newState = forceState !== undefined ? forceState : !isListening;

        if (newState) {
            try {
                recognition.start();
                isListening = true;
                btn.classList.add('re-listening');
                btn.querySelector('span').textContent = "Listening...";
                console.log("Microphone started.");
            } catch (e) { console.log(e); }
        } else {
            recognition.stop();
            isListening = false;
            btn.classList.remove('re-listening');
            btn.querySelector('span').textContent = "Mic Off";
            console.log("Microphone stopped.");
        }
    }

    // --- UI Setup ---
    function createMicButton() {
        if (document.getElementById('re-mic-btn')) return; // Avoid duplicates

        const btn = document.createElement('button');
        btn.id = 're-mic-btn';
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            <div class="re-tooltip"><span>Mic Off</span></div>
        `;
        btn.addEventListener('click', () => toggleMic());
        document.body.appendChild(btn);
    }


    // --- Red Word Alert Setup ---
    const RED_WORDS = [
        'was', 'said', 'of', 'you', 'to', 'are', 'does', 'what', 'they'
    ];

    const RED_WORD_HINTS = {
        'was': "rhymes with 'buzz'",
        'said': "rhymes with 'bed'",
        'of': "sounds like 'uv'",
        'you': "sounds like 'yoo'",
        'to': "rhymes with 'do'",
        'are': "sounds like the letter 'R'",
        'does': "sounds like 'duzz'",
        'what': "rhymes with 'hot'",
        'they': "rhymes with 'day'"
    };

    let stickyWord = null; // Track if we are locked onto a word

    // Create Flashcard UI
    function createFlashcard() {
        const existing = document.getElementById('re-flashcard');
        if (existing) existing.remove();

        const card = document.createElement('div');
        card.id = 're-flashcard';
        card.innerHTML = `
            <div class="re-actions">
                <button class="re-btn re-close-btn" title="Close">✖</button>
                <button class="re-btn re-speak-btn" title="Read Aloud">🔊</button>
            </div>
            <div class="re-header">
                <h3>⚠️ Tricky Word</h3>
            </div>
            <div id="re-flashcard-text"></div>
            <div class="re-hint"></div>
        `;
        document.body.appendChild(card);

        // Close Button Listener
        const closeBtn = card.querySelector('.re-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('mousedown', (e) => {
                e.preventDefault(); e.stopPropagation();
                hideFlashcard(true);
            });
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                hideFlashcard(true);
            });
        }

        // Speak Button Listener
        const speakBtn = card.querySelector('.re-speak-btn');
        if (speakBtn) {
            speakBtn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                const word = card.querySelector('#re-flashcard-text').innerText.replace(/"/g, '');
                speakRedWord(word);
            });
        }

        // Prevent click inside card from bubbling up
        card.addEventListener('click', (e) => e.stopPropagation());

        return card;
    }
    const flashcard = createFlashcard();

    // Show Flashcard
    function showFlashcard(word, rect, isSticky = false) {
        if (stickyWord && !isSticky) return; // Don't override sticky with hover

        if (isSticky) {
            stickyWord = word;
            flashcard.classList.add('sticky-mode');
        } else {
            flashcard.classList.remove('sticky-mode');
        }

        const hint = RED_WORD_HINTS[word.toLowerCase()] || "Tricky to sound out!";

        flashcard.querySelector('#re-flashcard-text').innerText = `"${word}"`;
        flashcard.querySelector('.re-hint').innerText = `💡 Hint: ${hint}`;

        // Save hint for speech
        flashcard.dataset.currentHint = hint;

        // Calculate Position (Viewport Relative)
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Default: Below and centered-ish, relative to viewport
        let top = rect.bottom + 10;
        let left = rect.left;

        // Prevent going off right edge
        if (left + 250 > viewportWidth) {
            left = viewportWidth - 260;
        }

        // Prevent going off bottom edge (flip to top)
        if (top + 150 > viewportHeight) {
            top = rect.top - 160;
        }

        // Use Math.round to prevent sub-pixel rendering blur
        flashcard.style.top = `${Math.round(top)}px`;
        flashcard.style.left = `${Math.round(left)}px`;

        flashcard.classList.add('visible');
    }

    // Hide Flashcard
    function hideFlashcard(force = false) {
        if (stickyWord && !force) return; // Stay visible if sticky

        flashcard.classList.remove('visible');
        if (force) {
            stickyWord = null;
            flashcard.classList.remove('sticky-mode');
        }
    }

    // Speak Red Word
    // --- Voice Setup ---
    let availableVoices = [];

    function loadVoices() {
        // Fetch voices (async operation in some browsers)
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            availableVoices = voices;
            console.log("Extension: Voices loaded:", availableVoices.map(v => v.name));
        }
    }

    if ('speechSynthesis' in window) {
        // Try to load immediately
        loadVoices();
        // Hook into event for async loading
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }

    // Speak Red Word
    function speakRedWord(word) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            const hint = RED_WORD_HINTS[word.toLowerCase()] || "";
            const text = `The word is ${word}. ${hint}`;

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1.0;

            // Ensure we have voices even if the event missed
            if (availableVoices.length === 0) {
                availableVoices = window.speechSynthesis.getVoices();
            }

            // Priority Selection for Female Voices
            const preferredVoice = availableVoices.find(v =>
                v.name.includes('Google US English') ||
                v.name.includes('Microsoft Zira') ||
                v.name.includes('Samantha') ||
                v.name.toLowerCase().includes('female')
            );

            if (preferredVoice) {
                console.log("Using Voice:", preferredVoice.name);
                utterance.voice = preferredVoice;
            } else {
                console.warn("Target voice not found. Using default.");
            }

            window.speechSynthesis.speak(utterance);
        }
    }

    // --- Core Focus Mode Logic ---
    function setActive(sentenceElement) {
        if (activeSentence) {
            activeSentence.classList.remove('re-active');
        }
        activeSentence = sentenceElement;
        activeSentence.classList.add('re-active');

        // Scroll into view if needed
        activeSentence.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function bionicifyWord(word) {
        if (!word) return '';
        const match = word.match(/^([a-zA-Z]+)(.*)$/);
        if (!match) return `<span class="re-word">${word}</span>`;

        const [_, letters, punctuation] = match;
        const lowerWord = letters.toLowerCase();

        // CHECK FOR RED WORD
        if (RED_WORDS.includes(lowerWord)) {
            return `<span class="re-word red-word-highlight" data-word="${letters}">${letters}${punctuation}</span>`;
        }

        // Standard Bionic Logic
        const len = letters.length;
        let mid;
        if (len <= 3) mid = 1;
        else mid = Math.ceil(len / 2);

        const bold = letters.slice(0, mid);
        const regular = letters.slice(mid);

        return `<span class="re-word"><b>${bold}</b>${regular}${punctuation}</span>`;
    }

    // Event Delegation for Red Words (Hover Only)
    document.body.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('red-word-highlight')) {
            const word = e.target.getAttribute('data-word');
            const rect = e.target.getBoundingClientRect();
            // Show immediately on hover
            showFlashcard(word, rect);
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('red-word-highlight')) {
            // Check if we are moving TO the flashcard
            if (e.relatedTarget && (e.relatedTarget.id === 're-flashcard' || e.relatedTarget.closest('#re-flashcard'))) {
                return; // Don't hide if moving to the card
            }
            hideFlashcard(true); // Force hide on mouseout
        }
    });

    // Also hide if leaving the flashcard itself
    document.addEventListener('mouseout', (e) => {
        if (e.target.id === 're-flashcard' || e.target.closest('#re-flashcard')) {
            if (!e.relatedTarget || (!e.relatedTarget.classList.contains('red-word-highlight') && !e.relatedTarget.closest('#re-flashcard'))) {
                hideFlashcard(true);
            }
        }
    });

    // Remove click-to-stick, only speak
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('red-word-highlight')) {
            e.stopPropagation();
            const word = e.target.getAttribute('data-word');
            speakRedWord(word);
        }
    });

    // TreeWalker to find text nodes
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function (node) {
                // Ignore script, style, hidden elements, and interactive elements to avoid breaking UI
                const tag = node.parentElement.tagName;
                if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'BUTTON', 'INPUT', 'TEXTAREA'].includes(tag) ||
                    !node.nodeValue.trim()) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    const nodesToReplace = [];
    while (walker.nextNode()) {
        nodesToReplace.push(walker.currentNode);
    }

    nodesToReplace.forEach(node => {
        const text = node.nodeValue;
        // Split into sentences (simple punctuation based)
        const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g);

        if (!sentences) return;

        const fragment = document.createDocumentFragment();

        sentences.forEach(sentenceText => {
            if (!sentenceText.trim()) return;

            // --- SMART CHUNKING LOGIC ---
            // Instead of one giant sentence, split by commas/semicolons if it's long.
            // This creates smaller "yellow windows" for the kid.

            // 1. Split by rough clause delimiters
            // Regex splits on: [,;:]
            const chunks = sentenceText.split(/([,;:]+)/);

            let currentChunk = "";
            const finalChunks = [];

            chunks.forEach(part => {
                // If it's a delimiter, attach to previous chunk
                if (/^[,;:]+$/.test(part)) {
                    currentChunk += part;
                    finalChunks.push(currentChunk.trim());
                    currentChunk = "";
                } else {
                    // It's text.
                    // If adding this text makes it too long (e.g. > 15 words) and we already have content, push previous
                    const words = part.split(/\s+/).length;
                    if (currentChunk.length > 0 && (currentChunk.split(/\s+/).length + words) > 15) {
                        finalChunks.push(currentChunk.trim());
                        currentChunk = part;
                    } else {
                        currentChunk += part;
                    }
                }
            });
            if (currentChunk.trim()) finalChunks.push(currentChunk.trim());


            finalChunks.forEach(chunkText => {
                if (!chunkText.trim()) return;

                const span = document.createElement('span');
                span.className = 're-sentence';
                span.tabIndex = 0; // Make focusable

                // Bionic Processing
                const words = chunkText.split(/\s+/);
                span.innerHTML = words.map(bionicifyWord).join(' ') + ' '; // Add space back

                // Interaction
                span.addEventListener('click', (e) => {
                    e.stopPropagation();
                    updateActiveFromClick(span);
                });

                fragment.appendChild(span);
                allSentences.push(span); // Track for navigation
            });
        });

        // Replace text node with our interactive spans
        if (fragment.children.length > 0) {
            node.parentNode.replaceChild(fragment, node);
        }
    });

    function updateActiveFromClick(span) {
        setActive(span);
    }

    // Set first sentence as active initially
    if (allSentences.length > 0) {
        console.log("Extension loaded. Highlighting first sentence.");
        setActive(allSentences[0]);
    } else {
        console.warn("No sentences found.");
    }

    createMicButton();

})();

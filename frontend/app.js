// --- Configuration ---
const API_BASE = 'http://localhost:8000/api';
const MAX_CHARS = 8000;

// --- Skill Data (Mock based on Doku) ---
const SKILLS = [
    // Original Core Skills
    { id: 'CREATE_PPT', name: 'CREATE_PPT', cat: 'file', catColor: 'var(--cat-file)', desc: 'Erstellt eine professionelle PowerPoint-Präsentation basierend auf dem Thema.', example: 'Erstelle eine Praesentation ueber Digitalisierung in der oeffentlichen Verwaltung' },
    { id: 'DSGVO_RISK_SCAN', name: 'DSGVO_RISK_SCAN', cat: 'admin', catColor: 'var(--cat-admin)', desc: 'Prüft einen Prozess auf DSGVO-Risiken und erstellt eine Risikomatrix.', example: 'Prüfe den Einsatz von KI-Systemen in der öffentlichen Verwaltung auf DSGVO-Risiken' },
    { id: 'WRITE_EMAIL', name: 'WRITE_EMAIL', cat: 'content', catColor: 'var(--cat-content)', desc: 'Verfasst eine professionelle B2B-E-Mail.', example: 'Schreibe eine E-Mail an das Team bezüglich des nächsten Projektabschlusses' },
    { id: 'SEO_ANALYZE', name: 'SEO_ANALYZE', cat: 'strategy', catColor: 'var(--cat-strategy)', desc: 'Führt eine SERP-Analyse durch und identifiziert Content-Gaps.', example: 'Analysiere das Thema "Bürgerservice Online" auf SEO-Potenzial' },
    { id: 'SUMMARIZE', name: 'SUMMARIZE', cat: 'content', catColor: 'var(--cat-content)', desc: 'Erstellt ein Executive Summary (TL;DR + Key Takeaways).', example: 'Fasse den angehängten Text zusammen' },

    // 10 Zusaetzliche Skills für die Oeffentliche Verwaltung
    { id: 'LEGAL_PLAIN_LANGUAGE', name: 'LEGAL_PLAIN_LANGUAGE', cat: 'admin', catColor: 'var(--cat-admin)', desc: 'Übersetzt komplexes Behördendeutsch oder Gesetzestexte in Leichte Sprache (B1-Niveau).', example: 'Übersetze den angehängten Bescheid über die Festsetzung der Grundsteuer in leicht verständliche Sprache.' },
    { id: 'DRAFT_COUNCIL_RESOLUTION', name: 'DRAFT_COUNCIL_RESOLUTION', cat: 'admin', catColor: 'var(--cat-admin)', desc: 'Erstellt einen Entwurf für eine Beschlussvorlage (Gemeinderat/Stadtrat) inkl. Sachverhalt und Begründung.', example: 'Erstelle eine Beschlussvorlage zur Beschaffung von 50 neuen E-Bikes für die Stadtverwaltung.' },
    { id: 'CITIZEN_INQUIRY_RESPONSE', name: 'CITIZEN_INQUIRY_RESPONSE', cat: 'content', catColor: 'var(--cat-content)', desc: 'Formuliert eine bürgernahe, freundliche und rechtssichere Antwort auf eine Bürgeranfrage.', example: 'Antworte auf die Beschwerde eines Bürgers über zu wenig Parkplätze am Marktplatz.' },
    { id: 'PROCUREMENT_SPECIFICATION', name: 'PROCUREMENT_SPECIFICATION', cat: 'strategy', catColor: 'var(--cat-strategy)', desc: 'Unterstützt bei der Erstellung eines Leistungsverzeichnisses für öffentliche Ausschreibungen (VOL/VOB).', example: 'Erstelle die Bewertungskriterien für die Ausschreibung einer neuen Kita-Software.' },
    { id: 'PRESS_RELEASE_GOV', name: 'PRESS_RELEASE_GOV', cat: 'content', catColor: 'var(--cat-content)', desc: 'Verfasst eine offizielle Pressemitteilung für eine Kommune oder Behörde.', example: 'Schreibe eine Pressemitteilung über die Eröffnung des neuen, barrierefreien Bürgerbüros.' },
    { id: 'ACCESSIBILITY_CHECK', name: 'ACCESSIBILITY_CHECK', cat: 'data', catColor: 'var(--cat-data)', desc: 'Prüft Inhalte (z.B. Webtexte) auf Barrierefreiheit nach BITV 2.0 / WCAG.', example: 'Prüfe den folgenden Text unserer Website auf Barrierefreiheit und schlage Verbesserungen vor.' },
    { id: 'CRISIS_COMMUNICATION_GOV', name: 'CRISIS_COMMUNICATION_GOV', cat: 'strategy', catColor: 'var(--cat-strategy)', desc: 'Entwickelt einen schnellen Kommunikationsplan (CARE-Framework) für lokale Krisen (z.B. Hochwasser, Stromausfall).', example: 'Erstelle einen Kommunikationsplan für einen großflächigen Stromausfall im Stadtgebiet.' },
    { id: 'OZG_PROCESS_MODEL', name: 'OZG_PROCESS_MODEL', cat: 'strategy', catColor: 'var(--cat-strategy)', desc: 'Modelliert einen Verwaltungsprozess im Rahmen der OZG-Umsetzung (Onlinezugangsgesetz).', example: 'Modelliere den digitalen Antragsprozess für einen Bewohnerparkausweis nach OZG-Vorgaben.' },
    { id: 'BUDGET_EXPLANATION', name: 'BUDGET_EXPLANATION', cat: 'admin', catColor: 'var(--cat-admin)', desc: 'Erklärt komplexe Haushaltsposten oder Haushaltspläne für Nicht-Finanzexperten (z.B. für den Bürgerhaushalt).', example: 'Erkläre den Posten "Investive Schlüsselzuweisungen" aus dem Haushaltsplan für Bürger verständlich.' },
    { id: 'FAQ_GENERATOR_GOV', name: 'FAQ_GENERATOR_GOV', cat: 'content', catColor: 'var(--cat-content)', desc: 'Generiert eine Liste der häufigsten Fragen und Antworten (FAQ) zu einer neuen städtischen Dienstleistung.', example: 'Erstelle FAQs für die Einführung der neuen digitalen KFZ-Zulassung (i-Kfz).' }
];

// --- DOM Elements ---
const chatArea = document.getElementById('chat-area');
const chatMessages = document.getElementById('chat-messages');
const welcomeScreen = document.getElementById('welcome-screen');
const promptInput = document.getElementById('prompt-input');
const btnSend = document.getElementById('btn-send');
const charCounter = document.getElementById('char-counter');
const btnSkills = document.getElementById('btn-skills');
const btnClear = document.getElementById('btn-clear');
const skillDrawer = document.getElementById('skill-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const btnCloseSkills = document.getElementById('btn-close-skills');
const skillList = document.getElementById('skill-list');
const catTabs = document.querySelectorAll('.cat-tab');

// --- Initialization ---
function init() {
    renderSkills(SKILLS);
    setupEventListeners();
    promptInput.focus();
}

// --- Event Listeners ---
function setupEventListeners() {
    // Textarea auto-resize & char count
    promptInput.addEventListener('input', () => {
        // Auto resize
        promptInput.style.height = 'auto';
        promptInput.style.height = Math.min(promptInput.scrollHeight, 160) + 'px';

        // Char count
        const len = promptInput.value.length;
        charCounter.textContent = `${len} / ${MAX_CHARS}`;
        charCounter.style.display = len > 500 ? 'block' : 'none';
        charCounter.style.color = len > MAX_CHARS - 500 ? 'red' : 'var(--text-secondary)';

        // Enable/disable send
        btnSend.disabled = len === 0 || len > MAX_CHARS;
    });

    // Enter to send (Shift+Enter for newline)
    promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!btnSend.disabled) sendMessage();
        }
    });

    btnSend.addEventListener('click', sendMessage);

    // Quick Actions
    document.querySelectorAll('.btn-quick-action').forEach(btn => {
        btn.addEventListener('click', () => {
            promptInput.value = btn.dataset.prompt;
            promptInput.dispatchEvent(new Event('input')); // Trigger resize
            sendMessage();
        });
    });

    // Clear Chat
    btnClear.addEventListener('click', () => {
        chatMessages.innerHTML = '';
        welcomeScreen.style.display = 'flex';
        promptInput.value = '';
        promptInput.style.height = 'auto';
        promptInput.dispatchEvent(new Event('input'));
    });

    // Skill Drawer toggles
    btnSkills.addEventListener('click', toggleSkillDrawer);
    btnCloseSkills.addEventListener('click', toggleSkillDrawer);
    drawerOverlay.addEventListener('click', toggleSkillDrawer);

    // Skill Categories
    catTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            catTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            filterSkills(e.target.dataset.cat);
        });
    });
}

// --- Chat Logic ---
async function sendMessage() {
    const text = promptInput.value.trim();
    if (!text) return;

    // Hide welcome screen
    welcomeScreen.style.display = 'none';

    // 1. Render User Message
    renderMessage('user', text);

    // Clear input
    promptInput.value = '';
    promptInput.style.height = 'auto';
    promptInput.dispatchEvent(new Event('input'));

    // 2. Render Loading Indicator
    const loadingId = 'loading-' + Date.now();
    renderLoading(loadingId);
    scrollToBottom();

    try {
        // 3. API Call
        const response = await fetch(`${API_BASE}/orchestrate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: text })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // 4. Remove Loading
        document.getElementById(loadingId).remove();

        // 5. Render Assistant Response
        renderAssistantResponse(data);
    } catch (error) {
        document.getElementById(loadingId).remove();
        renderError(error.message);
    }
}

// --- UI Rendering ---
function renderMessage(role, content) {
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${role}-bubble`;

    const avatar = document.createElement('div');
    avatar.className = `avatar ${role}-avatar`;
    avatar.textContent = role === 'user' ? 'DU' : 'AI';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'bubble-content';

    if (role === 'user') {
        contentDiv.textContent = content; // Plain text
    } else {
        // Assume marked is available globally via CDN in index.html
        contentDiv.className += ' markdown-body';
        contentDiv.innerHTML = marked.parse(content);
    }

    bubble.appendChild(avatar);
    bubble.appendChild(contentDiv);
    chatMessages.appendChild(bubble);
    scrollToBottom();
}

function renderAssistantResponse(data) {
    const bubble = document.createElement('div');
    bubble.className = `message-bubble assistant-bubble`;

    const avatar = document.createElement('div');
    avatar.className = `avatar assistant-avatar`;
    avatar.textContent = 'AI';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'bubble-content';

    // Error Banner
    if (data.error) {
        const errDiv = document.createElement('div');
        errDiv.className = 'error-banner';
        errDiv.textContent = data.error;
        contentDiv.appendChild(errDiv);
    }

    // Pipeline Trace
    if (data.pipeline && data.pipeline.length > 0) {
        const traceDiv = createPipelineTrace(data.pipeline);
        contentDiv.appendChild(traceDiv);
    }

    // Main Answer (Markdown)
    if (data.answer) {
        const mdDiv = document.createElement('div');
        mdDiv.className = 'markdown-body';
        mdDiv.innerHTML = marked.parse(data.answer);
        contentDiv.appendChild(mdDiv);
    }

    // Files
    if (data.files && data.files.length > 0) {
        data.files.forEach(f => {
            const fileCard = createFileCard(f);
            contentDiv.appendChild(fileCard);
        });
    }

    bubble.appendChild(avatar);
    bubble.appendChild(contentDiv);
    chatMessages.appendChild(bubble);
    scrollToBottom();
}

function createPipelineTrace(pipeline) {
    const container = document.createElement('div');
    container.className = 'pipeline-trace';

    const summary = document.createElement('div');
    summary.className = 'trace-summary';
    summary.innerHTML = `▶ Pipeline [${pipeline.length} Schritte]`;

    const details = document.createElement('div');
    details.className = 'trace-details';

    pipeline.forEach(step => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'trace-step';

        const statusClass = step.status === 'ERROR' ? 'status-error' : 'status-ok';

        // Find skill category color
        const skillInfo = SKILLS.find(s => s.id === step.skill);
        const bgColor = skillInfo ? skillInfo.catColor : 'var(--midnight)';

        stepDiv.innerHTML = `
            <div class="status-dot ${statusClass}"></div>
            <span class="skill-badge" style="background-color: ${bgColor}">${step.skill}</span>
            <span class="trace-input">${step.input.substring(0, 60)}${step.input.length > 60 ? '...' : ''}</span>
        `;
        details.appendChild(stepDiv);
    });

    summary.addEventListener('click', () => {
        details.classList.toggle('open');
        summary.innerHTML = details.classList.contains('open')
            ? `▼ Pipeline [${pipeline.length} Schritte]`
            : `▶ Pipeline [${pipeline.length} Schritte]`;
    });

    container.appendChild(summary);
    container.appendChild(details);
    return container;
}

function createFileCard(file) {
    const card = document.createElement('div');
    card.className = 'file-card';

    // Icon based on type
    const icon = file.type === 'pptx' ? '📊' : '📄';

    card.innerHTML = `
        <div class="file-info">
            <span class="file-icon">${icon}</span>
            <span class="file-name">${file.name}</span>
        </div>
        <a href="${API_BASE.replace('/api', '')}/api/files/${file.name}" class="btn-download" download target="_blank">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download
        </a>
    `;
    return card;
}

function renderLoading(id) {
    const bubble = document.createElement('div');
    bubble.className = `message-bubble assistant-bubble`;
    bubble.id = id;

    const avatar = document.createElement('div');
    avatar.className = `avatar assistant-avatar`;
    avatar.textContent = 'AI';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'bubble-content';
    contentDiv.innerHTML = `
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;

    bubble.appendChild(avatar);
    bubble.appendChild(contentDiv);
    chatMessages.appendChild(bubble);
}

function renderError(msg) {
    const bubble = document.createElement('div');
    bubble.className = `message-bubble assistant-bubble`;

    const avatar = document.createElement('div');
    avatar.className = `avatar assistant-avatar`;
    avatar.textContent = 'AI';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'bubble-content';
    contentDiv.innerHTML = `<div class="error-banner">Fehler: ${msg}</div>`;

    bubble.appendChild(avatar);
    bubble.appendChild(contentDiv);
    chatMessages.appendChild(bubble);
    scrollToBottom();
}

function scrollToBottom() {
    chatArea.scrollTop = chatArea.scrollHeight;
}

// --- Drawer & Skills ---
function toggleSkillDrawer() {
    skillDrawer.classList.toggle('open');
    drawerOverlay.classList.toggle('open');
}

function renderSkills(skills) {
    skillList.innerHTML = '';
    skills.forEach(skill => {
        const item = document.createElement('div');
        item.className = 'skill-item';
        item.innerHTML = `
            <div class="skill-item-header">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-badge" style="background-color: ${skill.catColor}">${skill.cat}</span>
            </div>
            <div class="skill-desc">${skill.desc}</div>
            <div class="skill-example">"${skill.example}"</div>
        `;

        item.addEventListener('click', () => {
            promptInput.value = skill.example;
            promptInput.dispatchEvent(new Event('input'));
            toggleSkillDrawer();
            promptInput.focus();
        });

        skillList.appendChild(item);
    });
}

function filterSkills(cat) {
    if (cat === 'all') {
        renderSkills(SKILLS);
    } else {
        const filtered = SKILLS.filter(s => s.cat === cat);
        renderSkills(filtered);
    }
}

// Start
document.addEventListener('DOMContentLoaded', init);
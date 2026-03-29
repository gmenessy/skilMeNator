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
    { id: 'FAQ_GENERATOR_GOV', name: 'FAQ_GENERATOR_GOV', cat: 'content', catColor: 'var(--cat-content)', desc: 'Generiert eine Liste der häufigsten Fragen und Antworten (FAQ) zu einer neuen städtischen Dienstleistung.', example: 'Erstelle FAQs für die Einführung der neuen digitalen KFZ-Zulassung (i-Kfz).' },

    // Weitere Skills aus der Doku & Allgemeine Ergänzungen (um 39 Skills vollzumachen)
    { id: 'URL_CONTENT', name: 'URL_CONTENT', cat: 'data', catColor: 'var(--cat-data)', desc: 'Extrahiert und bereinigt Text von Webseiten (HTML→Markdown).', example: 'Extrahiere den Inhalt von https://www.bundesregierung.de' },
    { id: 'RAG_SEARCH', name: 'RAG_SEARCH', cat: 'data', catColor: 'var(--cat-data)', desc: 'Durchsucht die interne Wissensdatenbank.', example: 'Suche in der Wissensdatenbank nach Richtlinien für Homeoffice.' },
    { id: 'CALCULATION', name: 'CALCULATION', cat: 'data', catColor: 'var(--cat-data)', desc: 'Löst mathematische Ausdrücke mit Lösungsweg.', example: 'Berechne 19% MwSt. auf 4500 Euro und zeige den Rechenweg.' },
    { id: 'CREATE_WORD', name: 'CREATE_WORD', cat: 'file', catColor: 'var(--cat-file)', desc: 'Erstellt ein Word-Dokument (.docx) zum angegebenen Thema.', example: 'Erstelle ein Word-Dokument mit dem Protokoll der letzten Gemeinderatssitzung.' },
    { id: 'CREATE_EXCEL', name: 'CREATE_EXCEL', cat: 'file', catColor: 'var(--cat-file)', desc: 'Erstellt eine Excel-Tabelle (.xlsx) für Datenstrukturen.', example: 'Erstelle eine Excel-Tabelle für die Projektzeiterfassung 2024.' },
    { id: 'TRANSLATE', name: 'TRANSLATE', cat: 'content', catColor: 'var(--cat-content)', desc: 'Übersetzt Texte unter Bewahrung der Tonalität.', example: 'Übersetze diesen Bescheid ins Englische für internationale Bürger.' },
    { id: 'UNIT_CONVERTER', name: 'UNIT_CONVERTER', cat: 'data', catColor: 'var(--cat-data)', desc: 'Einheitenumrechnung mit Rechenweg.', example: 'Rechne 45 Hektar in Quadratmeter um.' },
    { id: 'NEWS_SEARCH', name: 'NEWS_SEARCH', cat: 'data', catColor: 'var(--cat-data)', desc: 'Aktuelle Nachrichtenzusammenfassung zu einem Thema.', example: 'Fasse die aktuellen Nachrichten zum Thema "Digitalpakt Schule" zusammen.' },
    { id: 'GENERATE_HTML', name: 'GENERATE_HTML', cat: 'file', catColor: 'var(--cat-file)', desc: 'Generiert ein HTML-Dokument basierend auf der Beschreibung.', example: 'Generiere eine HTML-Landingpage für den neuen Bürgerservice.' },
    { id: 'WRITE_SPEECH', name: 'WRITE_SPEECH', cat: 'content', catColor: 'var(--cat-content)', desc: 'Schreibt eine Rede inkl. Regieanweisungen.', example: 'Schreibe eine Rede für den Bürgermeister zur Eröffnung des neuen Rathauses.' },
    { id: 'SOCIAL_MEDIA_POST', name: 'SOCIAL_MEDIA_POST', cat: 'content', catColor: 'var(--cat-content)', desc: 'Erstellt Social-Media-Beiträge nach dem AIDA-Framework.', example: 'Schreibe einen LinkedIn-Post über die Einführung der E-Akte.' },
    { id: 'WRITE_JOB_AD', name: 'WRITE_JOB_AD', cat: 'content', catColor: 'var(--cat-content)', desc: 'Verfasst eine moderne Stellenanzeige ohne HR-Floskeln.', example: 'Erstelle eine Stellenanzeige für einen IT-Projektleiter (m/w/d) in der Stadtverwaltung.' },
    { id: 'CODE_EXPLAIN', name: 'CODE_EXPLAIN', cat: 'strategy', catColor: 'var(--cat-strategy)', desc: 'Erklärt Code-Snippets hinsichtlich Sicherheit und Clean Code.', example: 'Erkläre diesen Python-Code zur Datenbereinigung.' },
    { id: 'REQUIREMENTS_ANALYSIS', name: 'REQUIREMENTS_ANALYSIS', cat: 'strategy', catColor: 'var(--cat-strategy)', desc: 'Analysiert Anforderungen nach INVEST + BDD (Given-When-Then).', example: 'Analysiere die Anforderungen für das neue Kita-Portal.' },
    { id: 'MEETING_PROTOCOL', name: 'MEETING_PROTOCOL', cat: 'admin', catColor: 'var(--cat-admin)', desc: 'Erstellt ein DIN-5008-konformes Protokoll aus Notizen.', example: 'Erstelle ein Protokoll aus diesen Notizen vom Jour Fixe.' },
    { id: 'CHANGE_IMPACT_ANALYSIS', name: 'CHANGE_IMPACT_ANALYSIS', cat: 'admin', catColor: 'var(--cat-admin)', desc: 'Analysiert die Auswirkungen geplanter Änderungen.', example: 'Analysiere die Auswirkungen der Umstellung auf Microsoft 365.' },
    { id: 'PERSONA_GENERATOR', name: 'PERSONA_GENERATOR', cat: 'admin', catColor: 'var(--cat-admin)', desc: 'Generiert 3 Personas für eine Zielgruppe.', example: 'Erstelle Personas für die Nutzer des digitalen Bauantrags.' },
    { id: 'EIGHTH_MAN_ANALYSIS', name: 'EIGHTH_MAN_ANALYSIS', cat: 'strategy', catColor: 'var(--cat-strategy)', desc: 'Führt eine 8. Mann-Analyse (7 Pro + 1 fundamentales Contra) durch.', example: 'Mache eine 8. Mann-Analyse zur Einführung einer 4-Tage-Woche in der Verwaltung.' },
    { id: 'GAMIFICATION_STRATEGY', name: 'GAMIFICATION_STRATEGY', cat: 'strategy', catColor: 'var(--cat-strategy)', desc: 'Entwickelt eine Gamification-Strategie (Octalysis) für Prozesse.', example: 'Wie können wir die interne Fortbildung gamifizieren?' },
    { id: 'STARTUP_PITCH', name: 'STARTUP_PITCH', cat: 'strategy', catColor: 'var(--cat-strategy)', desc: 'Erstellt einen Pitch im Y-Combinator-Standard für Ideen.', example: 'Erstelle einen Pitch für unsere neue Smart-City-App.' },
    { id: 'DEVILS_ADVOCATE', name: 'DEVILS_ADVOCATE', cat: 'strategy', catColor: 'var(--cat-strategy)', desc: 'Nimmt die Rolle des "Advocatus Diaboli" zu einer These ein.', example: 'Sei der Advocatus Diaboli für das Konzept des komplett papierlosen Büros.' },
    { id: 'TIME_ZONE', name: 'TIME_ZONE', cat: 'data', catColor: 'var(--cat-data)', desc: 'Aktuelle Systemzeit für eine Stadt (Simulation).', example: 'Wie spät ist es gerade in Tokio?' },
    { id: 'STOCK_INFO', name: 'STOCK_INFO', cat: 'data', catColor: 'var(--cat-data)', desc: 'Börsendaten (Simulation).', example: 'Wie steht die Komm.ONE Aktie? (Simulation)' },
    { id: 'WEATHER', name: 'WEATHER', cat: 'data', catColor: 'var(--cat-data)', desc: 'Wetterprognose für einen Ort (Simulation).', example: 'Wie wird das Wetter morgen in Stuttgart?' },

    // Zusätzliche neue Skills (über 39 hinaus)
    { id: 'GENERATE_JOB_INTERVIEW_QUESTIONS', name: 'GENERATE_JOB_INTERVIEW_QUESTIONS', cat: 'strategy', catColor: 'var(--cat-strategy)', desc: 'Erstellt einen strukturierten Interview-Leitfaden für Bewerbungsgespräche.', example: 'Erstelle Interview-Fragen für die Position des IT-Sicherheitsbeauftragten.' },
    { id: 'E_AKTE_CLASSIFICATION', name: 'E_AKTE_CLASSIFICATION', cat: 'admin', catColor: 'var(--cat-admin)', desc: 'Schlägt Aktenzeichen und Klassifizierungen nach dem kommunalen Aktenplan vor.', example: 'Wie sollte dieses Dokument über den neuen Radweg klassifiziert werden?' },
    { id: 'GRANT_APPLICATION_REVIEW', name: 'GRANT_APPLICATION_REVIEW', cat: 'admin', catColor: 'var(--cat-admin)', desc: 'Unterstützt bei der Vorprüfung von Förderanträgen auf Vollständigkeit.', example: 'Prüfe diesen Förderantrag für die Vereinsförderung auf fehlende Angaben.' },
    { id: 'PUBLIC_PARTICIPATION_PLAN', name: 'PUBLIC_PARTICIPATION_PLAN', cat: 'strategy', catColor: 'var(--cat-strategy)', desc: 'Erstellt ein Konzept für die Bürgerbeteiligung bei Bauprojekten.', example: 'Erstelle einen Bürgerbeteiligungsplan für die Neugestaltung des Stadtparks.' },
    { id: 'INCLUSIVE_LANGUAGE_CHECK', name: 'INCLUSIVE_LANGUAGE_CHECK', cat: 'content', catColor: 'var(--cat-content)', desc: 'Prüft und überarbeitet Texte auf inklusive und gendergerechte Sprache.', example: 'Überarbeite dieses Formular auf gendergerechte Sprache.' }
];

// --- DOM Elements ---
const chatArea = document.getElementById('chat-area');
const chatMessages = document.getElementById('chat-messages');
const welcomeScreen = document.getElementById('welcome-screen');
const promptInput = document.getElementById('prompt-input');
const btnSend = document.getElementById('btn-send');
const btnAttach = document.getElementById('btn-attach');
const fileUpload = document.getElementById('file-upload');
const fileChips = document.getElementById('file-chips');

let attachedFiles = [];
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

    // File Attachments
    btnAttach.addEventListener('click', () => fileUpload.click());

    fileUpload.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            files.forEach(f => attachedFiles.push(f));
            renderFileChips();
        }
        fileUpload.value = ''; // Reset
    });

    // Clear Chat
    btnClear.addEventListener('click', () => {
        chatMessages.innerHTML = '';
        welcomeScreen.style.display = 'flex';
        promptInput.value = '';
        promptInput.style.height = 'auto';
        promptInput.dispatchEvent(new Event('input'));
        attachedFiles = [];
        renderFileChips();
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

    // Combine text with file info for UI and Backend
    let fullText = text;
    if (attachedFiles.length > 0) {
        fullText += "\n\n--- Angehängte Dateien ---\n";
        attachedFiles.forEach(f => {
            fullText += `- ${f.name} (${Math.round(f.size/1024)} KB)\n`;
        });
    }

    // Hide welcome screen
    welcomeScreen.style.display = 'none';

    // 1. Render User Message
    renderMessage('user', fullText);

    // Clear input
    promptInput.value = '';
    promptInput.style.height = 'auto';
    promptInput.dispatchEvent(new Event('input'));
    attachedFiles = [];
    renderFileChips();

    // 2. Render Loading Indicator
    const loadingId = 'loading-' + Date.now();
    renderLoading(loadingId);
    scrollToBottom();

    try {
        // 3. API Call
        const response = await fetch(`${API_BASE}/orchestrate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: fullText })
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

// --- File Chips UI ---
function renderFileChips() {
    fileChips.innerHTML = '';
    attachedFiles.forEach((file, index) => {
        const chip = document.createElement('div');
        chip.className = 'file-chip';

        chip.innerHTML = `
            <span class="chip-icon">📄</span>
            <span class="chip-name">${file.name}</span>
            <span class="chip-size">${Math.round(file.size/1024)} KB</span>
            <button class="btn-icon chip-remove" data-index="${index}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        `;

        const removeBtn = chip.querySelector('.chip-remove');
        removeBtn.addEventListener('click', () => {
            attachedFiles.splice(index, 1);
            renderFileChips();
        });

        fileChips.appendChild(chip);
    });
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
/* Skills & Commands Board — Vanilla JS */

const API_BASE = '/api/skills-admin';

// --- State ---
let currentTab = 'workflows';
let currentItem = null; // { type, filename, name, claudeMdContext }
let items = { workflows: [], skills: [], commands: [] };

// --- API Layer ---

async function fetchList(type) {
  const res = await fetch(`${API_BASE}/${type}`);
  return res.json();
}

async function fetchContent(type, id) {
  const res = await fetch(`${API_BASE}/${type}/${encodeURIComponent(id)}`);
  return res.json();
}

async function saveContent(type, id, content) {
  const res = await fetch(`${API_BASE}/${type}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  return res.json();
}

async function createItem(type, name, content) {
  const res = await fetch(`${API_BASE}/${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, content }),
  });
  return res.json();
}

async function createWorkflow(name, content) {
  return createItem('workflows', name, content);
}

async function fetchLinkingContext(type, filename) {
  const res = await fetch(`${API_BASE}/${type}/${encodeURIComponent(filename)}/linking-context`);
  return res.json();
}

async function applyLinking(changes) {
  const res = await fetch(`${API_BASE}/apply-linking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ changes }),
  });
  return res.json();
}

async function deleteItem(type, filename) {
  const res = await fetch(`${API_BASE}/${type}/${encodeURIComponent(filename)}`, {
    method: 'DELETE',
  });
  return res.json();
}

// --- Tab Switching ---

document.querySelectorAll('[data-tab]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentTab = btn.dataset.tab;
    currentItem = null;
    showEmptyDetail();
    document.getElementById('searchInput').value = '';
    updateNewWorkflowButton();
    loadList(currentTab);
  });
});

// --- List Loading & Rendering ---

async function loadList(type) {
  try {
    const data = await fetchList(type);
    items[type] = data;
    renderList(data, type);
  } catch (err) {
    showToast('Failed to load list.', 'danger');
  }
}

function renderList(data, type) {
  const listEl = document.getElementById('itemList');
  if (!data.length) {
    listEl.innerHTML = '<div class="text-muted text-center py-3" style="font-size:0.82rem">No items found</div>';
    return;
  }

  if (type === 'workflows') {
    renderWorkflowList(data, listEl);
  } else {
    renderSimpleList(data, type, listEl);
  }
}

function renderWorkflowList(data, listEl) {
  const groups = {
    workflow: { label: 'Workflows', icon: 'bi-diagram-3', items: [] },
    check: { label: 'Checks', icon: 'bi-check2-square', items: [] },
    grouped: { label: 'Grouped Checks', icon: 'bi-collection', items: [] },
  };

  for (const item of data) {
    const section = item.section || 'workflow';
    if (groups[section]) {
      groups[section].items.push(item);
    } else {
      groups.workflow.items.push(item);
    }
  }

  let html = '';
  for (const [, group] of Object.entries(groups)) {
    if (group.items.length === 0) continue;
    html += `<div class="list-group-label"><i class="bi ${group.icon}"></i> ${escapeHtml(group.label)}</div>`;
    for (const item of group.items) {
      const id = item.filename;
      const name = item.name;
      const isActive = currentItem && currentItem.filename === id;
      html += `<div class="list-item${isActive ? ' active' : ''}" data-id="${escapeAttr(id)}" data-name="${escapeAttr(name)}">
        <i class="bi ${group.icon}"></i>
        <span>${escapeHtml(name)}</span>
      </div>`;
    }
  }

  listEl.innerHTML = html;

  listEl.querySelectorAll('.list-item').forEach((el) => {
    el.addEventListener('click', () => selectItem('workflows', el.dataset.id, el.dataset.name));
  });
}

function renderSimpleList(data, type, listEl) {
  const icon = type === 'skills' ? 'bi-lightbulb' : 'bi-terminal';

  listEl.innerHTML = data
    .map((item) => {
      const id = item.filename;
      const name = item.name;
      const isActive = currentItem && currentItem.filename === id;
      return `<div class="list-item${isActive ? ' active' : ''}" data-id="${escapeAttr(id)}" data-name="${escapeAttr(name)}">
        <i class="bi ${icon}"></i>
        <span>${escapeHtml(name)}</span>
      </div>`;
    })
    .join('');

  listEl.querySelectorAll('.list-item').forEach((el) => {
    el.addEventListener('click', () => selectItem(type, el.dataset.id, el.dataset.name));
  });
}

// --- Search Filter ---

document.getElementById('searchInput').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll('#itemList .list-item').forEach((el) => {
    const name = (el.dataset.name || '').toLowerCase();
    el.style.display = name.includes(query) ? '' : 'none';
  });
  // Also hide group labels if all their items are hidden
  document.querySelectorAll('#itemList .list-group-label').forEach((label) => {
    let next = label.nextElementSibling;
    let hasVisible = false;
    while (next && !next.classList.contains('list-group-label')) {
      if (next.classList.contains('list-item') && next.style.display !== 'none') {
        hasVisible = true;
        break;
      }
      next = next.nextElementSibling;
    }
    label.style.display = hasVisible ? '' : 'none';
  });
});

// --- Item Selection ---

async function selectItem(type, id, name) {
  // Mark active
  document.querySelectorAll('#itemList .list-item').forEach((el) => {
    el.classList.toggle('active', el.dataset.id === id);
  });

  currentItem = { type, filename: id, name };

  // Show editor
  document.getElementById('detailEmpty').style.display = 'none';
  document.getElementById('detailEditor').style.display = 'flex';
  document.getElementById('detailEditor').style.flexDirection = 'column';
  document.getElementById('detailEditor').style.flex = '1';
  document.getElementById('detailEditor').style.minHeight = '0';
  document.getElementById('detailFilename').textContent = id;
  document.getElementById('saveStatus').textContent = 'Loading...';

  try {
    const data = await fetchContent(type, id);
    document.getElementById('editorTextarea').value = data.content;
    document.getElementById('saveStatus').textContent = '';

    // Store CLAUDE.md context
    if (data.claudeMdContext) {
      currentItem.claudeMdContext = data.claudeMdContext;
    }
  } catch (err) {
    document.getElementById('editorTextarea').value = '';
    document.getElementById('saveStatus').innerHTML = '<span class="text-danger">Failed to load</span>';
  }
}

function showEmptyDetail() {
  document.getElementById('detailEmpty').style.display = 'flex';
  document.getElementById('detailEditor').style.display = 'none';
}

// --- Save ---

document.getElementById('saveBtn').addEventListener('click', async () => {
  if (!currentItem) return;

  const content = document.getElementById('editorTextarea').value;
  const id = currentItem.filename;
  const statusEl = document.getElementById('saveStatus');
  statusEl.textContent = 'Saving...';

  try {
    const data = await saveContent(currentItem.type, id, content);
    if (data.success) {
      statusEl.innerHTML = '<span class="text-success"><i class="bi bi-check-circle"></i> Saved</span>';
      showToast('Saved successfully!', 'success');
    } else {
      statusEl.innerHTML = '<span class="text-danger"><i class="bi bi-x-circle"></i> Failed</span>';
    }
  } catch (err) {
    statusEl.innerHTML = '<span class="text-danger"><i class="bi bi-x-circle"></i> Error</span>';
    showToast('Save failed.', 'danger');
  }

  setTimeout(() => { statusEl.textContent = ''; }, 3000);
});

// --- New Item (Workflow / Skill / Command) ---

const TEMPLATES = {
  workflows: (slug) => `# ${slug}\n\nDescribe what this workflow does.\n\n## Steps\n\n1. Step one\n2. Step two\n`,
  skills: (slug) => `# ${slug.replace(/-/g, ' ')}\n\nDescribe what this skill covers and when to apply it.\n\n## Rules\n\n- Rule 1\n- Rule 2\n\n## Examples\n\n\`\`\`typescript\n// Example code\n\`\`\`\n`,
  commands: (slug) => `# ${slug.replace(/-/g, ' ')}\n\nDescribe what this command does.\n\n## Usage\n\n\`\`\`\n/${slug} $ARGUMENTS\n\`\`\`\n\n## Workflow\n\n### Step 1: ...\n\n### Step 2: ...\n`,
};

const TYPE_LABELS = {
  workflows: 'Workflow',
  skills: 'Skill',
  commands: 'Command',
};

function updateNewWorkflowButton() {
  const btn = document.getElementById('newWorkflowBtn');
  if (btn) {
    btn.title = `New ${TYPE_LABELS[currentTab] || 'Item'}`;
  }
}

document.getElementById('newWorkflowBtn').addEventListener('click', async () => {
  const typeLabel = TYPE_LABELS[currentTab] || 'Item';
  const name = prompt(`${typeLabel} name (e.g. "my-${currentTab.slice(0, -1)}"):"`);
  if (!name || !name.trim()) return;

  const slug = name.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
  if (!slug) {
    showToast(`Invalid ${typeLabel} name.`, 'danger');
    return;
  }

  try {
    const template = (TEMPLATES[currentTab] || TEMPLATES.workflows)(slug);
    const result = await createItem(currentTab, slug, template);
    if (result.success) {
      showToast(`${typeLabel} "${slug}" created!`, 'success');
      await loadList(currentTab);
      selectItem(currentTab, result.filename, slug);

      // Offer LLM auto-linking for skills and commands
      if (currentTab === 'skills' || currentTab === 'commands') {
        offerLlmLinking(currentTab, result.filename, slug);
      }
    } else {
      showToast(`Failed to create ${typeLabel}.`, 'danger');
    }
  } catch (err) {
    showToast(`Error: ${err.message}`, 'danger');
  }
});

// --- LLM Auto-Linking ---

async function offerLlmLinking(type, filename, name) {
  // Auto-open chat with a linking prompt
  if (!currentItem) return;

  document.getElementById('chatSidebarTitle').textContent = `Link: ${name}`;
  document.getElementById('chatSidebar').style.display = 'flex';
  document.body.classList.add('chat-open');

  // Add system message explaining what's happening
  const msgsEl = document.getElementById('chatMessages');
  msgsEl.innerHTML = '';

  const systemMsg = document.createElement('div');
  systemMsg.className = 'chat-msg chat-system';
  systemMsg.innerHTML = `Neuer ${TYPE_LABELS[type]} <strong>${name}</strong> erstellt.<br>` +
    'Ich kann diesen automatisch in die relevanten Workflows und CLAUDE.md einbinden.<br><br>' +
    '<em>Beschreibe zuerst im Editor, was dieser ' + TYPE_LABELS[type] + ' macht, dann klick "Auto-Link".</em>';
  msgsEl.appendChild(systemMsg);

  // Add auto-link button
  const linkBtn = document.createElement('button');
  linkBtn.className = 'maui-btn maui-btn-primary maui-btn-sm mt-2';
  linkBtn.innerHTML = '<i class="bi bi-link-45deg"></i> Auto-Link in Workflows + CLAUDE.md';
  linkBtn.onclick = () => triggerAutoLink(type, filename, name);
  msgsEl.appendChild(linkBtn);
}

// --- Delete Item ---

document.getElementById('deleteItemBtn').addEventListener('click', async () => {
  if (!currentItem) return;

  const typeLabel = TYPE_LABELS[currentItem.type] || 'Item';
  const confirmed = confirm(
    `${typeLabel} "${currentItem.name}" wirklich löschen?\n\n` +
    `Die Datei ${currentItem.filename} wird gelöscht und alle Referenzen ` +
    `aus CLAUDE.md und Workflows werden entfernt.`
  );
  if (!confirmed) return;

  try {
    const result = await deleteItem(currentItem.type, currentItem.filename);
    if (result.success) {
      showToast(`${typeLabel} "${currentItem.name}" gelöscht.`, 'success');
      currentItem = null;
      showEmptyDetail();
      await loadList(currentTab);
    } else {
      showToast(`Löschen fehlgeschlagen.`, 'danger');
    }
  } catch (err) {
    showToast(`Fehler: ${err.message}`, 'danger');
  }
});

// --- LLM Auto-Link Trigger ---

async function triggerAutoLink(type, filename, name) {
  const editorContent = document.getElementById('editorTextarea').value || '';

  if (!editorContent || editorContent.length < 50) {
    showToast('Bitte zuerst den Inhalt im Editor beschreiben (mind. 50 Zeichen).', 'warning');
    return;
  }

  addChatBubble('Auto-Link starten...', 'user');

  // Show typing indicator
  const typingEl = document.createElement('div');
  typingEl.className = 'chat-msg chat-assistant chat-typing';
  typingEl.innerHTML = '<span></span><span></span><span></span>';
  const messagesEl = document.getElementById('chatMessages');
  messagesEl.appendChild(typingEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  const typeLabel = TYPE_LABELS[type] || 'Item';

  // Build a prompt that asks the LLM to suggest linking changes
  const linkingPrompt = `Ich habe einen neuen ${typeLabel} "${name}" erstellt mit folgendem Inhalt:

\`\`\`markdown
${editorContent}
\`\`\`

Bitte analysiere:
1. In welchen bestehenden Workflows (Commands) sollte dieser ${typeLabel} referenziert werden?
2. Sollte er in CLAUDE.md erwähnt werden? Wenn ja, wo genau?
3. Welche bestehenden Skills/Commands sind verwandt?

Gib konkrete Vorschläge, welche Dateien wie geändert werden sollten.
Falls du Änderungen vorschlägst, zeige sie als \`\`\`markdown Code-Blocks.`;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reqId: `link:${name}`,
        message: linkingPrompt,
        requirementContent: editorContent,
        planContent: '',
      }),
    });

    typingEl.remove();

    const bubble = addChatBubble('', 'assistant');
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        try {
          const evt = JSON.parse(line.slice(6));
          if (evt.type === 'chunk') {
            fullText += evt.text;
            bubble.innerHTML = renderMarkdown(fullText);
            messagesEl.scrollTop = messagesEl.scrollHeight;
          }
        } catch { /* ignore */ }
      }
    }

    bubble.innerHTML = renderMarkdown(fullText);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // Offer to apply markdown code blocks
    if (fullText.includes('```markdown') || fullText.includes('```md')) {
      const applyBtn = document.createElement('button');
      applyBtn.className = 'maui-btn maui-btn-success maui-btn-sm mt-2';
      applyBtn.innerHTML = '<i class="bi bi-arrow-down-circle"></i> Apply to Editor';
      applyBtn.onclick = () => {
        const codeMatch = fullText.match(/```(?:markdown|md)\n([\s\S]*?)```/);
        if (codeMatch) {
          document.getElementById('editorTextarea').value = codeMatch[1].trim();
          applyBtn.innerHTML = '<i class="bi bi-check"></i> Applied!';
          applyBtn.disabled = true;
        }
      };
      bubble.appendChild(applyBtn);
    }
  } catch (err) {
    typingEl.remove();
    addChatBubble(`Fehler: ${err.message}`, 'system');
  }
}

// --- Chat ---

document.getElementById('chatBtn').addEventListener('click', () => {
  if (!currentItem) return;
  document.getElementById('chatSidebarTitle').textContent = currentItem.name || '';
  document.getElementById('chatSidebar').style.display = 'flex';
  document.body.classList.add('chat-open');
  document.getElementById('chatInput').focus();
});

document.getElementById('chatCloseBtn').addEventListener('click', () => {
  document.getElementById('chatSidebar').style.display = 'none';
  document.body.classList.remove('chat-open');
});

document.getElementById('chatClearBtn').addEventListener('click', () => {
  document.getElementById('chatMessages').innerHTML =
    '<div class="chat-msg chat-system">Frag mich etwas zu diesem Skill, Command oder Workflow.</div>';
});

document.getElementById('chatSendBtn').addEventListener('click', sendChatMessage);

document.getElementById('chatInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChatMessage();
  }
});

async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message || !currentItem) return;

  input.value = '';
  addChatBubble(message, 'user');

  // Typing indicator
  const typingEl = document.createElement('div');
  typingEl.className = 'chat-msg chat-assistant chat-typing';
  typingEl.innerHTML = '<span></span><span></span><span></span>';
  const messagesEl = document.getElementById('chatMessages');
  messagesEl.appendChild(typingEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  const editorContent = document.getElementById('editorTextarea').value || '';
  const itemName = currentItem.name || currentItem.filename || '';
  const claudeMdContext = currentItem.claudeMdContext || '';

  // Build context-enriched message — always include editor content + CLAUDE.md context
  let enrichedContent = `--- ${currentItem.type}: ${currentItem.filename} ---\n${editorContent}`;
  if (claudeMdContext) {
    enrichedContent = `--- CLAUDE.md Context ---\n${claudeMdContext}\n\n${enrichedContent}`;
  }

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reqId: `skill:${itemName}`,
        message,
        requirementContent: enrichedContent,
        planContent: '',
      }),
    });

    typingEl.remove();

    const bubble = addChatBubble('', 'assistant');
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        try {
          const evt = JSON.parse(line.slice(6));
          if (evt.type === 'chunk') {
            fullText += evt.text;
            bubble.innerHTML = renderMarkdown(fullText);
            messagesEl.scrollTop = messagesEl.scrollHeight;
          }
        } catch { /* ignore */ }
      }
    }

    bubble.innerHTML = renderMarkdown(fullText);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // Offer to apply markdown code blocks to editor
    if (fullText.includes('```markdown') || fullText.includes('```md')) {
      const applyBtn = document.createElement('button');
      applyBtn.className = 'maui-btn maui-btn-success maui-btn-sm mt-2';
      applyBtn.innerHTML = '<i class="bi bi-arrow-down-circle"></i> Apply to Editor';
      applyBtn.onclick = () => {
        const codeMatch = fullText.match(/```(?:markdown|md)\n([\s\S]*?)```/);
        if (codeMatch) {
          document.getElementById('editorTextarea').value = codeMatch[1].trim();
          applyBtn.innerHTML = '<i class="bi bi-check"></i> Applied!';
          applyBtn.disabled = true;
        }
      };
      bubble.appendChild(applyBtn);
    }
  } catch (err) {
    typingEl.remove();
    addChatBubble(`Fehler: ${err.message}`, 'system');
  }
}

function addChatBubble(text, role) {
  const msgsEl = document.getElementById('chatMessages');
  const bubble = document.createElement('div');
  bubble.className = `chat-msg chat-${role}`;
  bubble.innerHTML = role === 'user' ? escapeHtml(text) : renderMarkdown(text);
  msgsEl.appendChild(bubble);
  msgsEl.scrollTop = msgsEl.scrollHeight;
  return bubble;
}

// --- Helpers ---

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderMarkdown(text) {
  let html = escapeHtml(text);
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code style="background:#e9ecef;padding:0.1em 0.3em;border-radius:3px;font-size:0.85em">$1</code>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\n/g, '<br>');
  return html;
}

function showToast(message, type = 'primary') {
  const toastEl = document.getElementById('statusToast');
  const body = document.getElementById('toastBody');
  body.textContent = message;
  toastEl.className = `toast text-bg-${type}`;
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2500 });
  toast.show();
}

// --- Speech-to-Text ---

function createSpeechRecognizer(textareaId, micButtonId) {
  const btn = document.getElementById(micButtonId);
  const textarea = document.getElementById(textareaId);
  if (!btn || !textarea) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    btn.disabled = true;
    btn.title = 'Spracheingabe wird in diesem Browser nicht unterstuetzt';
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'de-DE';
  recognition.continuous = true;
  recognition.interimResults = false;

  let isRecording = false;

  btn.addEventListener('click', () => {
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  });

  recognition.onstart = () => {
    isRecording = true;
    btn.classList.add('recording');
    btn.querySelector('i').className = 'bi bi-mic-fill';
  };

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        transcript += event.results[i][0].transcript;
      }
    }
    if (transcript) {
      const current = textarea.value;
      textarea.value = current + (current && !current.endsWith(' ') ? ' ' : '') + transcript;
    }
  };

  recognition.onerror = (event) => {
    if (event.error === 'not-allowed') {
      showToast('Mikrofon-Zugriff verweigert.', 'danger');
    } else if (event.error === 'no-speech') {
      showToast('Keine Sprache erkannt.', 'warning');
    } else {
      showToast(`Spracherkennung-Fehler: ${event.error}`, 'danger');
    }
  };

  recognition.onend = () => {
    isRecording = false;
    btn.classList.remove('recording');
    btn.querySelector('i').className = 'bi bi-mic';
  };
}

createSpeechRecognizer('chatInput', 'chatMicBtn');

// --- Init ---

(async function init() {
  try {
    updateNewWorkflowButton();
    await loadList('workflows');
  } catch (err) {
    showToast('Failed to initialize.', 'danger');
  }
})();

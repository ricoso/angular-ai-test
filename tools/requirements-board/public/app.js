/* Requirements Board — Vanilla JS + Bootstrap + SortableJS */

const API = '/api/requirements';
const POLL_INTERVAL = 60000;

let requirements = [];
let pollTimer = null;

// --- API ---

async function fetchRequirements() {
  const res = await fetch(API);
  return res.json();
}

async function createRequirementWithFiles(formData) {
  const res = await fetch(API, {
    method: 'POST',
    body: formData
  });
  return res.json();
}

async function updateStatus(id, status) {
  const res = await fetch(`${API}/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return res.json();
}

// --- Workflow API (SSE streaming) ---

function triggerWorkflow(type, reqId) {
  return new Promise((resolve) => {
    openLogPanel(reqId);

    fetch(`/api/workflow/${type}/${reqId}`, { method: 'POST' })
      .then(async (res) => {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

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
              if (evt.type === 'log') {
                appendLog(evt.message);
              } else if (evt.type === 'done') {
                appendLog(evt.success ? '✓ Workflow finished.' : '✗ Workflow failed.');
                finishLog(evt.success);
                resolve(evt);
              }
            } catch (e) { /* ignore parse errors */ }
          }
        }
        resolve({ success: true });
      })
      .catch((err) => {
        appendLog(`ERROR: ${err.message}`);
        finishLog(false);
        resolve({ success: false, message: err.message });
      });
  });
}

function openLogPanel(reqId) {
  document.getElementById('logReqId').textContent = reqId;
  document.getElementById('logOutput').innerHTML = '';
  document.getElementById('logSpinner').style.display = 'inline-block';
  document.getElementById('logPanel').style.display = 'flex';
  document.body.classList.add('log-open');
}

function appendLog(message) {
  const el = document.getElementById('logOutput');
  let cls = '';
  if (message.includes('✓') || message.includes('success') || message.includes('completed')) cls = 'log-line-success';
  else if (message.includes('✗') || message.includes('ERROR') || message.includes('[stderr]')) cls = 'log-line-error';
  else if (message.includes('→') || message.includes('Step') || message.includes('...')) cls = 'log-line-info';

  el.innerHTML += cls ? `<span class="${cls}">${escapeHtml(message)}</span>\n` : escapeHtml(message) + '\n';
  el.scrollTop = el.scrollHeight;
}

function finishLog(success) {
  document.getElementById('logSpinner').style.display = 'none';
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

document.getElementById('logCloseBtn').addEventListener('click', () => {
  document.getElementById('logPanel').style.display = 'none';
  document.body.classList.remove('log-open');
});

// --- Plan Mode (before implement) ---

function triggerPlan(reqId, reqSlug) {
  openLogPanel(reqId + ' — Plan');

  fetch(`/api/workflow/plan/${reqSlug}`, { method: 'POST' })
    .then(async (res) => {
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
              document.getElementById('logOutput').innerHTML = renderMarkdownLog(fullText);
              document.getElementById('logOutput').scrollTop = document.getElementById('logOutput').scrollHeight;
            } else if (evt.type === 'done') {
              finishLog(evt.success);
              showPlanActions(reqSlug);
            }
          } catch (e) { /* ignore */ }
        }
      }
    })
    .catch((err) => {
      appendLog(`ERROR: ${err.message}`);
      finishLog(false);
    });
}

function showPlanActions(reqSlug) {
  const logEl = document.getElementById('logOutput');

  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'log-actions';
  actionsDiv.innerHTML = `
    <button class="btn btn-success btn-sm" id="planAcceptBtn">
      <i class="bi bi-check-lg"></i> Accept & Implement
    </button>
    <button class="btn btn-danger btn-sm" id="planRejectBtn">
      <i class="bi bi-x-lg"></i> Reject
    </button>
  `;
  logEl.appendChild(actionsDiv);
  logEl.scrollTop = logEl.scrollHeight;

  document.getElementById('planAcceptBtn').addEventListener('click', () => {
    actionsDiv.remove();
    appendLog('');
    appendLog('═══════════════════════════════════════');
    appendLog('  ▶ Starting implementation...');
    appendLog('═══════════════════════════════════════');
    appendLog('');
    document.getElementById('logSpinner').style.display = 'inline-block';
    triggerWorkflow('implement', reqSlug);
  });

  document.getElementById('planRejectBtn').addEventListener('click', () => {
    actionsDiv.innerHTML = '<span style="color:#f44747">✗ Plan rejected. Drag back to To-Do to reset.</span>';
  });
}

function renderMarkdownLog(text) {
  let html = escapeHtml(text);
  // Headers
  html = html.replace(/^(#{1,3}) (.+)$/gm, (_, hashes, content) => {
    const lvl = hashes.length;
    const size = lvl === 1 ? '1.1em' : lvl === 2 ? '1em' : '0.9em';
    return `<span style="color:#569cd6;font-size:${size};font-weight:bold">${content}</span>`;
  });
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#4ec9b0">$1</strong>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code style="background:#333;padding:0.1em 0.3em;border-radius:3px;color:#ce9178">$1</code>');
  // List items
  html = html.replace(/^(\s*[-*] .+)$/gm, '<span style="color:#d4d4d4">$1</span>');
  // Numbered items
  html = html.replace(/^(\s*\d+\. .+)$/gm, '<span style="color:#d4d4d4">$1</span>');
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  return html;
}

// --- Column mapping ---

const COLUMN_STATUS = {
  'todo': 'Draft',
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  'done': 'Implemented'
};

// --- Render ---

function renderBoard(reqs) {
  requirements = reqs;

  const columns = {
    'todo': [],
    'in-progress': [],
    'in-review': [],
    'done': []
  };

  reqs.forEach(r => {
    if (columns[r.column]) {
      columns[r.column].push(r);
    }
  });

  Object.entries(columns).forEach(([colId, items]) => {
    const el = document.getElementById(`col-${colId}`);
    el.innerHTML = items.map(r => renderCard(r)).join('');

    const countEl = document.getElementById(`count-${colId}`);
    if (countEl) countEl.textContent = items.length;
  });
}

function renderCard(req) {
  const desc = req.description.length > 100
    ? req.description.substring(0, 100) + '...'
    : req.description;

  const priorityClass = `priority-${req.priority.toLowerCase()}`;
  const label = req.label || 'User Story';
  const labelClass = label === 'Technical Story' ? 'badge-label-tech' : 'badge-label-user';

  let badges = '';

  const prioColor = req.priority === 'High' ? 'danger' : req.priority === 'Medium' ? 'warning' : 'success';
  badges += `<span class="badge bg-${prioColor}">${req.priority}</span>`;
  badges += `<span class="badge ${labelClass}">${label}</span>`;

  if (req.metadata && req.metadata.tags && req.metadata.tags.length) {
    req.metadata.tags.forEach(tag => {
      badges += `<span class="badge bg-secondary">${tag}</span>`;
    });
  }

  if (req.attachments && req.attachments.length > 0) {
    badges += `<span class="badge badge-attachment"><i class="bi bi-paperclip"></i> ${req.attachments.length}</span>`;
  }

  if (req.metadata && req.metadata.prNumber) {
    badges += `<span class="badge bg-info text-dark"><i class="bi bi-git"></i> #${req.metadata.prNumber}</span>`;
  }

  return `
    <div class="req-card ${priorityClass}" data-id="${req.id}" onclick="openEdit('${req.id}')">
      <div class="card-id">${req.id}</div>
      <div class="card-title">${req.name}</div>
      <div class="card-desc">${desc}</div>
      <div class="card-badges">${badges}</div>
    </div>
  `;
}

// --- Drag & Drop (SortableJS) ---

function initSortable() {
  ['todo', 'in-progress', 'in-review', 'done'].forEach(colId => {
    const el = document.getElementById(`col-${colId}`);

    new Sortable(el, {
      group: 'board',
      animation: 200,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      onEnd: async function(evt) {
        const cardEl = evt.item;
        const reqId = cardEl.dataset.id;
        const targetCol = evt.to.dataset.column;

        if (!targetCol || !reqId) return;

        const newStatus = COLUMN_STATUS[targetCol];
        if (!newStatus) return;

        showToast(`Moving ${reqId} → ${newStatus}...`);

        try {
          await updateStatus(reqId, newStatus);

          // Generate plan when moved to "In Progress"
          if (newStatus === 'In Progress') {
            const req = requirements.find(r => r.id === reqId);
            const reqSlug = req ? `${req.id}-${req.name}` : reqId;
            showToast(`Generating plan for ${reqId}...`, 'primary');
            triggerPlan(reqId, reqSlug);
          }

          const reqs = await fetchRequirements();
          renderBoard(reqs);
          initSortable();
          showToast(`${reqId} updated to ${newStatus}`, 'success');
        } catch (err) {
          showToast('Failed to update status', 'danger');
          const reqs = await fetchRequirements();
          renderBoard(reqs);
          initSortable();
        }
      }
    });
  });
}

// --- Create with file upload ---

document.getElementById('createSubmitBtn').addEventListener('click', async () => {
  const title = document.getElementById('createTitle').value.trim();
  const description = document.getElementById('createDescription').value.trim();
  const priority = document.getElementById('createPriority').value;
  const label = document.getElementById('createLabel').value;
  const tagsRaw = document.getElementById('createTags').value.trim();
  const fileInput = document.getElementById('createFiles');

  if (!title || !description) {
    showToast('Title and Description are required.', 'danger');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('priority', priority);
  formData.append('label', label);
  formData.append('tags', tagsRaw);

  if (fileInput.files.length > 0) {
    for (const file of fileInput.files) {
      formData.append('files', file);
    }
  }

  try {
    const created = await createRequirementWithFiles(formData);
    const reqs = await fetchRequirements();
    renderBoard(reqs);
    initSortable();

    document.getElementById('createForm').reset();
    bootstrap.Modal.getInstance(document.getElementById('createModal')).hide();
    showToast('Requirement created! Running scaffold...', 'success');

    // Trigger create workflow with log panel
    const reqSlug = `${created.id}-${title}`;
    triggerWorkflow('create', reqSlug);
  } catch (err) {
    showToast('Failed to create requirement.', 'danger');
  }
});

// --- Edit (view details + requirement.md editor) ---

let currentEditReqId = null;

function openEdit(reqId) {
  const req = requirements.find(r => r.id === reqId);
  if (!req) return;
  currentEditReqId = reqId;

  document.getElementById('editReqId').textContent = `${req.id} — ${req.name}`;
  document.getElementById('editTitle').value = req.name;
  document.getElementById('editDescription').value = req.description;
  document.getElementById('editPriority').value = req.priority;
  document.getElementById('editLabel').value = req.label || 'User Story';
  document.getElementById('editStatus').value = req.status;
  document.getElementById('editDeps').value = req.dependencies.length ? req.dependencies.join(', ') : 'None';

  // Reset requirement.md tab
  document.getElementById('reqContentLoading').style.display = 'block';
  document.getElementById('reqContentEmpty').style.display = 'none';
  document.getElementById('reqContentEditor').style.display = 'none';
  document.getElementById('reqSaveStatus').textContent = '';

  // Load requirement.md content
  loadRequirementContent(reqId);

  // Attachments
  const attachNav = document.getElementById('tabAttachmentsNav');
  const attachEl = document.getElementById('editAttachments');
  const previewSection = document.getElementById('editPreviewSection');
  const previewEl = document.getElementById('editPreview');

  attachEl.innerHTML = '';
  previewEl.innerHTML = '';
  previewSection.style.display = 'none';

  if (req.attachments && req.attachments.length > 0) {
    attachNav.style.display = 'block';

    let hasPreview = false;

    req.attachments.forEach(a => {
      const filename = a.includes('/') ? a.split('/').pop() : a;
      const url = `${API}/${req.id}/attachments/${encodeURIComponent(filename)}`;
      const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename);
      const isHtml = /\.html$/i.test(filename);

      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'btn btn-sm btn-outline-secondary';
      link.innerHTML = `<i class="bi ${isImage ? 'bi-image' : isHtml ? 'bi-filetype-html' : 'bi-file-earmark'}"></i> ${filename}`;
      attachEl.appendChild(link);

      if (isImage && !hasPreview) {
        hasPreview = true;
        previewSection.style.display = 'block';
        const img = document.createElement('img');
        img.src = url;
        img.className = 'img-fluid rounded border mt-1';
        img.style.maxHeight = '300px';
        img.style.cursor = 'pointer';
        img.title = 'Click to open in new tab';
        img.onclick = () => window.open(url, '_blank');
        previewEl.appendChild(img);
      }

      if (isHtml) {
        hasPreview = true;
        previewSection.style.display = 'block';
        const btn = document.createElement('a');
        btn.href = url;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.className = 'btn btn-primary mt-2 d-block';
        btn.innerHTML = '<i class="bi bi-box-arrow-up-right"></i> Open Mockup in New Tab';
        previewEl.appendChild(btn);
      }
    });
  } else {
    attachNav.style.display = 'none';
  }

  new bootstrap.Modal(document.getElementById('editModal')).show();
}

async function loadRequirementContent(reqId) {
  try {
    const res = await fetch(`${API}/${reqId}/content`);
    const data = await res.json();

    document.getElementById('reqContentLoading').style.display = 'none';

    if (data.content !== undefined) {
      document.getElementById('reqContentEditor').style.display = 'block';
      document.getElementById('editReqContent').value = data.content;
    } else {
      document.getElementById('reqContentEmpty').style.display = 'block';
    }
  } catch {
    document.getElementById('reqContentLoading').style.display = 'none';
    document.getElementById('reqContentEmpty').style.display = 'block';
  }
}

document.getElementById('saveReqContentBtn').addEventListener('click', async () => {
  if (!currentEditReqId) return;

  const content = document.getElementById('editReqContent').value;
  const statusEl = document.getElementById('reqSaveStatus');
  statusEl.textContent = 'Saving...';

  try {
    const res = await fetch(`${API}/${currentEditReqId}/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    const data = await res.json();
    if (data.success) {
      statusEl.innerHTML = '<span class="text-success"><i class="bi bi-check-circle"></i> Saved</span>';
    } else {
      statusEl.innerHTML = '<span class="text-danger"><i class="bi bi-x-circle"></i> Failed</span>';
    }
  } catch {
    statusEl.innerHTML = '<span class="text-danger"><i class="bi bi-x-circle"></i> Error</span>';
  }

  setTimeout(() => { statusEl.textContent = ''; }, 3000);
});

// --- Chat ---

async function sendChatMessage() {
  const input = document.getElementById('chatSidebarInput');
  const message = input.value.trim();
  if (!message || !currentEditReqId) return;

  input.value = '';
  addChatBubble(message, 'user');

  // Typing indicator
  const typingEl = document.createElement('div');
  typingEl.className = 'chat-msg chat-assistant chat-typing';
  typingEl.innerHTML = '<span></span><span></span><span></span>';
  const messagesEl = document.getElementById('chatSidebarMessages');
  messagesEl.appendChild(typingEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  const requirementContent = document.getElementById('editReqContent').value || '';

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reqId: currentEditReqId,
        message,
        requirementContent
      })
    });

    // Remove typing indicator
    typingEl.remove();

    // Create assistant bubble and stream into it
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

    // Check if response contains a markdown code block — offer to apply
    if (fullText.includes('```markdown') || fullText.includes('```md')) {
      const applyBtn = document.createElement('button');
      applyBtn.className = 'btn btn-sm btn-success mt-2';
      applyBtn.innerHTML = '<i class="bi bi-arrow-down-circle"></i> Apply to Editor';
      applyBtn.onclick = () => {
        const codeMatch = fullText.match(/```(?:markdown|md)\n([\s\S]*?)```/);
        if (codeMatch) {
          document.getElementById('editReqContent').value = codeMatch[1].trim();
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
  const msgsEl = document.getElementById('chatSidebarMessages');
  const bubble = document.createElement('div');
  bubble.className = `chat-msg chat-${role}`;
  bubble.innerHTML = role === 'user' ? escapeHtml(text) : renderMarkdown(text);
  msgsEl.appendChild(bubble);
  msgsEl.scrollTop = msgsEl.scrollHeight;
  return bubble;
}

function renderMarkdown(text) {
  // Minimal markdown: code blocks, bold, inline code
  let html = escapeHtml(text);
  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code style="background:#e9ecef;padding:0.1em 0.3em;border-radius:3px;font-size:0.85em">$1</code>');
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  return html;
}

// Sidebar chat event listeners
document.getElementById('chatSidebarSendBtn').addEventListener('click', sendChatMessage);

document.getElementById('chatSidebarInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChatMessage();
  }
});

document.getElementById('chatSidebarClearBtn').addEventListener('click', () => {
  document.getElementById('chatSidebarMessages').innerHTML =
    '<div class="chat-msg chat-system">Frag mich etwas zum Requirement oder sag mir was ich ändern soll.</div>';
});

document.getElementById('openChatSidebarBtn').addEventListener('click', () => {
  openChatSidebar();
});

document.getElementById('chatSidebarCloseBtn').addEventListener('click', () => {
  document.getElementById('chatSidebar').style.display = 'none';
  document.body.classList.remove('chat-open');
});

function openChatSidebar() {
  document.getElementById('chatSidebarReqId').textContent = currentEditReqId || '';
  document.getElementById('chatSidebar').style.display = 'flex';
  document.body.classList.add('chat-open');
  document.getElementById('chatSidebarInput').focus();
}

// --- Toast ---

function showToast(message, type = 'primary') {
  const toastEl = document.getElementById('statusToast');
  const body = document.getElementById('toastBody');
  body.textContent = message;
  toastEl.className = `toast text-bg-${type}`;
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2500 });
  toast.show();
}

// --- Polling ---

function startPolling() {
  pollTimer = setInterval(async () => {
    try {
      const reqs = await fetchRequirements();
      renderBoard(reqs);
    } catch (err) {
      console.debug('Polling failed:', err);
    }
  }, POLL_INTERVAL);
}

// --- Refresh ---

document.getElementById('refreshBtn').addEventListener('click', async () => {
  try {
    const reqs = await fetchRequirements();
    renderBoard(reqs);
    initSortable();
    showToast('Refreshed!', 'success');
  } catch (err) {
    showToast('Refresh failed.', 'danger');
  }
});

// --- Init ---

(async function init() {
  try {
    const reqs = await fetchRequirements();
    renderBoard(reqs);
    initSortable();
    startPolling();
  } catch (err) {
    showToast('Failed to load board.', 'danger');
    console.error(err);
  }
})();

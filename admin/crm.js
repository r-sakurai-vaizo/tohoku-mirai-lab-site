const STORAGE_KEY = "mirai-lab-rich-crm-v1";

const STATUS_LABELS = {
  DRAFT: "下書き",
  REVIEW_REQUESTED: "レビュー中",
  NEEDS_REVISION: "差し戻し",
  APPROVED: "承認済み",
  SCHEDULED: "公開予約",
  PUBLISHED: "公開済み",
  UNPUBLISHED: "公開停止",
  ARCHIVED: "アーカイブ",
};

const ROLE_RULES = {
  Admin: ["create", "edit", "review", "publish", "users", "delete"],
  Reviewer: ["create", "edit", "review", "publish"],
  Editor: ["create", "edit", "requestReview"],
  Contributor: ["create"],
  Viewer: [],
};

const FIELD_CONFIGS = {
  activity: [
    ["title", "タイトル", "input", "未来探求インタビュー"],
    ["category", "種別", "select", ["取材", "問いの実践", "社会課題PJ", "記録化"]],
    ["summary", "概要", "textarea", "公開ページに出す短い説明"],
    ["body", "本文メモ", "textarea", "運営用の補足や公開候補の本文"],
    ["owner", "担当", "input", "編集担当"],
  ],
  record: [
    ["title", "タイトル", "input", "活動レポートのタイトル"],
    ["type", "種別", "select", ["活動レポート", "記事", "ショート動画", "制作メモ"]],
    ["summary", "概要", "textarea", "公開ページに出す短い説明"],
    ["body", "本文", "textarea", "記録本文"],
    ["owner", "担当", "input", "編集担当"],
  ],
  media: [
    ["title", "素材名", "input", "青葉山キャンパス外観"],
    ["fileUrl", "URL", "input", "https://"],
    ["altText", "alt", "input", "画像の説明"],
    ["credit", "クレジット", "input", "撮影者または出典"],
    ["usageScope", "利用範囲", "select", ["INTERNAL", "PUBLIC_ALLOWED", "PUBLIC_RESTRICTED"]],
  ],
  user: [
    ["name", "名前", "input", "運営メンバー"],
    ["email", "メール", "input", "member@example.com"],
    ["role", "ロール", "select", ["Admin", "Reviewer", "Editor", "Contributor", "Viewer"]],
  ],
};

const seedState = {
  role: "Admin",
  filters: {
    activities: { query: "", status: "ALL" },
    records: { query: "", status: "ALL" },
  },
  activities: [
    {
      id: "act_001",
      title: "未来探求インタビュー",
      category: "取材",
      summary: "未来を変えようとしている人、企業、研究者、地域の現場に会い、問いと実践を取材して記録します",
      body: "成果だけではなく、なぜ取り組むのか、何に迷い、何を残したいのかを聞き、社会に共有できる記録へ整えます",
      owner: "編集担当",
      status: "DRAFT",
      visibility: "PUBLIC",
      updatedAt: "2026-07-05",
    },
    {
      id: "act_002",
      title: "問いの実践ゼミ",
      category: "問いの実践",
      summary: "問いを深め、相手に確かめるための制作環境として扱います",
      body: "現場から聞いた問いを小さな実装へ変える場として運用します",
      owner: "共同代表",
      status: "REVIEW_REQUESTED",
      visibility: "PUBLIC",
      updatedAt: "2026-07-05",
    },
  ],
  records: [
    {
      id: "rec_001",
      title: "第1回 問いの実践ゼミ",
      type: "活動レポート",
      summary: "現場から聞いた問いを小さな実装へ変えるための記録を残します",
      body: "活動の背景、問い、試作、次に確かめることを記録します",
      owner: "編集担当",
      status: "DRAFT",
      visibility: "PUBLIC",
      updatedAt: "2026-07-05",
    },
    {
      id: "rec_002",
      title: "社会課題プロジェクト設計メモ",
      type: "制作メモ",
      summary: "聞き取り、課題整理、制作、確認、記録化までを小さく回すための設計メモ",
      body: "公開前の検討内容を整理します",
      owner: "共同代表",
      status: "APPROVED",
      visibility: "PUBLIC",
      updatedAt: "2026-07-05",
    },
  ],
  media: [
    {
      id: "med_001",
      title: "青葉山キャンパス",
      fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Aobayama%20New%20Campus%2C%20Tohoku%20University%2C%201st%20Nov%202025%E2%91%A0.jpg",
      altText: "東北大学青葉山新キャンパスの風景",
      credit: "Wikimedia Commons",
      usageScope: "PUBLIC_ALLOWED",
      status: "AVAILABLE",
      updatedAt: "2026-07-05",
    },
    {
      id: "med_002",
      title: "内部メモ画像",
      fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Tohoku_university_-_Central_Library.JPG",
      altText: "東北大学附属図書館の外観",
      credit: "Wikimedia Commons",
      usageScope: "INTERNAL",
      status: "RESTRICTED",
      updatedAt: "2026-07-05",
    },
  ],
  reviews: [
    {
      id: "rev_001",
      targetType: "activity",
      targetId: "act_002",
      title: "問いの実践ゼミ",
      status: "REQUESTED",
      reviewer: "Reviewer",
      checklist: ["個人情報", "大学公式誤認", "画像権利"],
      updatedAt: "2026-07-05",
    },
  ],
  users: [
    { id: "usr_001", name: "共同代表", email: "lead@example.com", role: "Admin", status: "ACTIVE" },
    { id: "usr_002", name: "編集担当", email: "editor@example.com", role: "Editor", status: "ACTIVE" },
    { id: "usr_003", name: "レビュー担当", email: "reviewer@example.com", role: "Reviewer", status: "ACTIVE" },
  ],
  logs: [
    {
      id: "log_001",
      actor: "System",
      action: "CRM_INITIALIZED",
      target: "system",
      detail: "初期データを作成",
      createdAt: "2026-07-05 00:00",
    },
  ],
};

let state = loadState();
let activeView = "dashboard";
let editorContext = null;

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function nowLabel() {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : clone(seedState);
  } catch (error) {
    return clone(seedState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function can(action) {
  return ROLE_RULES[state.role]?.includes(action);
}

function pushLog(action, target, detail) {
  state.logs.unshift({
    id: `log_${Date.now()}`,
    actor: state.role,
    action,
    target,
    detail,
    createdAt: nowLabel(),
  });
  state.logs = state.logs.slice(0, 200);
}

function alertMessage(message, type = "info") {
  const target = document.querySelector("[data-crm-alert]");
  if (!target) return;
  target.hidden = false;
  target.dataset.type = type;
  target.textContent = message;
  window.setTimeout(() => {
    target.hidden = true;
  }, 2600);
}

function collectionFor(kind) {
  if (kind === "activity") return state.activities;
  if (kind === "record") return state.records;
  if (kind === "media") return state.media;
  if (kind === "user") return state.users;
  return [];
}

function collectionName(kind) {
  if (kind === "activity") return "activities";
  if (kind === "record") return "records";
  if (kind === "media") return "media";
  if (kind === "user") return "users";
  return "";
}

function findTarget(targetType, targetId) {
  return collectionFor(targetType).find((item) => item.id === targetId);
}

function render() {
  document.querySelector("[data-current-role]").textContent = state.role;
  document.querySelector("[data-role-switch]").value = state.role;
  document.querySelector("[data-view-title]").textContent = viewLabel(activeView);
  renderDashboard();
  renderActivities();
  renderRecords();
  renderMedia();
  renderReviews();
  renderPublishing();
  renderUsers();
  renderLogs();
  saveState();
}

function viewLabel(view) {
  return {
    dashboard: "ダッシュボード",
    activities: "活動",
    records: "記録",
    media: "素材",
    reviews: "レビュー",
    publishing: "公開管理",
    users: "ユーザー",
    logs: "監査ログ",
  }[view];
}

function setView(view) {
  activeView = view;
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });
  document.querySelectorAll("[data-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === view);
  });
  render();
}

function renderDashboard() {
  const metrics = [
    ["活動", state.activities.length],
    ["記録", state.records.length],
    ["レビュー待ち", state.reviews.filter((item) => item.status === "REQUESTED").length],
    ["公開済み", [...state.activities, ...state.records].filter((item) => item.status === "PUBLISHED").length],
  ];
  document.querySelector("[data-dashboard-metrics]").innerHTML = metrics
    .map(
      ([label, value]) => `
        <article class="crm-metric">
          <span>${escapeHTML(label)}</span>
          <strong>${escapeHTML(value)}</strong>
        </article>
      `,
    )
    .join("");

  const queue = state.reviews.filter((item) => item.status === "REQUESTED");
  document.querySelector("[data-review-queue]").innerHTML =
    queue.length === 0
      ? '<p class="loading">レビュー待ちはありません</p>'
      : queue.map(renderReviewCard).join("");

  document.querySelector("[data-recent-logs]").innerHTML = state.logs.slice(0, 5).map(renderLogLine).join("");
}

function itemMatches(item, group) {
  const filter = state.filters[group];
  const query = filter.query.trim().toLowerCase();
  const statusOK = filter.status === "ALL" || item.status === filter.status;
  const text = `${item.title} ${item.summary} ${item.owner || ""}`.toLowerCase();
  return statusOK && (!query || text.includes(query));
}

function renderActivities() {
  const items = state.activities.filter((item) => itemMatches(item, "activities"));
  document.querySelector("[data-table='activities']").innerHTML = renderContentTable(items, "activity");
}

function renderRecords() {
  const items = state.records.filter((item) => itemMatches(item, "records"));
  document.querySelector("[data-table='records']").innerHTML = renderContentTable(items, "record");
}

function renderContentTable(items, kind) {
  if (items.length === 0) return '<p class="loading">該当するデータはありません</p>';
  const typeKey = kind === "activity" ? "category" : "type";
  return `
    <table class="crm-table">
      <thead>
        <tr>
          <th>タイトル</th>
          <th>種別</th>
          <th>状態</th>
          <th>担当</th>
          <th>更新日</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (item) => `
              <tr>
                <td>
                  <strong>${escapeHTML(item.title)}</strong>
                  <small>${escapeHTML(item.summary)}</small>
                </td>
                <td>${escapeHTML(item[typeKey])}</td>
                <td><span class="status-chip">${escapeHTML(STATUS_LABELS[item.status] || item.status)}</span></td>
                <td>${escapeHTML(item.owner)}</td>
                <td>${escapeHTML(item.updatedAt)}</td>
                <td>
                  <div class="crm-row-actions">
                    <button type="button" data-edit="${kind}" data-id="${escapeHTML(item.id)}">編集</button>
                    <button type="button" data-request-review="${kind}" data-id="${escapeHTML(item.id)}">レビュー</button>
                    <button type="button" data-publish="${kind}" data-id="${escapeHTML(item.id)}">公開</button>
                  </div>
                </td>
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderMedia() {
  const target = document.querySelector("[data-media-grid]");
  target.innerHTML = state.media
    .map(
      (item) => `
        <article class="crm-media-card">
          <img src="${escapeHTML(item.fileUrl)}" alt="${escapeHTML(item.altText)}" loading="lazy">
          <div>
            <span class="status-chip">${escapeHTML(item.usageScope)}</span>
            <h3>${escapeHTML(item.title)}</h3>
            <p>${escapeHTML(item.credit)}</p>
            <button type="button" data-edit="media" data-id="${escapeHTML(item.id)}">編集</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderReviews() {
  const statuses = [
    ["REQUESTED", "レビュー中"],
    ["APPROVED", "承認済み"],
    ["REJECTED", "差し戻し"],
  ];
  document.querySelector("[data-review-board]").innerHTML = statuses
    .map(
      ([status, label]) => `
        <section class="crm-kanban-col">
          <h3>${label}</h3>
          ${state.reviews
            .filter((item) => item.status === status)
            .map(renderReviewCard)
            .join("") || '<p class="loading">対象なし</p>'}
        </section>
      `,
    )
    .join("");
}

function renderReviewCard(item) {
  return `
    <article class="crm-review-card">
      <span class="status-chip">${escapeHTML(item.status)}</span>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.checklist.join(" / "))}</p>
      <div class="crm-row-actions">
        <button type="button" data-approve-review="${escapeHTML(item.id)}">承認</button>
        <button type="button" data-reject-review="${escapeHTML(item.id)}">差し戻し</button>
      </div>
    </article>
  `;
}

function renderPublishing() {
  const approved = [...state.activities.map((item) => ({ ...item, kind: "activity" })), ...state.records.map((item) => ({ ...item, kind: "record" }))].filter(
    (item) => item.status === "APPROVED" || item.status === "PUBLISHED",
  );
  document.querySelector("[data-publish-grid]").innerHTML =
    approved.length === 0
      ? '<p class="loading">公開可能なデータはありません</p>'
      : approved
          .map(
            (item) => `
              <article class="crm-publish-card">
                <span class="status-chip">${escapeHTML(STATUS_LABELS[item.status])}</span>
                <h3>${escapeHTML(item.title)}</h3>
                <p>${escapeHTML(item.summary)}</p>
                <button type="button" data-publish="${escapeHTML(item.kind)}" data-id="${escapeHTML(item.id)}">公開する</button>
              </article>
            `,
          )
          .join("");

  const publicData = {
    activities: state.activities.filter((item) => item.status === "PUBLISHED"),
    records: state.records.filter((item) => item.status === "PUBLISHED"),
  };
  document.querySelector("[data-public-json]").value = JSON.stringify(publicData, null, 2);
}

function renderUsers() {
  document.querySelector("[data-table='users']").innerHTML = `
    <table class="crm-table">
      <thead>
        <tr>
          <th>名前</th>
          <th>メール</th>
          <th>ロール</th>
          <th>状態</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        ${state.users
          .map(
            (item) => `
              <tr>
                <td><strong>${escapeHTML(item.name)}</strong></td>
                <td>${escapeHTML(item.email)}</td>
                <td>${escapeHTML(item.role)}</td>
                <td><span class="status-chip">${escapeHTML(item.status)}</span></td>
                <td><button type="button" data-edit="user" data-id="${escapeHTML(item.id)}">編集</button></td>
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderLogs() {
  document.querySelector("[data-table='logs']").innerHTML = `
    <table class="crm-table">
      <thead>
        <tr>
          <th>日時</th>
          <th>操作者</th>
          <th>操作</th>
          <th>対象</th>
          <th>詳細</th>
        </tr>
      </thead>
      <tbody>
        ${state.logs
          .map(
            (item) => `
              <tr>
                <td>${escapeHTML(item.createdAt)}</td>
                <td>${escapeHTML(item.actor)}</td>
                <td>${escapeHTML(item.action)}</td>
                <td>${escapeHTML(item.target)}</td>
                <td>${escapeHTML(item.detail)}</td>
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderLogLine(item) {
  return `
    <article class="crm-log-line">
      <span>${escapeHTML(item.createdAt)}</span>
      <strong>${escapeHTML(item.action)}</strong>
      <p>${escapeHTML(item.detail)}</p>
    </article>
  `;
}

function openEditor(kind, id = null) {
  const dialog = document.querySelector("[data-editor-dialog]");
  const title = document.querySelector("[data-editor-title]");
  const kicker = document.querySelector("[data-editor-kicker]");
  const fields = document.querySelector("[data-editor-fields]");
  const item = id ? collectionFor(kind).find((entry) => entry.id === id) : null;
  editorContext = { kind, id };

  kicker.textContent = kind.toUpperCase();
  title.textContent = item ? "編集" : "新規作成";
  fields.innerHTML = FIELD_CONFIGS[kind].map((field) => renderField(field, item)).join("");
  dialog.showModal();
}

function renderField([name, label, type, meta], item) {
  const value = item?.[name] || "";
  if (type === "select") {
    return `
      <label>
        ${escapeHTML(label)}
        <select name="${escapeHTML(name)}">
          ${meta.map((option) => `<option ${option === value ? "selected" : ""}>${escapeHTML(option)}</option>`).join("")}
        </select>
      </label>
    `;
  }
  if (type === "textarea") {
    return `
      <label>
        ${escapeHTML(label)}
        <textarea name="${escapeHTML(name)}" rows="5" placeholder="${escapeHTML(meta)}">${escapeHTML(value)}</textarea>
      </label>
    `;
  }
  return `
    <label>
      ${escapeHTML(label)}
      <input name="${escapeHTML(name)}" value="${escapeHTML(value)}" placeholder="${escapeHTML(meta)}" />
    </label>
  `;
}

function saveEditor() {
  if (!editorContext) return;
  if (!can("create") && !editorContext.id) {
    alertMessage("作成権限がありません", "error");
    return;
  }
  if (!can("edit") && editorContext.id) {
    alertMessage("編集権限がありません", "error");
    return;
  }

  const form = document.querySelector("[data-editor-form]");
  const data = new FormData(form);
  const target = collectionFor(editorContext.kind);
  const values = Object.fromEntries(data.entries());
  const existing = editorContext.id ? target.find((item) => item.id === editorContext.id) : null;
  const prefix = editorContext.kind.slice(0, 3);
  const next = {
    ...(existing || {}),
    ...values,
    id: existing?.id || `${prefix}_${Date.now()}`,
    status: existing?.status || (editorContext.kind === "media" ? "AVAILABLE" : "DRAFT"),
    visibility: existing?.visibility || "PUBLIC",
    updatedAt: today(),
  };

  if (existing) {
    Object.assign(existing, next);
    pushLog(`UPDATE_${editorContext.kind.toUpperCase()}`, editorContext.kind, next.title || next.name);
  } else {
    target.unshift(next);
    pushLog(`CREATE_${editorContext.kind.toUpperCase()}`, editorContext.kind, next.title || next.name);
  }

  document.querySelector("[data-editor-dialog]").close();
  editorContext = null;
  render();
}

function requestReview(kind, id) {
  if (!can("requestReview") && !can("review")) {
    alertMessage("レビュー依頼の権限がありません", "error");
    return;
  }
  const target = findTarget(kind, id);
  if (!target) return;
  target.status = "REVIEW_REQUESTED";
  target.updatedAt = today();
  state.reviews.unshift({
    id: `rev_${Date.now()}`,
    targetType: kind,
    targetId: id,
    title: target.title,
    status: "REQUESTED",
    reviewer: "Reviewer",
    checklist: ["個人情報", "大学公式誤認", "画像権利"],
    updatedAt: today(),
  });
  pushLog("REQUEST_REVIEW", kind, target.title);
  alertMessage("レビューを依頼しました");
  render();
}

function approveReview(id) {
  if (!can("review")) {
    alertMessage("承認権限がありません", "error");
    return;
  }
  const review = state.reviews.find((item) => item.id === id);
  if (!review) return;
  const target = findTarget(review.targetType, review.targetId);
  review.status = "APPROVED";
  review.updatedAt = today();
  if (target) {
    target.status = "APPROVED";
    target.updatedAt = today();
  }
  pushLog("APPROVE_REVIEW", review.targetType, review.title);
  alertMessage("承認しました");
  render();
}

function rejectReview(id) {
  if (!can("review")) {
    alertMessage("差し戻し権限がありません", "error");
    return;
  }
  const review = state.reviews.find((item) => item.id === id);
  if (!review) return;
  const target = findTarget(review.targetType, review.targetId);
  review.status = "REJECTED";
  review.updatedAt = today();
  if (target) {
    target.status = "NEEDS_REVISION";
    target.updatedAt = today();
  }
  pushLog("REJECT_REVIEW", review.targetType, review.title);
  alertMessage("差し戻しました");
  render();
}

function publishItem(kind, id) {
  if (!can("publish")) {
    alertMessage("公開権限がありません", "error");
    return;
  }
  const target = findTarget(kind, id);
  if (!target) return;
  if (target.status !== "APPROVED" && target.status !== "PUBLISHED") {
    alertMessage("承認済みのデータだけ公開できます", "error");
    return;
  }
  target.status = "PUBLISHED";
  target.publishedAt = today();
  target.updatedAt = today();
  pushLog("PUBLISH_CONTENT", kind, target.title);
  alertMessage("公開済みにしました");
  render();
}

function exportAll() {
  const dialog = document.querySelector("[data-export-dialog]");
  const output = document.querySelector("[data-export-json]");
  output.value = JSON.stringify(state, null, 2);
  dialog.showModal();
  output.focus();
  output.select();
}

function resetDemo() {
  state = clone(seedState);
  pushLog("RESET_DEMO", "system", "初期データに戻しました");
  render();
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  document.querySelector("[data-role-switch]").addEventListener("change", (event) => {
    state.role = event.target.value;
    pushLog("SWITCH_ROLE", "user", `${state.role}として操作`);
    render();
  });

  document.querySelectorAll("[data-create]").forEach((button) => {
    button.addEventListener("click", () => openEditor(button.dataset.create));
  });

  document.querySelector("[data-save-editor]").addEventListener("click", saveEditor);
  document.querySelector("[data-close-dialog]").addEventListener("click", () => document.querySelector("[data-editor-dialog]").close());
  document.querySelector("[data-close-export]").addEventListener("click", () => document.querySelector("[data-export-dialog]").close());
  document.querySelector("[data-export-all]").addEventListener("click", exportAll);
  document.querySelector("[data-reset-demo]").addEventListener("click", resetDemo);

  document.querySelectorAll("[data-search]").forEach((input) => {
    input.addEventListener("input", () => {
      state.filters[input.dataset.search].query = input.value;
      render();
    });
  });

  document.querySelectorAll("[data-status-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      state.filters[select.dataset.statusFilter].status = select.value;
      render();
    });
  });

  document.body.addEventListener("click", (event) => {
    const edit = event.target.closest("[data-edit]");
    if (edit) openEditor(edit.dataset.edit, edit.dataset.id);

    const review = event.target.closest("[data-request-review]");
    if (review) requestReview(review.dataset.requestReview, review.dataset.id);

    const approve = event.target.closest("[data-approve-review]");
    if (approve) approveReview(approve.dataset.approveReview);

    const reject = event.target.closest("[data-reject-review]");
    if (reject) rejectReview(reject.dataset.rejectReview);

    const publish = event.target.closest("[data-publish]");
    if (publish) publishItem(publish.dataset.publish, publish.dataset.id);
  });
}

bindEvents();
render();

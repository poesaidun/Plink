const STORAGE_KEY = "school-planner:v1";
const APP_VERSION = window.PLINK_UPDATE?.version || "0.1.0";
const UPDATE_MANIFEST_URL = window.PLINK_UPDATE?.manifestUrl || "";
const UPDATE_DOWNLOAD_URL = window.PLINK_UPDATE?.downloadUrl || "";
const CANVAS_DEFAULT_URL = "https://excelsior.instructure.com";
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DONE_STATUSES = new Set(["submitted", "read", "completed", "graded"]);

const icons = {
  "layout-dashboard": "M3 13h8V3H3v10Zm10 8h8V11h-8v10ZM3 21h8v-6H3v6Zm10-12h8V3h-8v6Z",
  "book-open": "M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H8.5A4.5 4.5 0 0 0 4 23V5.5Zm0 0A3.5 3.5 0 0 1 7.5 2H20M4 5.5V23",
  "calendar-days": "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 10h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01",
  "bar-chart": "M4 19V9M12 19V5M20 19v-8M3 19h18",
  cloud: "M17.5 19H7a5 5 0 1 1 1.1-9.88A7 7 0 0 1 21 12.5A4.5 4.5 0 0 1 17.5 19Z",
  "file-text": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6ZM14 2v6h6M8 13h8M8 17h8M8 9h2",
  upload: "M12 16V4M7 9l5-5 5 5M5 20h14",
  "clipboard-list": "M9 5h6M9 12h6M9 16h6M7 5H5v16h14V5h-2M9 3h6v4H9V3Z",
  refresh: "M21 12a9 9 0 0 1-15.5 6.2L3 15.5M3 21v-5.5h5.5M3 12A9 9 0 0 1 18.5 5.8L21 8.5M21 3v5.5h-5.5",
  moon: "M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z",
  sun: "M12 4V2M12 22v-2M4.93 4.93 3.51 3.51M20.49 20.49l-1.42-1.42M4 12H2M22 12h-2M4.93 19.07l-1.42 1.42M20.49 3.51l-1.42 1.42M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z",
  "volume-2": "M11 5 6 9H3v6h3l5 4V5ZM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13",
  "volume-x": "M11 5 6 9H3v6h3l5 4V5ZM22 9l-6 6M16 9l6 6",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
  target: "M12 2v4M12 18v4M2 12h4M18 12h4M7.8 7.8l-2.8-2.8M19 5l-2.8 2.8M7.8 16.2 5 19M19 19l-2.8-2.8M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  "book-plus": "M12 7v6M9 10h6M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H8.5A4.5 4.5 0 0 0 4 23V5.5Zm0 0A3.5 3.5 0 0 1 7.5 2H20",
  plus: "M12 5v14M5 12h14",
  x: "M18 6 6 18M6 6l12 12",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z",
  trash: "M3 6h18M8 6V4h8v2M6 6l1 16h10l1-16M10 11v6M14 11v6",
  check: "M20 6 9 17l-5-5",
  clock: "M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  external: "M14 3h7v7M21 3 10 14M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5",
  "chevron-left": "M15 18 9 12l6-6",
  "chevron-right": "M9 18l6-6-6-6",
  spark: "M13 2 9 10l-7 3 7 3 4 8 4-8 7-3-7-3-4-8Z",
  lightbulb: "M15 14c.2-1 .7-1.8 1.5-2.6A5 5 0 1 0 7.5 11.4C8.3 12.2 8.8 13 9 14M9 18h6M10 22h4M10 18v-2h4v2",
  lock: "M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5V11Z",
};

const courseColors = ["#1f9d8a", "#4357ad", "#c27a10", "#c84d48", "#418750", "#8d5aaf", "#2f7da1", "#985f2f"];

const viewTitles = {
  dashboard: "Dashboard",
  courses: "Courses",
  calendar: "Calendar",
};

const dashboardMessages = [
  "One thing at a time.",
  "Small steps still count.",
  "Momentum starts small.",
  "The day is still yours.",
  "You have more time than you think.",
  "Progress does not need to be loud.",
  "A little progress goes a long way.",
  "No rush. Start where you are.",
  "Quiet progress is still progress.",
  "You are allowed to begin again.",
  "Even slow progress moves forward.",
  "There is no perfect time to start.",
  "Tiny wins become big ones.",
  "Today does not need to be perfect.",
  "Start small. Keep going.",
  "Breathe. Then begin.",
  "You do not need to do everything today.",
  "Some progress is better than none.",
  "Your future self will thank you.",
  "The mountain moves pebble by pebble."
];

const universalAddOptions = [
  {
    id: "assignment",
    label: "Assignment",
    description: "Add coursework with a due date.",
    icon: "plus",
    kind: "assignment",
    defaults: { type: "homework" },
  },
  {
    id: "exam",
    label: "Exam",
    description: "Add a test, midterm, or final.",
    icon: "file-text",
    kind: "assignment",
    defaults: { type: "exam", estimatedHours: 3, priority: "high" },
  },
  {
    id: "reminder",
    label: "Reminder",
    description: "A small nudge you do not want to miss.",
    icon: "bell",
    kind: "assignment",
    defaults: { type: "reminder", estimatedHours: 0.25, priority: "normal" },
  },
  {
    id: "study-session",
    label: "Study Session",
    description: "Block time on your calendar.",
    icon: "clock",
    kind: "session",
  },
  {
    id: "goal",
    label: "Goal",
    description: "Track a calm target for future you.",
    icon: "target",
    kind: "assignment",
    defaults: { type: "goal", estimatedHours: 1, priority: "normal" },
  },
  {
    id: "course",
    label: "Course",
    description: "Create a class to organize work.",
    icon: "book-plus",
    kind: "course",
  }, 
];

let sessionToken = "";
let state = loadState();
let latestUpdateManifest = null;
persist();

const els = {
  app: document.getElementById("app"),
  viewRoot: document.getElementById("viewRoot"),
  viewTitle: document.getElementById("viewTitle"),
  todayLabel: document.getElementById("todayLabel"),
  primaryNav: document.getElementById("primaryNav"),
  updateCheckButton: document.getElementById("updateCheckButton"),
  tourReplayButton: document.getElementById("tourReplayButton"),
  themeToggleButton: document.getElementById("themeToggleButton"),
  soundToggleButton: document.getElementById("soundToggleButton"),
  resetDataButton: document.getElementById("resetDataButton"),
  universalAddButton: document.getElementById("universalAddButton"),
  universalAddMenu: document.getElementById("universalAddMenu"),
  courseDialog: document.getElementById("courseDialog"),
  courseForm: document.getElementById("courseForm"),
  assignmentDialog: document.getElementById("assignmentDialog"),
  assignmentForm: document.getElementById("assignmentForm"),
  sessionDialog: document.getElementById("sessionDialog"),
  sessionForm: document.getElementById("sessionForm"),
  dueItemsDialog: document.getElementById("dueItemsDialog"),
  dueItemsBody: document.getElementById("dueItemsBody"),
  updateDialog: document.getElementById("updateDialog"),
  updateDialogTitle: document.getElementById("updateDialogTitle"),
  updateDialogBody: document.getElementById("updateDialogBody"),
  updateVersionLine: document.getElementById("updateVersionLine"),
  updateCheckAgainButton: document.getElementById("updateCheckAgainButton"),
  updateDownloadButton: document.getElementById("updateDownloadButton"),
  toastHost: document.getElementById("toastHost"),
  tourOverlay: document.getElementById("tourOverlay"),
  tourCard: document.getElementById("tourCard"),
  tourSpotlight: document.getElementById("tourSpotlight"),
  tourTitle: document.getElementById("tourTitle"),
  tourText: document.getElementById("tourText"),
  tourStep: document.getElementById("tourStep"),
  tourNextButton: document.getElementById("tourNextButton"),
  tourSkipButton: document.getElementById("tourSkipButton"),
};

hydrateIcons(document);
bindEvents();
createAddMenuComponent({
  button: els.universalAddButton,
  menu: els.universalAddMenu,
  options: universalAddOptions,
  onSelect: handleUniversalAdd,
});
render();
registerPlinkServiceWorker();

function loadState() {
  const base = {
    version: 1,
    settings: {
      canvasUrl: CANVAS_DEFAULT_URL,
      token: "",
      saveToken: false,
      lastSync: null,
      syncStatus: "Ready",
      lastImport: null,
      importStatus: "Ready",
    },
    ui: {
      view: "dashboard",
      weekStart: toDateInput(startOfWeek(new Date())),
      monthCursor: toDateInput(startOfMonth(new Date())),
      theme: "light",
      soundOn: true,
      quickNote: '',
    },
    syllabus: {
      fileName: "",
      text: "",
      selectedCourseId: "",
      courseName: "",
      courseCode: "",
      instructor: "",
      screenshotName: "",
      screenshotDataUrl: "",
      schedule: {
        courseStart: "",
        courseEnd: "",
        weekStartsOn: "",
        weekEndsOn: "",
        defaultDueDay: "",
        defaultDueTime: "",
      },
      parsedItems: [],
    },
    courses: [],
    assignments: [],
    sessions: [],
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved) return base;
    const merged = {
      ...base,
      ...saved,
      settings: { ...base.settings, ...(saved.settings || {}) },
      ui: { ...base.ui, ...(saved.ui || {}) },
      syllabus: {
        ...base.syllabus,
        ...(saved.syllabus || {}),
        schedule: { ...base.syllabus.schedule, ...((saved.syllabus && saved.syllabus.schedule) || {}) },
      },
      courses: Array.isArray(saved.courses) ? saved.courses : [],
      assignments: Array.isArray(saved.assignments) ? saved.assignments : [],
      sessions: Array.isArray(saved.sessions) ? saved.sessions : [],
    };
    if (merged.ui.view === "canvas" || merged.ui.view === "syllabus") merged.ui.view = "manual";
    if (merged.ui.view === "grades") merged.ui.view = "dashboard";
    if (!merged.ui.monthCursor) merged.ui.monthCursor = toDateInput(startOfMonth(new Date()));
    if (merged.ui.soundOn == null) merged.ui.soundOn = true;
    return stripGradeDataFromState(removeCompletedAssignmentsFromState(merged));
  } catch {
    return base;
  }
}

function persist() {
  const copy = stripGradeDataFromState(structuredClone(state));
  if (!copy.settings.saveToken) {
    copy.settings.token = "";
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
}

function bindEvents() {
  els.primaryNav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-view]");
    if (!button) return;
    state.ui.view = button.dataset.view;
    persist();
    render();
  });

  els.themeToggleButton.addEventListener("click", () => {
    state.ui.theme = state.ui.theme === "dark" ? "light" : "dark";
    persist();
    render();
  });
  els.soundToggleButton.addEventListener("click", () => {
    state.ui.soundOn = !state.ui.soundOn;
    persist();
    render();
    if (state.ui.soundOn) playPlink("add");
  });

  els.updateCheckButton?.addEventListener("click", openUpdateDialog);
  els.updateCheckAgainButton?.addEventListener("click", () => checkForUpdates());
  els.updateDownloadButton?.addEventListener("click", openUpdateDownload);
  els.resetDataButton?.addEventListener("click", resetPlinkData);

  els.courseForm.addEventListener("submit", (event) => {
    if (event.submitter?.value === "cancel") return;
    event.preventDefault();
    saveCourseFromForm();
  });

  document.getElementById("deleteCourseButton").addEventListener("click", () => {
    const id = document.getElementById("courseId").value;
    if (!id) return;
    deleteCourse(id);
  });

  els.assignmentForm.addEventListener("submit", (event) => {
    if (event.submitter?.value === "cancel") return;
    event.preventDefault();
    saveAssignmentFromForm();
  });

  document.getElementById("deleteAssignmentButton").addEventListener("click", () => {
    const id = document.getElementById("assignmentId").value;
    if (!id) return;
    deleteAssignment(id);
  });

  document.getElementById("deleteSessionButton").addEventListener("click", () => {
    const id = document.getElementById("sessionId").value;
    if (!id) return;
    deleteSession(id);
  });

  els.sessionForm.addEventListener("submit", (event) => {
    if (event.submitter?.value === "cancel") return;
    event.preventDefault();
    saveSessionFromForm();
  });

  document.getElementById("sessionCourse").addEventListener("change", () => {
    fillSessionAssignmentOptions();
  });
  document.getElementById("sessionAssignment").addEventListener("change", () => {
    applySelectedSessionAssignment();
  });

  document.addEventListener("input", (event) => {
    if (event.target.id === "quickNoteInput") {
      state.ui.quickNote = event.target.value;
      persist();
    }
  });

  els.tourNextButton?.addEventListener("click", () => {
    if (currentTourStep >= TOUR_STEPS.length - 1) {
      finishTour();
      return;
    }

    showTourStep(currentTourStep + 1);
  });

  els.tourSkipButton?.addEventListener("click", () => {
    finishTour();
  });

  els.tourReplayButton?.addEventListener("click", () => {
    localStorage.removeItem("plink-tour-complete");
    showTourStep(0);
  });

  window.addEventListener("resize", () => {
    if (!els.tourOverlay?.hidden) positionTourStep(TOUR_STEPS[currentTourStep]);
  });

  window.addEventListener("scroll", () => {
    if (!els.tourOverlay?.hidden) positionTourStep(TOUR_STEPS[currentTourStep]);
  }, true);

}

function createAddMenuComponent({ button, menu, options, onSelect }) {
  if (!button || !menu) return;
  menu.innerHTML = renderAddMenuOptions(options);

  const close = () => {
    menu.hidden = true;
    button.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    menu.hidden = false;
    button.setAttribute("aria-expanded", "true");
    menu.querySelector("[data-add-option]")?.focus();
  };
  const toggle = () => {
    if (menu.hidden) open();
    else close();
  };

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    toggle();
  });
  menu.addEventListener("click", (event) => {
    const optionButton = event.target.closest("[data-add-option]");
    if (!optionButton) return;
    close();
    onSelect(optionButton.dataset.addOption);
  });
  menu.addEventListener("keydown", (event) => {
    const items = [...menu.querySelectorAll("[data-add-option]")];
    const index = items.indexOf(document.activeElement);
    if (event.key === "Escape") {
      close();
      button.focus();
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(index + 1) % items.length]?.focus();
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!menu.hidden && !menu.contains(event.target) && !button.contains(event.target)) close();
  });
}

function renderAddMenuOptions(options) {
  return `
    <div class="add-menu-title">Create</div>
    ${options.map((option) => `
      ${option.id === "course" ? `<div class="add-menu-divider"></div>` : ""}
      <button class="add-menu-option" data-add-option="${escapeAttr(option.id)}" role="menuitem" type="button">
        <span class="add-menu-icon">${icon(option.icon)}</span>
        <span>
          <strong>${escapeHtml(option.label)}</strong>
          <small>${escapeHtml(option.description)}</small>
        </span>
      </button>
    `).join("")}
  `;
}

function handleUniversalAdd(id) {
  const option = universalAddOptions.find((item) => item.id === id);
  console.log("CLICKED OPTION:", option);
  if (!option) return;
  if (option.kind === "course") {
    openCourseDialog();
    return;
  }
  if (!state.courses.length) {
  toast(`Even ${option.label.toLowerCase()}s need a class to cling to. Add a course first.`);
  playPlink("error");
  return;
}
  if (option.kind === "session") {
    openSessionDialog();
    return;
  }
  console.log("SENDING TITLE:", option.label);
  openAssignmentDialog("", "", option.defaults || {}, option.label);
}

function render() {
  document.documentElement.dataset.theme = state.ui.theme;
  els.todayLabel.textContent = formatDateLong(new Date());
  els.viewTitle.textContent = viewTitles[state.ui.view] || "Dashboard";
  els.themeToggleButton.innerHTML = icon(state.ui.theme === "dark" ? "sun" : "moon");
  els.soundToggleButton.innerHTML = icon(state.ui.soundOn ? "volume-2" : "volume-x");
  els.soundToggleButton.title = state.ui.soundOn ? "Sound on" : "Sound off";
  els.soundToggleButton.setAttribute("aria-label", state.ui.soundOn ? "Turn sound off" : "Turn sound on");

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === state.ui.view);
  });

  const renderers = {
    dashboard: renderDashboard,
    courses: renderCourses,
    calendar: renderCalendar,
    manual: renderManualEntry,
  };
  els.viewRoot.innerHTML = (renderers[state.ui.view] || renderDashboard)();
  hydrateIcons(els.viewRoot);
  bindRenderedEvents();
}

function bindRenderedEvents() {
  els.viewRoot.querySelectorAll("[data-edit-course]").forEach((button) => {
    button.addEventListener("click", () => openCourseDialog(button.dataset.editCourse));
  });
  els.viewRoot.querySelectorAll("[data-edit-assignment]").forEach((button) => {
    button.addEventListener("click", () => openAssignmentDialog(button.dataset.editAssignment));
  });
  els.viewRoot.querySelectorAll("[data-edit-session]").forEach((button) => {
    button.addEventListener("click", () => openSessionDialog(button.dataset.editSession));
  });
  els.viewRoot.querySelectorAll("[data-show-due-soon]").forEach((button) => {
    button.addEventListener("click", openDueItemsDialog);
  });
  els.viewRoot.querySelectorAll("[data-add-session]").forEach((button) => {
    button.addEventListener("click", () => openSessionDialog(null, button.dataset.addSession || ""));
  });
  els.viewRoot.querySelectorAll("[data-add-session-date]").forEach((button) => {
    button.addEventListener("click", () => openSessionDialog(null, "", defaultSessionStartForDate(button.dataset.addSessionDate)));
  });
  els.viewRoot.querySelectorAll("[data-planner-assignment]").forEach((button) => {
    button.addEventListener("click", () => openSessionDialog(null, button.dataset.plannerAssignment || ""));
    button.addEventListener("dragstart", (event) => {
      event.dataTransfer?.setData("text/plain", button.dataset.plannerAssignment || "");
      event.dataTransfer?.setData("application/x-school-assignment", button.dataset.plannerAssignment || "");
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
    });
  });
  els.viewRoot.querySelectorAll("[data-calendar-drop]").forEach((day) => {
    day.addEventListener("click", (event) => {
      if (event.target.closest("button, a, input, select, textarea, .calendar-item")) return;
      openSessionDialog(null, "", defaultSessionStartForDate(day.dataset.calendarDrop));
    });
    day.addEventListener("dragover", (event) => {
      event.preventDefault();
      day.classList.add("is-drop-target");
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    });
    day.addEventListener("dragleave", () => {
      day.classList.remove("is-drop-target");
    });
    day.addEventListener("drop", (event) => {
      event.preventDefault();
      day.classList.remove("is-drop-target");
      const assignmentId = event.dataTransfer?.getData("application/x-school-assignment") || event.dataTransfer?.getData("text/plain") || "";
      if (assignmentId) openSessionDialog(null, assignmentId, defaultSessionStartForDate(day.dataset.calendarDrop));
    });
  });
  els.viewRoot.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => setAssignmentStatus(button.dataset.assignment, button.dataset.status));
  });
  els.viewRoot.querySelectorAll("[data-week-nav]").forEach((button) => {
    button.addEventListener("click", () => moveWeek(Number(button.dataset.weekNav)));
  });
  els.viewRoot.querySelectorAll("[data-month-nav]").forEach((button) => {
    button.addEventListener("click", () => moveMonth(Number(button.dataset.monthNav)));
  });
  els.viewRoot.querySelectorAll("[data-calendar-today]").forEach((button) => {
    button.addEventListener("click", () => setCalendarMonth(new Date()));
  });
  els.viewRoot.querySelectorAll("[data-canvas-sync]").forEach((button) => button.addEventListener("click", syncCanvas));
  els.viewRoot.querySelectorAll("[data-canvas-clear]").forEach((button) => {
    button.addEventListener("click", () => {
      sessionToken = "";
      state.settings.token = "";
      state.settings.saveToken = false;
      persist();
      render();
      toast("Canvas token cleared.");
    });
  });
  els.viewRoot.querySelectorAll("[data-export]").forEach((button) => {
    button.addEventListener("click", exportData);
  });
  els.viewRoot.querySelectorAll("[data-parse-syllabus]").forEach((button) => {
    button.addEventListener("click", parseSyllabusFromInputs);
  });
  els.viewRoot.querySelectorAll("[data-save-syllabus]").forEach((button) => {
    button.addEventListener("click", saveSyllabusItems);
  });
  els.viewRoot.querySelectorAll("[data-clear-syllabus]").forEach((button) => {
    button.addEventListener("click", clearSyllabusDraft);
  });
  els.viewRoot.querySelectorAll("[data-apply-demo-syllabus]").forEach((button) => {
    button.addEventListener("click", loadDemoSyllabus);
  });
  els.viewRoot.querySelectorAll("[data-manual-course]").forEach((button) => {
    button.addEventListener("click", () => openCourseDialog());
  });
  els.viewRoot.querySelectorAll("[data-manual-assignment]").forEach((button) => {
    button.addEventListener("click", () => openAssignmentDialog());
  });
  els.viewRoot.querySelectorAll("[data-manual-session]").forEach((button) => {
    button.addEventListener("click", () => openSessionDialog());
  });
  els.viewRoot.querySelectorAll("[data-syllabus-field]").forEach((field) => {
    field.addEventListener("input", () => {
      state.syllabus[field.dataset.syllabusField] = field.value;
      persist();
    });
    field.addEventListener("change", () => {
      state.syllabus[field.dataset.syllabusField] = field.value;
      persist();
    });
  });
  els.viewRoot.querySelectorAll("[data-schedule-field]").forEach((field) => {
    const update = () => {
      state.syllabus.schedule = { ...(state.syllabus.schedule || {}), [field.dataset.scheduleField]: field.value };
      persist();
    };
    field.addEventListener("input", update);
    field.addEventListener("change", update);
  });
  els.viewRoot.querySelectorAll("[data-syllabus-item-field]").forEach((field) => {
    const update = () => updateSyllabusItemField(field.dataset.syllabusItemField, field.dataset.field, field.type === "checkbox" ? field.checked : field.value);
    field.addEventListener("input", update);
    field.addEventListener("change", update);
  });

  const syllabusFile = document.getElementById("syllabusFile");
  if (syllabusFile) {
    syllabusFile.addEventListener("change", handleSyllabusFile);
  }

  const screenshotFile = document.getElementById("screenshotFile");
  if (screenshotFile) {
    screenshotFile.addEventListener("change", handleScreenshotFile);
  }
  els.viewRoot.querySelectorAll("[data-clear-screenshot]").forEach((button) => {
    button.addEventListener("click", clearScreenshotReference);
  });

  const canvasUrl = document.getElementById("canvasUrl");
  const canvasToken = document.getElementById("canvasToken");
  const saveToken = document.getElementById("saveToken");
  if (canvasUrl && canvasToken && saveToken) {
    canvasUrl.addEventListener("input", () => {
      state.settings.canvasUrl = canvasUrl.value.trim();
      persist();
    });
    canvasToken.addEventListener("input", () => {
      sessionToken = canvasToken.value.trim();
      if (saveToken.checked) state.settings.token = sessionToken;
      persist();
    });
    saveToken.addEventListener("change", () => {
      state.settings.saveToken = saveToken.checked;
      state.settings.token = saveToken.checked ? canvasToken.value.trim() : "";
      persist();
    });
  }
}

const TOUR_STEPS = [
  {
    title: "Welcome to Plink",
    text: "This is your launch point: a calm pulse for what matters today and what needs your attention next.",
    target: "[data-tour-target='hero']",
    view: "dashboard",
    placement: "bottom",
  },

  {
    title: "Quick Add",
    text: "Use this one button to create assignments, exams, reminders, study sessions, goals, and courses.",
    target: "[data-tour-target='add']",
    view: "dashboard",
    placement: "bottom-end",
  },

  {
    title: "Today",
    text: "This is the day view: due items and planned study blocks that need your attention right now.",
    target: "[data-tour-target='today']",
    view: "dashboard",
    placement: "right",
  },

  {
    title: "Next Work",
    text: "This shows the very next active item for each course so every class has a clear next move.",
    target: "[data-tour-target='next-work']",
    view: "dashboard",
    placement: "right",
  },

  {
    title: "Study Sessions",
    text: "Plan focused blocks before deadlines get loud. These sessions also show up on the calendar.",
    target: "[data-tour-target='study-sessions']",
    view: "dashboard",
    placement: "right",
  },

  {
    title: "Quick Notes",
    text: "Drop tiny thoughts here before they evaporate: reminders, ideas, or the next thing you want to do.",
    target: "[data-tour-target='quick-notes']",
    view: "dashboard",
    placement: "left",
  },
];

let currentTourStep = 0;

function showTourStep(index) {
  const step = TOUR_STEPS[index];
  if (!step) {
    finishTour();
    return;
  }

  currentTourStep = index;
  prepareTourView(step);

  els.tourOverlay.hidden = false;
  els.tourOverlay.classList.remove("is-centered");
  els.tourOverlay.removeAttribute("aria-hidden");
  els.tourTitle.textContent = step.title;
  els.tourText.textContent = step.text;
  els.tourStep.textContent = `${index + 1} of ${TOUR_STEPS.length}`;

  els.tourNextButton.textContent =
    index === TOUR_STEPS.length - 1 ? "Finish" : "Next";
  requestAnimationFrame(() => positionTourStep(step, true));
}

function finishTour() {
  els.tourOverlay.hidden = true;
  resetTourPosition();
  els.tourOverlay.setAttribute("aria-hidden", "true");
  localStorage.setItem("plink-tour-complete", "true");
}

function prepareTourView(step) {
  if (!step?.view || state.ui.view === step.view) return;
  state.ui.view = step.view;
  persist();
  render();
}

function positionTourStep(step, shouldScroll = false) {
  if (!step || els.tourOverlay.hidden || !els.tourCard || !els.tourSpotlight) return;

  const target = step.target ? document.querySelector(step.target) : null;
  if (!target) {
    centerTourCard();
    return;
  }

  if (shouldScroll) target.scrollIntoView({ block: "center", inline: "nearest" });

  const targetRect = target.getBoundingClientRect();
  const padding = 10;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const spotlight = {
    left: clamp(targetRect.left - padding, 12, viewportWidth - 24),
    top: clamp(targetRect.top - padding, 12, viewportHeight - 24),
    width: Math.min(targetRect.width + padding * 2, viewportWidth - 24),
    height: Math.min(targetRect.height + padding * 2, viewportHeight - 24),
  };

  if (spotlight.left + spotlight.width > viewportWidth - 12) spotlight.left = viewportWidth - spotlight.width - 12;
  if (spotlight.top + spotlight.height > viewportHeight - 12) spotlight.top = viewportHeight - spotlight.height - 12;

  els.tourOverlay.classList.remove("is-centered");
  els.tourSpotlight.hidden = false;
  els.tourSpotlight.style.left = `${spotlight.left}px`;
  els.tourSpotlight.style.top = `${spotlight.top}px`;
  els.tourSpotlight.style.width = `${spotlight.width}px`;
  els.tourSpotlight.style.height = `${spotlight.height}px`;
  els.tourSpotlight.style.setProperty("--tour-radius", target.classList.contains("brand") || target.classList.contains("add-menu") ? "18px" : "22px");

  positionTourCard(spotlight, step.placement || "bottom");
}

function positionTourCard(spotlight, placement) {
  const margin = 18;
  const cardRect = els.tourCard.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  let left = spotlight.left + (spotlight.width - cardRect.width) / 2;
  let top = spotlight.top + spotlight.height + margin;

  if (placement === "top") {
    top = spotlight.top - cardRect.height - margin;
  } else if (placement === "left") {
    left = spotlight.left - cardRect.width - margin;
    top = spotlight.top + (spotlight.height - cardRect.height) / 2;
  } else if (placement === "right") {
    left = spotlight.left + spotlight.width + margin;
    top = spotlight.top + (spotlight.height - cardRect.height) / 2;
  } else if (placement === "bottom-end") {
    left = spotlight.left + spotlight.width - cardRect.width;
  }

  if (top + cardRect.height > viewportHeight - 16 && spotlight.top - cardRect.height - margin > 16) {
    top = spotlight.top - cardRect.height - margin;
  }
  if (top < 16 && spotlight.top + spotlight.height + margin + cardRect.height < viewportHeight - 16) {
    top = spotlight.top + spotlight.height + margin;
  }

  els.tourCard.style.left = `${clamp(left, 16, viewportWidth - cardRect.width - 16)}px`;
  els.tourCard.style.top = `${clamp(top, 16, viewportHeight - cardRect.height - 16)}px`;
  els.tourCard.style.transform = "none";
}

function centerTourCard() {
  els.tourOverlay.classList.add("is-centered");
  els.tourSpotlight.hidden = true;
  els.tourCard.style.left = "50%";
  els.tourCard.style.top = "50%";
  els.tourCard.style.transform = "translate(-50%, -50%)";
}

function resetTourPosition() {
  els.tourOverlay.classList.remove("is-centered");
  if (els.tourSpotlight) {
    els.tourSpotlight.hidden = true;
    els.tourSpotlight.removeAttribute("style");
  }
  if (els.tourCard) {
    els.tourCard.removeAttribute("style");
  }
}

function renderDashboard() {
  const now = new Date();
  const overdue = activeAssignments().filter((item) => item.dueAt && new Date(item.dueAt) < startOfDay(now));
  const dueSoon = upcomingAssignments(7);
  const countedDueSoon = dueSoon.filter(isCountedDueAssignment);
  const sessions = upcomingSessions(7);
  const workload = workloadDays(7);
  const nextWork = nextWorkByCourse();
  const todayItems = todayAgenda();
  const plannedHours = sum(workload.map((day) => day.hours));

  return `
    <section class="plink-hero" data-tour-target="hero">
      <div>
        <h2 class="dashboard-greeting"><span class="greeting-dot" aria-hidden="true"></span>${escapeHtml(dashboardGreeting())}</h2>
        <p>${escapeHtml(dashboardNudge(todayItems, countedDueSoon, overdue))}</p>
      </div>
      <div class="plink-signal" aria-hidden="true">
        <span></span>
        <strong>${todayItems.length}</strong>
      </div>
    </section>

    <div class="stats-grid">
      ${statCard("Courses", state.courses.length)}
      ${statCard("Due in 7 days", countedDueSoon.length, "button", "data-show-due-soon")}
      ${statCard("Overdue", overdue.length)}
      ${statCard("Planned hours", `${plannedHours}h`)}
    </div>

    <div class="layout-grid">
      <div class="panel-stack">
        <section class="panel plink-panel" data-tour-target="today">
          <div class="panel-head">
            <h2>Today</h2>
            <span class="pill ${todayItems.length ? "pulse-pill" : "done"}">${todayItems.length ? `${todayItems.length} signals` : "clear"}</span>
          </div>
          <div class="panel-body today-list">
            ${todayItems.length ? todayItems.map(todayAgendaRow).join("") : emptyState("You're all caught up for today.")}
          </div>
        </section>

        <section class="panel" data-tour-target="next-work">
          <div class="panel-head">
            <h2>Next Work</h2>
            <span class="pill">${nextWork.length} courses</span>
          </div>
          <div class="panel-body assignment-list">
            ${
              nextWork.length
                ? nextWork.map(nextWorkCourseRow).join("")
                : emptyState("Add a course to see each class's next item.")
            }
          </div>
        </section>

        <section class="panel" data-tour-target="study-sessions">
          <div class="panel-head">
            <h2>Study Sessions</h2>
            ${buttonHtml("secondary", "Add", "plus", "data-add-session=\"\"")}
          </div>
          <div class="panel-body assignment-list">
            ${sessions.length ? sessions.slice(0, 6).map(sessionRow).join("") : emptyState("No study sessions planned.")}
          </div>
        </section>
      </div>

      <div class="panel-stack">
  <section class="panel">
    <div class="panel-head">
      <h2>Workload</h2>
      <span class="pill">${sum(workload.map((day) => day.hours))}h</span>
    </div>
    <div class="panel-body workload">
      ${workload.map(workloadRow).join("")}
    </div>
  </section>

  <section class="panel sticky-note-panel" data-tour-target="quick-notes">
    <div class="sticky-note">
      <div class="sticky-note-tape"></div>

      <div class="sticky-note-head">
        Quick Notes
      </div>

      <textarea
        id="quickNoteInput"
        class="sticky-note-input"
        placeholder="Write something down before it disappears into the void..."
      >${escapeHtml(state.ui.quickNote || "")}</textarea>
    </div>
  </section>
</div>
  `;
}

function renderCourses() {
  if (!state.courses.length) {
    return `<section class="panel"><div class="panel-body" style="padding-top:16px">${emptyState("No courses yet.")}</div></section>`;
  }

  return `
    <div class="toolbar">
      <div class="toolbar-group">
        ${buttonHtml("secondary", "Add course", "book-plus", "data-edit-course=\"\"")}
      </div>
      <span class="pill">${state.assignments.length} assignments</span>
    </div>
    <div class="course-grid">
      ${state.courses.map(courseCard).join("")}
    </div>
  `;
}

function renderCalendar() {
  const monthStart = startOfMonth(parseDateOnly(state.ui.monthCursor || state.ui.weekStart) || new Date());
  const monthLabel = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(monthStart);
  const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, index) => addDays(monthStart, index));
  const trailingBlanks = (7 - (days.length % 7)) % 7;

  return `
    <div class="toolbar calendar-toolbar">
      <div class="toolbar-group">
        <button class="icon-button" data-month-nav="-1" type="button" aria-label="Previous month">${icon("chevron-left")}</button>
        <button class="icon-button" data-month-nav="1" type="button" aria-label="Next month">${icon("chevron-right")}</button>
        <button class="secondary" data-calendar-today type="button">Today</button>
        <span class="calendar-month-title">${monthLabel}</span>
      </div>
      ${buttonHtml("primary", "Plan assignment", "clock", "data-add-session=\"\"")}
    </div>
    <div class="month-calendar">
      ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => `<div class="month-weekday">${day}</div>`).join("")}
      ${days.map((day) => calendarDay(day, monthStart)).join("")}
${Array.from({ length: trailingBlanks }, () => `<div class="day-column month-day calendar-blank"></div>`).join("")}
    </div>
  `;
}

function renderManualEntry() {
  const active = activeAssignments().sort(compareDue);
  const recentSessions = [...state.sessions]
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
    .slice(0, 8);

  return `
    <div class="stats-grid">
      ${statCard("Courses", state.courses.length)}
      ${statCard("Assignments", state.assignments.length)}
      ${statCard("Study sessions", state.sessions.length)}
      ${statCard("Active work", active.length)}
    </div>

    <div class="layout-grid">
      <section class="panel">
        <div class="panel-head">
          <h2>Add Items Manually</h2>
          <span class="pill done">No import needed</span>
        </div>
        <div class="panel-body canvas-list">
          <div class="canvas-row">
            <div class="canvas-main">
              <div>
                <div class="canvas-title">1. Add your course</div>
                <div class="meta">Create each class once, then attach assignments and planned work to it.</div>
              </div>
              ${buttonHtml("secondary", "Course", "book-plus", "data-manual-course")}
            </div>
          </div>
          <div class="canvas-row">
            <div class="canvas-main">
              <div>
                <div class="canvas-title">2. Add each assignment</div>
                <div class="meta">Enter title, due date, type, priority, estimate, and notes.</div>
              </div>
              ${buttonHtml("primary", "Assignment", "plus", "data-manual-assignment")}
            </div>
          </div>
          <div class="canvas-row">
            <div class="canvas-main">
              <div>
                <div class="canvas-title">3. Plan study blocks</div>
                <div class="meta">Add study sessions when you want time on the calendar before a deadline.</div>
              </div>
              ${buttonHtml("secondary", "Study session", "clock", "data-manual-session")}
            </div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <h2>Courses</h2>
          ${buttonHtml("secondary", "Add", "book-plus", "data-manual-course")}
        </div>
        <div class="panel-body compact-list">
          ${
            state.courses.length
              ? state.courses.map((course) => `
                  <div class="compact-item">
                    <strong><button class="course-name-button" data-edit-course="${course.id}" type="button">${escapeHtml(course.name)}</button></strong>
                    <span>${assignmentsForCourse(course.id).length} items</span>
                  </div>
                `).join("")
              : emptyState("Add your first course to start.")
          }
        </div>
      </section>
    </div>

    <div class="layout-grid">
      <section class="panel">
        <div class="panel-head">
          <h2>Assignments</h2>
          ${buttonHtml("primary", "Add", "plus", "data-manual-assignment")}
        </div>
        <div class="panel-body assignment-list">
          ${state.assignments.length ? [...state.assignments].sort(compareDue).map((item) => assignmentRow(item, { actions: true })).join("") : emptyState("No assignments yet. Add each item individually here.")}
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <h2>Study Sessions</h2>
          ${buttonHtml("secondary", "Add", "clock", "data-manual-session")}
        </div>
        <div class="panel-body session-list">
          ${recentSessions.length ? recentSessions.map(sessionRow).join("") : emptyState("No study sessions yet.")}
        </div>
      </section>
    </div>
  `;
}

function renderSyllabus() {
  const draft = state.syllabus || {};
  const schedule = draft.schedule || {};
  const parsedItems = Array.isArray(draft.parsedItems) ? draft.parsedItems : [];
  const included = parsedItems.filter((item) => item.include !== false).length;
  const sourceName = draft.fileName || "Paste or upload";
  const screenshot = draft.screenshotDataUrl
    ? `<div class="screenshot-preview"><img src="${escapeAttr(draft.screenshotDataUrl)}" alt="Course due dates screenshot"><button class="ghost" data-clear-screenshot type="button">Clear screenshot</button></div>`
    : `<div class="empty">Upload a screenshot to keep the course/module dates visible while you review extracted items.</div>`;

  return `
    <div class="stats-grid">
      ${statCard("Detected", parsedItems.length)}
      ${statCard("Selected", included)}
      ${statCard("Courses", state.courses.length)}
      ${statCard("Assignments", state.assignments.length)}
    </div>

    <div class="layout-grid">
      <section class="panel">
        <div class="panel-head">
          <h2>Upload Or Paste</h2>
          <span class="pill">${escapeHtml(sourceName)}</span>
        </div>
        <div class="panel-body">
          <div class="syllabus-form">
            <label>
              <span>Syllabus file</span>
              <input id="syllabusFile" type="file" accept=".txt,.md,.markdown,.html,.htm,.csv,.ics,.pdf,.docx">
            </label>
            <label>
              <span>Use existing course</span>
              <select data-syllabus-field="selectedCourseId">
                <option value="">Create a new course</option>
                ${state.courses.map((course) => `<option value="${course.id}" ${draft.selectedCourseId === course.id ? "selected" : ""}>${escapeHtml(course.name)}</option>`).join("")}
              </select>
            </label>
            <button class="primary icon-text" data-parse-syllabus type="button">${icon("clipboard-list")}<span>Extract items</span></button>
            <label>
              <span>Course name</span>
              <input data-syllabus-field="courseName" value="${escapeAttr(draft.courseName || "")}" placeholder="Biology 101">
            </label>
            <label>
              <span>Course code</span>
              <input data-syllabus-field="courseCode" value="${escapeAttr(draft.courseCode || "")}" placeholder="BIO 101">
            </label>
            <label>
              <span>Instructor</span>
              <input data-syllabus-field="instructor" value="${escapeAttr(draft.instructor || "")}" placeholder="Dr. Smith">
            </label>
            <label>
              <span>Course start</span>
              <input data-schedule-field="courseStart" type="date" value="${escapeAttr(schedule.courseStart || "")}">
            </label>
            <label>
              <span>Course end</span>
              <input data-schedule-field="courseEnd" type="date" value="${escapeAttr(schedule.courseEnd || "")}">
            </label>
            <label>
              <span>Default due day</span>
              <select data-schedule-field="defaultDueDay">
                ${weekdayOptions(schedule.defaultDueDay)}
              </select>
            </label>
            <label>
              <span>Week starts</span>
              <select data-schedule-field="weekStartsOn">
                ${weekdayOptions(schedule.weekStartsOn)}
              </select>
            </label>
            <label>
              <span>Week ends</span>
              <select data-schedule-field="weekEndsOn">
                ${weekdayOptions(schedule.weekEndsOn)}
              </select>
            </label>
            <label>
              <span>Default due time</span>
              <input data-schedule-field="defaultDueTime" type="time" value="${escapeAttr(schedule.defaultDueTime || "")}">
            </label>
            <label class="span-3">
              <span>Syllabus text</span>
              <textarea data-syllabus-field="text" placeholder="Paste the schedule, grading section, or full syllabus text here.">${escapeHtml(draft.text || "")}</textarea>
            </label>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <h2>Manual Entry</h2>
          <span class="pill">${escapeHtml(state.settings.importStatus || "Ready")}</span>
        </div>
        <div class="panel-body canvas-list">
          <div class="canvas-row">
            <div class="canvas-main">
              <div>
                <div class="canvas-title">Add items yourself</div>
                <div class="meta">Use this when extraction misses a date or you want to plan ahead manually.</div>
              </div>
              <span class="pill done">Always works</span>
            </div>
          </div>
          <div class="canvas-row">
            <div class="canvas-main">
              <div>
                <div class="canvas-title">Course first</div>
                <div class="meta">Assignments need a course. If none exists, Assignment will ask you to add one.</div>
              </div>
              <span class="pill">${state.courses.length} courses</span>
            </div>
          </div>
          <div class="canvas-row">
            <div class="canvas-main">
              <div>
                <div class="canvas-title">Screenshot reference</div>
                <div class="meta">Upload the course/module due-date screenshot, then fill any visible date rules on the left.</div>
              </div>
              <span class="pill high">${draft.screenshotName ? escapeHtml(draft.screenshotName) : "Optional"}</span>
            </div>
          </div>
          <label class="screenshot-upload">
            <span>Course/module screenshot</span>
            <input id="screenshotFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif">
          </label>
          ${screenshot}
          <div class="toolbar-group">
            ${buttonHtml("secondary", "Course", "book-plus", "data-manual-course")}
            ${buttonHtml("primary", "Assignment", "plus", "data-manual-assignment")}
            ${buttonHtml("secondary", "Study session", "clock", "data-manual-session")}
            ${buttonHtml("secondary", "Try sample", "spark", "data-apply-demo-syllabus")}
            ${buttonHtml("ghost", "Clear draft", "trash", "data-clear-syllabus")}
          </div>
        </div>
      </section>
    </div>

    <section class="panel">
      <div class="panel-head">
        <h2>Detected Items</h2>
        <div class="toolbar-group">
          <span class="pill">${included} selected</span>
          ${buttonHtml("primary", "Save selected", "check", "data-save-syllabus")}
        </div>
      </div>
      <div class="panel-body import-list">
        ${parsedItems.length ? parsedItems.map(syllabusImportCard).join("") : emptyState("Upload or paste a syllabus, then extract items. You can also add an assignment manually from the Manual Entry panel.")}
      </div>
    </section>
  `;
}

function syllabusImportCard(item) {
  const dueValue = item.dueAt ? toDateTimeInput(item.dueAt) : "";
  const source = item.sourceLine ? `<div class="import-source">${escapeHtml(item.sourceLine)}</div>` : "";
  return `
    <div class="import-card">
      <input data-syllabus-item-field="${item.id}" data-field="include" type="checkbox" ${item.include === false ? "" : "checked"} aria-label="Include ${escapeAttr(item.title)}">
      <div>
        <div class="import-fields">
          <label>
            <span>Title</span>
            <input data-syllabus-item-field="${item.id}" data-field="title" value="${escapeAttr(item.title || "")}">
          </label>
          <label>
            <span>Type</span>
            <select data-syllabus-item-field="${item.id}" data-field="type">
              ${assignmentTypeOptions(item.type)}
            </select>
          </label>
          <label>
            <span>Due</span>
            <input data-syllabus-item-field="${item.id}" data-field="dueAt" type="datetime-local" value="${dueValue}">
          </label>
          <label>
            <span>Hours</span>
            <input data-syllabus-item-field="${item.id}" data-field="estimatedHours" type="number" min="0" step="0.25" value="${item.estimatedHours ?? ""}">
          </label>
          <label>
            <span>Priority</span>
            <select data-syllabus-item-field="${item.id}" data-field="priority">
              ${priorityOptions(item.priority || "normal")}
            </select>
          </label>
        </div>
        ${source}
      </div>
    </div>
  `;
}

function assignmentTypeOptions(selected) {
  return ["homework", "quiz", "exam", "essay", "project", "reading", "video", "discussion"]
    .map((type) => `<option value="${type}" ${type === selected ? "selected" : ""}>${typeLabel(type)}</option>`)
    .join("");
}

function priorityOptions(selected) {
  return ["low", "normal", "high", "critical"]
    .map((priority) => `<option value="${priority}" ${priority === selected ? "selected" : ""}>${priorityLabel(priority)}</option>`)
    .join("");
}

function weekdayOptions(selected) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return `<option value="">Auto</option>${days.map((day, index) => `<option value="${index}" ${String(selected) === String(index) ? "selected" : ""}>${day}</option>`).join("")}`;
}

function renderCanvas() {
  const syncedCourses = state.courses.filter((course) => course.canvasId);
  const syncedAssignments = state.assignments.filter((item) => item.canvasId || item.canvasPlannerKey);
  const visibleToken = state.settings.saveToken ? state.settings.token : sessionToken;

  return `
    <section class="panel">
      <div class="panel-head">
        <h2>Canvas Connection</h2>
        <span class="pill">${escapeHtml(state.settings.syncStatus || "Ready")}</span>
      </div>
      <div class="panel-body">
        <div class="canvas-form">
          <label>
            <span>Canvas URL</span>
            <input id="canvasUrl" value="${escapeAttr(state.settings.canvasUrl || CANVAS_DEFAULT_URL)}" autocomplete="off">
          </label>
          <label>
            <span>Access token</span>
            <input id="canvasToken" value="${escapeAttr(visibleToken || "")}" type="password" autocomplete="off">
          </label>
          <button class="primary icon-text" data-canvas-sync type="button">${icon("refresh")}<span>Sync now</span></button>
          <label class="checkline">
            <input id="saveToken" type="checkbox" ${state.settings.saveToken ? "checked" : ""}>
            <span>Remember token</span>
          </label>
          <div class="meta">
            <span>${state.settings.lastSync ? `Last sync ${formatDateTime(state.settings.lastSync)}` : "Not synced yet"}</span>
            <span>${syncedCourses.length} courses</span>
            <span>${syncedAssignments.length} Canvas items</span>
          </div>
          <button class="ghost icon-text" data-canvas-clear type="button">${icon("lock")}<span>Clear token</span></button>
        </div>
      </div>
    </section>

    <div class="layout-grid">
      <section class="panel">
        <div class="panel-head">
          <h2>Synced Courses</h2>
          <span class="pill">${syncedCourses.length}</span>
        </div>
        <div class="panel-body canvas-list">
          ${syncedCourses.length ? syncedCourses.map(canvasCourseRow).join("") : emptyState("No Canvas courses synced.")}
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <h2>Data</h2>
          ${buttonHtml("secondary", "Export", "external", "data-export")}
        </div>
        <div class="panel-body">
          <div class="canvas-row">
            <div class="canvas-main">
              <div>
                <div class="canvas-title">Local courses</div>
                <div class="meta">${state.courses.length} total</div>
              </div>
              <span class="pill">${state.courses.filter((course) => !course.canvasId).length} manual</span>
            </div>
          </div>
          <div class="canvas-row">
            <div class="canvas-main">
              <div>
                <div class="canvas-title">Assignments</div>
                <div class="meta">${activeAssignments().length} active, ${state.assignments.length} total</div>
              </div>
              <span class="pill">${syncedAssignments.length} synced</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function statCard(label, value, tag = "div", attrs = "") {
  const typeAttr = tag === "button" ? "type=\"button\"" : "";
  return `<${tag} class="stat" ${typeAttr} ${attrs}><span>${label}</span><strong>${value}</strong></${tag}>`;
}

function openDueItemsDialog() {
  const items = upcomingAssignments(7).filter(isCountedDueAssignment);
  els.dueItemsBody.innerHTML = items.length
    ? items.map((item) => assignmentRow(item, { actions: true })).join("")
    : emptyState("No counted assignments are due in the next 7 days.");
  hydrateIcons(els.dueItemsBody);
  els.dueItemsBody.querySelectorAll("[data-edit-assignment]").forEach((button) => {
    button.addEventListener("click", () => {
      els.dueItemsDialog.close();
      openAssignmentDialog(button.dataset.editAssignment);
    });
  });
  els.dueItemsBody.querySelectorAll("[data-add-session]").forEach((button) => {
    button.addEventListener("click", () => {
      els.dueItemsDialog.close();
      openSessionDialog(null, button.dataset.addSession || "");
    });
  });
  els.dueItemsBody.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => {
      els.dueItemsDialog.close();
      setAssignmentStatus(button.dataset.assignment, button.dataset.status);
      openDueItemsDialog();
    });
  });
  els.dueItemsDialog.showModal();
}

function openUpdateDialog() {
  renderUpdateState({
    kind: "checking",
    title: "Checking for updates",
    message: "Plink is peeking at the release shelf.",
  });
  els.updateDialog.showModal();
  checkForUpdates();
}

async function checkForUpdates() {
  renderUpdateState({
    kind: "checking",
    title: "Checking for updates",
    message: "Looking for a newer Plink without touching your planner data.",
  });

  if (!UPDATE_MANIFEST_URL) {
    renderUpdateState({
      kind: "warning",
      title: "Update source needed",
      message: "The update checker is installed, but it needs a public latest.json URL before it can find releases. Add that URL in plink-update.js when your download page is ready.",
    });
    return;
  }

  try {
    const manifest = await fetchUpdateManifest();
    latestUpdateManifest = manifest;
    const result = compareVersions(manifest.version, APP_VERSION);

    if (result > 0) {
      renderUpdateState({
        kind: "available",
        title: `Plink ${manifest.version} is available`,
        message: "Download the new installer when you are ready. Existing planner data should stay put because updates replace app files, not local storage.",
        manifest,
      });
      toast(`Plink ${manifest.version} is ready to download.`);
      return;
    }

    renderUpdateState({
      kind: "current",
      title: "You are up to date",
      message: `This copy is running Plink ${APP_VERSION}. No newer release was found.`,
      manifest,
    });
  } catch (error) {
    renderUpdateState({
      kind: "warning",
      title: "Could not check for updates",
      message: error.message || "The update shelf refused to answer. Check the manifest URL and try again.",
    });
  }
}

async function fetchUpdateManifest() {
  const manifestUrl = new URL(UPDATE_MANIFEST_URL, window.location.href);
  manifestUrl.searchParams.set("_", Date.now().toString());
  const response = await fetch(manifestUrl.toString(), { cache: "no-store" });
  if (!response.ok) throw new Error(`latest.json returned ${response.status}.`);
  const manifest = await response.json();
  const version = String(manifest.version || "").trim();
  if (!version) throw new Error("latest.json needs a version field.");
  return {
    version,
    downloadUrl: resolveUpdateUrl(manifest.downloadUrl || manifest.url || UPDATE_DOWNLOAD_URL, manifestUrl),
    notes: manifest.notes || "",
    releasedAt: manifest.releasedAt || manifest.date || "",
  };
}

function renderUpdateState({ kind, title, message, manifest }) {
  const downloadUrl = manifest?.downloadUrl || "";
  const notesHtml = manifest ? updateNotesHtml(manifest.notes) : "";
  const releasedHtml = manifest?.releasedAt ? `<div class="meta">Released ${escapeHtml(manifest.releasedAt)}</div>` : "";

  els.updateDialogTitle.textContent = title;
  els.updateVersionLine.textContent = `Installed: Plink ${APP_VERSION}`;
  els.updateDownloadButton.hidden = !downloadUrl;
  els.updateDownloadButton.dataset.downloadUrl = downloadUrl;
  els.updateCheckAgainButton.disabled = kind === "checking" || (!UPDATE_MANIFEST_URL && kind === "warning");
  els.updateDialogBody.innerHTML = `
    <div class="update-status ${escapeAttr(kind)}">
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(message)}</p>
      ${releasedHtml}
    </div>
    ${notesHtml}
  `;
}

function updateNotesHtml(notes) {
  if (Array.isArray(notes) && notes.length) {
    return `<ul class="update-notes">${notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>`;
  }
  if (typeof notes === "string" && notes.trim()) {
    return `<p class="update-notes">${escapeHtml(notes.trim())}</p>`;
  }
  return "";
}

function openUpdateDownload() {
  const url = els.updateDownloadButton.dataset.downloadUrl || latestUpdateManifest?.downloadUrl || UPDATE_DOWNLOAD_URL;
  if (!url) {
    toast("No download link is available yet.");
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

function resolveUpdateUrl(value, baseUrl) {
  if (!value) return "";
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return "";
  }
}

function courseCard(course) {
  const dueSoon = assignmentsForCourse(course.id).filter((item) => isDueWithin(item, 7) && !isDone(item));
  const overdue = assignmentsForCourse(course.id).filter((item) => item.dueAt && new Date(item.dueAt) < startOfDay(new Date()) && !isDone(item));
  const courseItems = visibleCourseItems(course.id);

  return `
    <article class="course-card" style="--course-color:${course.color}">
      <div class="course-head">
        <div>
          <button class="course-name-button" data-edit-course="${course.id}" type="button">${escapeHtml(course.name)}</button>
          <div class="course-code">${escapeHtml(course.code || course.instructor || "Course")}</div>
        </div>
        <button class="icon-button" data-edit-course="${course.id}" type="button" aria-label="Edit ${escapeAttr(course.name)}">${icon("edit")}</button>
      </div>

      <div class="course-metrics">
        <div class="metric"><span>Active</span><strong>${courseItems.length}</strong></div>
        <div class="metric"><span>Due soon</span><strong>${dueSoon.length}</strong></div>
        <div class="metric"><span>Overdue</span><strong>${overdue.length}</strong></div>
      </div>

      <div class="course-items-scroll compact-list">
        ${courseItems.length ? courseItems.map((item) => `
          <div class="compact-item">
            <strong><button class="course-name-button" data-edit-assignment="${item.id}" type="button">${escapeHtml(item.title)}</button></strong>
            <span>${item.dueAt ? formatShortDate(item.dueAt) : "No due date"} - ${statusLabel(item.status)}</span>
          </div>
        `).join("") : `<div class="empty">You're all caught up.</div>`}
      </div>
    </article>
  `;
}

function assignmentRow(item, options = {}) {
  const course = courseById(item.courseId);
  const due = item.dueAt ? new Date(item.dueAt) : null;
  const overdue = due && due < startOfDay(new Date()) && !isDone(item);
  const priorityClass = overdue ? "overdue" : item.priority;
  const statusClass = item.status === "working" ? "working" : isDone(item) ? "done" : "";
  const doneStatus = item.type === "reading" ? "read" : item.type === "video" ? "completed" : "submitted";
  const doneLabel = item.type === "reading" ? "Read" : item.type === "video" ? "Completed" : "Submitted";
  const canvasLink = item.htmlUrl ? `<a class="pill" href="${escapeAttr(item.htmlUrl)}" target="_blank" rel="noreferrer">${icon("external", "icon-sm")}Canvas</a>` : "";

  return `
    <div class="assignment-row ${options.featured ? "featured" : ""}">
      <div class="assignment-main">
        <div>
          <div class="assignment-title">
            <span class="course-dot" style="--course-color:${course?.color || "#1f9d8a"}"></span>
            <button data-edit-assignment="${item.id}" type="button">${escapeHtml(item.title)}</button>
          </div>
          <div class="meta">
            ${course ? courseChip(course) : ""}
            <span>${typeLabel(item.type)}</span>
            <span>${due ? formatDue(due) : "No due date"}</span>
            <span>${hoursLabel(item.estimatedHours)}</span>
          </div>
        </div>
        <div class="meta">
          <span class="pill ${priorityClass}">${overdue ? "Overdue" : priorityLabel(item.priority)}</span>
          <span class="pill ${statusClass}">${statusLabel(item.status)}</span>
          ${canvasLink}
        </div>
      </div>
      ${
        options.actions
          ? `<div class="toolbar-group">
              <button class="ghost" data-assignment="${item.id}" data-status="working" type="button">Working</button>
              <button class="ghost" data-assignment="${item.id}" data-status="${doneStatus}" type="button">${doneLabel}</button>
              ${buttonHtml("secondary", "Plan", "clock", `data-add-session="${item.id}"`)}
            </div>`
          : ""
      }
    </div>
  `;
}

function nextWorkCourseRow({ course, item }) {
  if (!item) {
    return `
      <div class="assignment-row featured">
        <div class="assignment-main">
          <div>
            <div class="assignment-title">
              <span class="course-dot" style="--course-color:${course?.color || "#1f9d8a"}"></span>
              <button data-edit-course="${course.id}" type="button">${escapeHtml(course.name)}</button>
            </div>
            <div class="meta">
              <span>You're all caught up.</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return assignmentRow(item, { actions: true, featured: true });
}

function sessionRow(session) {
  const course = courseById(session.courseId);
  const assignment = assignmentById(session.assignmentId);

  return `
    <div class="assignment-row featured">
      <div class="assignment-main">
        <div>
          <div class="assignment-title">
            <span class="course-dot" style="--course-color:${course?.color || "#1f9d8a"}"></span>

            <button data-edit-session="${session.id}" type="button">
              ${escapeHtml(session.title)}
            </button>
          </div>

          <div class="meta">
            ${course ? courseChip(course) : ""}
            ${assignment ? `<span>${escapeHtml(assignment.title)}</span>` : ""}
            <span>${formatDateTime(session.startAt)}</span>
            <span>${session.durationMinutes || 60}m</span>
          </div>
        </div>

        <span class="pill ${session.completed ? "done" : ""}">
          ${session.completed ? "Done" : "Planned"}
        </span>
      </div>

      <div class="toolbar-group">
        <button
          class="ghost"
          data-session-complete="${session.id}"
          type="button"
        >
          ${session.completed ? "Completed" : "Mark done"}
        </button>
      </div>
    </div>
  `;
}

function workloadRow(day) {
  const width = Math.min(100, Math.round((day.hours / 5) * 100));
  const className = day.hours >= 5 ? "heavy" : day.hours >= 3 ? "busy" : "";
  return `
    <div class="workload-day">
      <span>${formatWeekday(day.date)}</span>
      <div class="bar-track"><div class="bar-fill ${className}" style="--bar-width:${width}%"></div></div>
      <strong>${round(day.hours)}h</strong>
    </div>
  `;
}

function todayAgenda() {
  const today = new Date();
  const assignments = activeAssignments()
    .filter((item) => item.dueAt && sameDay(new Date(item.dueAt), today))
    .map((item) => ({ kind: "due", item, sort: new Date(item.dueAt).getTime() }));
  const sessions = state.sessions
    .filter((session) => sameDay(new Date(session.startAt), today))
    .map((item) => ({ kind: "session", item, sort: new Date(item.startAt).getTime() }));
  return [...assignments, ...sessions].sort((a, b) => a.sort - b.sort);
}

function todayAgendaRow(entry) {
  if (entry.kind === "session") {
    const session = entry.item;
    const course = courseById(session.courseId);
    return `
      <div class="today-item" style="--course-color:${course?.color || "#1f9d8a"}">
        <span class="today-time">${formatTime(session.startAt)}</span>
        <div>
          <button data-edit-session="${session.id}" type="button">${escapeHtml(session.title)}</button>
          <div class="meta">${course ? courseChip(course) : ""}<span>${session.durationMinutes || 60}m study block</span></div>
        </div>
        <span class="pill">${session.completed ? "Done" : "Study"}</span>
      </div>
    `;
  }

  const item = entry.item;
  const course = courseById(item.courseId);
  return `
    <div class="today-item" style="--course-color:${course?.color || "#1f9d8a"}">
      <span class="today-time">${formatTime(item.dueAt)}</span>
      <div>
        <button data-edit-assignment="${item.id}" type="button">${escapeHtml(item.title)}</button>
        <div class="meta">${course ? courseChip(course) : ""}<span>${typeLabel(item.type)}</span></div>
      </div>
      <span class="pill ${item.priority === "critical" ? "critical" : ""}">Due</span>
    </div>
  `;
}

function dashboardGreeting() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const name = userDisplayName();
  return name ? `${greeting}, ${name}.` : `${greeting}.`;
}

function dashboardNudge(todayItems, dueSoon, overdue) {
  if (overdue.length) return "Let's clear the pressure and get your next move visible.";
  if (todayItems.length) return "A little plink, then the next move. Keep it light and visible.";
  if (dueSoon.length) return `${dueSoon.length} counted item${dueSoon.length === 1 ? "" : "s"} inside the seven-day horizon.`;
  return dashboardMessages[Math.floor(Math.random() * dashboardMessages.length)];
}

function calendarDay(date, visibleMonth = date) {
  const assignments = activeAssignments().filter((item) => item.dueAt && sameDay(new Date(item.dueAt), date));
  const sessions = state.sessions.filter((session) => sameDay(new Date(session.startAt), date));
  const isToday = sameDay(date, new Date());
  const isOutsideMonth = date.getMonth() !== visibleMonth.getMonth();
  const items = [
    ...assignments.map((item) => ({ kind: "Due", item, sort: new Date(item.dueAt).getTime() })),
    ...sessions.map((item) => ({ kind: "Study", item, sort: new Date(item.startAt).getTime() })),
  ].sort((a, b) => a.sort - b.sort);

  return `
    <section class="day-column month-day ${isToday ? "is-today" : ""} ${isOutsideMonth ? "is-muted" : ""}" data-calendar-drop="${toDateInput(date)}">
      <div class="day-head">
        <div>
          <strong>${date.getDate()}</strong>
          <span>${isToday ? "Today" : ""}</span>
      ${
        items.length
          ? items.map((entry) => entry.kind === "Due" ? calendarAssignment(entry.item) : calendarSession(entry.item)).join("")
          : ""
      }
    </section>
  `;
}

function calendarAssignment(item) {
  const course = courseById(item.courseId);
  return `
    <div class="calendar-item" style="--course-color:${course?.color || "#1f9d8a"}">
      <span class="pill">${typeLabel(item.type)}</span>
      <button data-edit-assignment="${item.id}" type="button">${escapeHtml(item.title)}</button>
      <div class="meta">${course ? escapeHtml(course.name) : "Course"}${item.dueAt ? ` at ${formatTime(item.dueAt)}` : ""}</div>
    </div>
  `;
}

function calendarSession(session) {
  const course = courseById(session.courseId);
  return `
    <div class="calendar-item" style="--course-color:${course?.color || "#1f9d8a"}">
      <span class="pill">${session.completed ? "Done" : "Study"}</span>
      <button data-edit-session="${session.id}" type="button">${escapeHtml(session.title)}</button>
      <div class="meta">${formatTime(session.startAt)} for ${session.durationMinutes || 60}m</div>
    </div>
  `;
}

function canvasCourseRow(course) {
  const assignments = assignmentsForCourse(course.id).filter((item) => item.canvasId || item.canvasPlannerKey);
  return `
    <div class="canvas-row">
      <div class="canvas-main">
        <div>
          <div class="canvas-title">${courseChip(course)}</div>
          <div class="meta">${escapeHtml(course.code || "Canvas course")} ${course.instructor ? `- ${escapeHtml(course.instructor)}` : ""}</div>
        </div>
        <span class="pill">${assignments.length} items</span>
      </div>
    </div>
  `;
}

function emptyState(text) {
  return `<div class="empty">${escapeHtml(text)}</div>`;
}

function buttonHtml(className, text, iconName, attrs = "") {
  return `<button class="${className} icon-text" ${attrs} type="button">${icon(iconName)}<span>${text}</span></button>`;
}

function openCourseDialog(id = "") {
  const course = id ? courseById(id) : null;
  document.getElementById("courseDialogTitle").textContent = course ? "Edit Course" : "New Course";
  document.getElementById("courseId").value = course?.id || "";
  document.getElementById("courseName").value = course?.name || "";
  document.getElementById("courseInstructor").value = course?.instructor || "";
  document.getElementById("courseColor").value = course?.color || courseColors[state.courses.length % courseColors.length];
  document.getElementById("deleteCourseButton").style.visibility = course ? "visible" : "hidden";
  els.courseDialog.showModal();
}

function saveCourseFromForm() {
  const id = document.getElementById("courseId").value || uid();
  const existing = courseById(id);
  const course = {
    ...(existing || {}),
    id,
    name: document.getElementById("courseName").value.trim(),
    code: "",
    instructor: document.getElementById("courseInstructor").value.trim(),
    color: document.getElementById("courseColor").value,
    updatedAt: new Date().toISOString(),
  };
  if (!course.name) return;
  state.courses = existing ? state.courses.map((item) => (item.id === id ? course : item)) : [...state.courses, course];
  persist();
  els.courseDialog.close();
  render();
  toast("Course saved.");
}

function deleteCourse(id) {
  const course = courseById(id);
  if (!course) return;
  const ok = confirm(`Delete ${course.name} and its local planner items?`);
  if (!ok) return;
  state.courses = state.courses.filter((item) => item.id !== id);
  state.assignments = state.assignments.filter((item) => item.courseId !== id);
  state.sessions = state.sessions.filter((item) => item.courseId !== id);
  persist();
  els.courseDialog.close();
  render();
  toast("Course deleted.");
}

function openAssignmentDialog(id = "", courseId = "", defaults = {}, customTitle = "Assignment") {
  if (!state.courses.length) {
    toast("Add a course first.");
    openCourseDialog();
    return;
  }
  const assignment = id ? assignmentById(id) : null;
  fillCourseOptions(document.getElementById("assignmentCourse"), assignment?.courseId || courseId || state.courses[0].id);
console.log("CUSTOM TITLE RECEIVED:", customTitle);
document.getElementById("assignmentDialogTitle").textContent = assignment
  ? `Edit ${customTitle}`
  : `New ${customTitle}`;
  document.getElementById("assignmentId").value = assignment?.id || "";
  document.getElementById("assignmentType").value = assignment?.type || defaults.type || "homework";
  document.getElementById("assignmentTitle").value = assignment?.title || defaults.title || "";
  const dueSource = assignment?.dueAt || defaults.dueAt || "";
  document.getElementById("assignmentDueDate").value = dueSource ? toDateInput(new Date(dueSource)) : "";
  document.getElementById("assignmentDueTime").value = dueSource ? toTimeInput(new Date(dueSource)) : "";
  document.getElementById("assignmentStatus").value = assignment?.status || defaults.status || "not-started";
  document.getElementById("assignmentHours").value = assignment?.estimatedHours ?? defaults.estimatedHours ?? "";
  document.getElementById("assignmentPriority").value = assignment?.priority || defaults.priority || "normal";
  document.getElementById("assignmentNotes").value = assignment?.notes || defaults.notes || "";
  document.getElementById("deleteAssignmentButton").style.visibility = assignment ? "visible" : "hidden";
  els.assignmentDialog.showModal();
}

function saveAssignmentFromForm() {
  const id = document.getElementById("assignmentId").value || uid();
  const existing = assignmentById(id);
  const dueDate = document.getElementById("assignmentDueDate").value;
  const dueTime = document.getElementById("assignmentDueTime").value || "23:59";
  const dueValue = dueDate ? `${dueDate}T${dueTime}` : "";
  const assignment = {
    ...(existing || {}),
    id,
    courseId: document.getElementById("assignmentCourse").value,
    type: document.getElementById("assignmentType").value,
    title: document.getElementById("assignmentTitle").value.trim(),
    dueAt: dueValue ? new Date(dueValue).toISOString() : null,
    status: document.getElementById("assignmentStatus").value,
    estimatedHours: numberOrNull(document.getElementById("assignmentHours").value),
    priority: document.getElementById("assignmentPriority").value,
    notes: document.getElementById("assignmentNotes").value.trim(),
    updatedAt: new Date().toISOString(),
  };
  if (!assignment.title || !assignment.courseId) return;
  if (isDone(assignment)) {
    removeAssignmentFromState(id);
    persist();
    els.assignmentDialog.close();
    render();
    playPlink("done");
    toast("Item completed and removed.");
    return;
  }
  state.assignments = existing ? state.assignments.map((item) => (item.id === id ? assignment : item)) : [...state.assignments, assignment];
  persist();
  els.assignmentDialog.close();
  render();
  if (!existing) playPlink("add");
  toast("Assignment saved.");
}

async function deleteAssignment(id) {
  const assignment = assignmentById(id);
  if (!assignment) return;
  const ok = await showConfirmDialog(
  "Delete assignment?",
  `Delete "${assignment.title}"? This cannot be undone.`,
  "Delete"
);
  if (!ok) return;
  state.assignments = state.assignments.filter((item) => item.id !== id);
  state.sessions = state.sessions.filter((item) => item.assignmentId !== id);
  persist();
  els.assignmentDialog.close();
  render();
  toast("Assignment deleted.");
}

function openSessionDialog(id = "", assignmentId = "", startAt = "") {
  if (!state.courses.length) {
  toast("Study sessions need a course to belong to first.");
  playPlink("error");
  return;
}
  const session = id ? sessionById(id) : null;
  const assignment = assignmentId ? assignmentById(assignmentId) : assignmentById(session?.assignmentId);
  const courseId = session?.courseId || assignment?.courseId || state.courses[0].id;
  fillCourseOptions(document.getElementById("sessionCourse"), courseId);
  fillSessionAssignmentOptions(assignment?.id || session?.assignmentId || "");
  document.getElementById("sessionDialogTitle").textContent = session ? "Edit Study Session" : "New Study Session";
  document.getElementById("sessionId").value = session?.id || "";
  document.getElementById("sessionTitle").value = session?.title || (assignment ? `Work on ${assignment.title}` : "Study block");
  document.getElementById("sessionStart").value = session?.startAt ? toDateTimeInput(session.startAt) : toDateTimeInput(startAt || defaultSessionStart());
  document.getElementById("sessionMinutes").value = session?.durationMinutes || 60;
  document.getElementById("sessionCompleted").checked = Boolean(session?.completed);
  document.getElementById("deleteSessionButton").style.visibility = session ? "visible" : "hidden";
  els.sessionDialog.showModal();
}

function fillSessionAssignmentOptions(selected = "") {
  const select = document.getElementById("sessionAssignment");
  const groups = state.courses.map((course) => {
    const assignments = assignmentsForCourse(course.id).sort(compareDue);
    if (!assignments.length) return "";
    return `<optgroup label="${escapeAttr(course.name)}">${assignments.map((item) => `<option value="${item.id}">${escapeHtml(item.title)}${item.dueAt ? ` - ${formatShortDate(item.dueAt)}` : ""}</option>`).join("")}</optgroup>`;
  }).join("");
  select.innerHTML = `<option value="">None</option>${groups}`;
  select.value = selected;
}

function applySelectedSessionAssignment() {
  const assignment = assignmentById(document.getElementById("sessionAssignment").value);
  if (!assignment) return;
  document.getElementById("sessionCourse").value = assignment.courseId;
  const title = document.getElementById("sessionTitle");
  if (!title.value || title.value === "Study block") {
    title.value = `Work on ${assignment.title}`;
  }
}

function saveSessionFromForm() {
  const id = document.getElementById("sessionId").value || uid();
  const existing = sessionById(id);
  const session = {
    ...(existing || {}),
    id,
    courseId: document.getElementById("sessionCourse").value,
    assignmentId: document.getElementById("sessionAssignment").value || null,
    title: document.getElementById("sessionTitle").value.trim(),
    startAt: new Date(document.getElementById("sessionStart").value).toISOString(),
    durationMinutes: Number(document.getElementById("sessionMinutes").value || 60),
    completed: document.getElementById("sessionCompleted").checked,
    updatedAt: new Date().toISOString(),
  };
  if (!session.title || !session.courseId || !session.startAt) return;
  state.sessions = existing ? state.sessions.map((item) => (item.id === id ? session : item)) : [...state.sessions, session];
  persist();
  els.sessionDialog.close();
  render();
  toast("Study session saved.");
}

function deleteSession(id) {
  const session = sessionById(id);
  if (!session) return;
  const ok = confirm(`Delete ${session.title}?`);
  if (!ok) return;
  state.sessions = state.sessions.filter((item) => item.id !== id);
  persist();
  els.sessionDialog.close();
  render();
  toast("Study session deleted.");
}

function fillCourseOptions(select, selected = "") {
  select.innerHTML = state.courses
    .map((course) => `<option value="${course.id}">${escapeHtml(course.name)}</option>`)
    .join("");
  select.value = selected || state.courses[0]?.id || "";
}

async function handleSyllabusFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const rawText = await readFileText(file);
    const lowerName = file.name.toLowerCase();
    let text = lowerName.endsWith(".ics") ? parseIcsText(rawText) : cleanUploadedText(rawText, lowerName);

    state.syllabus.fileName = file.name;
    state.syllabus.text = text;
    state.settings.importStatus = "File loaded";

    if ((lowerName.endsWith(".pdf") || lowerName.endsWith(".docx")) && !looksReadable(text)) {
      state.settings.importStatus = "Paste text instead";
      toast("That file did not expose readable syllabus text here. Paste copied text from it instead.");
    } else {
      toast("Syllabus loaded. Extract items when ready.");
    }

    persist();
    render();
  } catch (error) {
    console.error(error);
    state.settings.importStatus = "Upload failed";
    persist();
    render();
    toast("Could not read that syllabus file.");
  }
}

function readFileText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(reader.error || new Error("File read failed")));
    reader.readAsText(file);
  });
}

async function handleScreenshotFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    toast("Choose an image file for the screenshot.");
    return;
  }
  if (file.size > 2.5 * 1024 * 1024) {
    toast("That screenshot is large. Crop it first so it saves reliably.");
    return;
  }

  try {
    const dataUrl = await readFileDataUrl(file);
    state.syllabus.screenshotName = file.name;
    state.syllabus.screenshotDataUrl = dataUrl;
    persist();
    render();
    toast("Screenshot added as a reference.");
  } catch {
    toast("Could not load that screenshot.");
  }
}

function readFileDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(reader.error || new Error("Image read failed")));
    reader.readAsDataURL(file);
  });
}

function clearScreenshotReference() {
  state.syllabus.screenshotName = "";
  state.syllabus.screenshotDataUrl = "";
  persist();
  render();
}

function parseSyllabusFromInputs() {
  syncSyllabusFieldsFromDom();
  const text = state.syllabus.text || "";
  if (!text.trim()) {
    state.settings.importStatus = "Need text";
    persist();
    render();
    toast("Upload a readable file or paste syllabus text first.");
    return;
  }

  const detected = detectCourseFields(text);
  if (!state.syllabus.selectedCourseId) {
    state.syllabus.courseName ||= detected.name || fileNameWithoutExtension(state.syllabus.fileName) || "Imported Course";
    state.syllabus.courseCode ||= detected.code || "";
    state.syllabus.instructor ||= detected.instructor || "";
  }

  const parsedItems = parseSyllabusText(text, scheduleOverridesFromState());
  state.syllabus.parsedItems = parsedItems;
  state.settings.importStatus = parsedItems.length ? `Found ${parsedItems.length} items` : "No dated items found";
  persist();
  render();
  toast(parsedItems.length ? `Found ${parsedItems.length} possible items. Review before saving.` : "I did not find dated assignment lines. You can still add them manually.");
}

function syncSyllabusFieldsFromDom() {
  els.viewRoot.querySelectorAll("[data-syllabus-field]").forEach((field) => {
    state.syllabus[field.dataset.syllabusField] = field.value;
  });
  els.viewRoot.querySelectorAll("[data-schedule-field]").forEach((field) => {
    state.syllabus.schedule = { ...(state.syllabus.schedule || {}), [field.dataset.scheduleField]: field.value };
  });
}

function updateSyllabusItemField(id, field, value) {
  state.syllabus.parsedItems = state.syllabus.parsedItems.map((item) => {
    if (item.id !== id) return item;
    if (field === "include") return { ...item, include: Boolean(value) };
    if (field === "estimatedHours") return { ...item, estimatedHours: numberOrNull(value) };
    if (field === "dueAt") return { ...item, dueAt: value ? new Date(value).toISOString() : null };
    return { ...item, [field]: value };
  });
  persist();
}

function saveSyllabusItems() {
  syncSyllabusFieldsFromDom();
  const selectedItems = (state.syllabus.parsedItems || []).filter((item) => item.include !== false && item.title?.trim());
  if (!selectedItems.length) {
    toast("Select at least one detected item first.");
    return;
  }

  let course = courseById(state.syllabus.selectedCourseId);
  if (!course) {
    course = {
      id: uid(),
      name: state.syllabus.courseName?.trim() || fileNameWithoutExtension(state.syllabus.fileName) || "Imported Course",
      code: state.syllabus.courseCode?.trim() || "",
      instructor: state.syllabus.instructor?.trim() || "",
      color: courseColors[state.courses.length % courseColors.length],
      source: "syllabus",
      updatedAt: new Date().toISOString(),
    };
    state.courses = [...state.courses, course];
    state.syllabus.selectedCourseId = course.id;
  }

  const existingKeys = new Set(state.assignments.map((item) => `${item.courseId}|${item.title.toLowerCase()}|${item.dueAt || ""}`));
  const imported = selectedItems
    .map((item) => ({
      id: uid(),
      courseId: course.id,
      type: item.type || "homework",
      title: item.title.trim(),
      dueAt: item.dueAt || null,
      status: "not-started",
      estimatedHours: item.estimatedHours ?? estimateHours(item.type || "homework", null),
      priority: item.priority || inferPriority(item.dueAt),
      notes: item.sourceLine || "",
      source: "syllabus",
      updatedAt: new Date().toISOString(),
    }))
    .filter((item) => {
      const key = `${item.courseId}|${item.title.toLowerCase()}|${item.dueAt || ""}`;
      if (existingKeys.has(key)) return false;
      existingKeys.add(key);
      return true;
    });

  state.assignments = [...state.assignments, ...imported];
  state.settings.lastImport = new Date().toISOString();
  state.settings.importStatus = `Saved ${imported.length} items`;
  persist();
  render();
  toast(imported.length ? `Saved ${imported.length} assignments.` : "Those items were already in the planner.");
}

function clearSyllabusDraft() {
  state.syllabus = {
    fileName: "",
    text: "",
    selectedCourseId: "",
    courseName: "",
    courseCode: "",
    instructor: "",
    screenshotName: "",
    screenshotDataUrl: "",
    schedule: {
      courseStart: "",
      courseEnd: "",
      weekStartsOn: "",
      weekEndsOn: "",
      defaultDueDay: "",
      defaultDueTime: "",
    },
    parsedItems: [],
  };
  state.settings.importStatus = "Ready";
  persist();
  render();
}

function loadDemoSyllabus() {
  state.syllabus = {
    ...state.syllabus,
    fileName: "sample-syllabus.txt",
    courseName: state.syllabus.courseName || "Sample Online Course",
    courseCode: state.syllabus.courseCode || "ONLINE 101",
    instructor: state.syllabus.instructor || "Instructor",
    text: [
      "Course: Sample Online Course",
      "Instructor: Instructor",
      "Course dates: June 1, 2026 through July 26, 2026",
      "Weeks begin Monday and end Sunday.",
      "All assignments are due Sunday by 11:59 PM.",
      "Module 1",
      "Reading Chapter 1",
      "Discussion post",
      "Quiz 1",
      "Module 2",
      "Project proposal",
      "Midterm Exam due July 1, 2026 at 8:00 PM",
    ].join("\n"),
  };
  state.settings.importStatus = "Sample loaded";
  persist();
  render();
}

function cleanUploadedText(text, fileName = "") {
  if (fileName.endsWith(".html") || fileName.endsWith(".htm")) return stripHtml(text);
  return text
    .replace(/\u0000/g, "")
    .replace(/\t+/g, " | ")
    .replace(/\u00a0/g, " ")
    .replace(/[^\S\r\n]+/g, " ")
    .replace(/\r/g, "\n")
    .trim();
}

function looksReadable(text) {
  const sample = text.slice(0, 4000);
  if (!sample.trim()) return false;
  const readable = (sample.match(/[A-Za-z0-9 .,;:'"!?@#%&()/\-\n]/g) || []).length;
  return readable / sample.length > 0.72 && /assignment|course|due|week|module|exam|quiz|reading|discussion/i.test(sample);
}

function parseIcsText(text) {
  const events = [];
  for (const block of text.split("BEGIN:VEVENT").slice(1)) {
    const summary = unfoldIcsValue(block.match(/\nSUMMARY(?:;[^:]*)?:(.+)/i)?.[1] || "");
    const date = unfoldIcsValue(block.match(/\n(?:DUE|DTSTART)(?:;[^:]*)?:(.+)/i)?.[1] || "");
    if (summary && date) events.push(`${summary} due ${date}`);
  }
  return events.join("\n");
}

function unfoldIcsValue(value) {
  return value.replace(/\\n/g, " ").replace(/\\,/g, ",").trim();
}

function detectCourseFields(text) {
  const lines = normalizeSyllabusLines(text).slice(0, 80);
  const detected = { name: "", code: "", instructor: "" };
  for (const line of lines) {
    detected.name ||= line.match(/\b(?:course|class)\s*(?:title|name)?\s*:\s*(.+)$/i)?.[1]?.trim() || "";
    detected.code ||= line.match(/\b(?:course|class)\s*(?:code|number|#)\s*:\s*([A-Z]{2,6}\s*[- ]?\d{2,4}[A-Z]?)\b/i)?.[1]?.trim() || "";
    detected.code ||= line.match(/\b([A-Z]{2,6}\s*[- ]?\d{2,4}[A-Z]?)\b/)?.[1]?.trim() || "";
    detected.instructor ||= line.match(/\b(?:instructor|professor|faculty)\s*:\s*(.+)$/i)?.[1]?.trim() || "";
  }
  if (!detected.name) {
    detected.name = lines.find((line) => line.length > 5 && line.length < 80 && !/\b(syllabus|schedule|calendar)\b/i.test(line)) || "";
  }
  return detected;
}

function parseSyllabusText(text, scheduleOverrides = {}) {
  const lines = normalizeSyllabusLines(text);
  const defaultYear = inferSyllabusYear(text);
  const courseCalendar = applyScheduleOverrides(inferCourseCalendar(text, defaultYear), scheduleOverrides, defaultYear);
  const items = [];
  const seen = new Set();
  let activeRange = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (shouldSkipSyllabusLine(line)) continue;

    const range = findDateRangeInLine(line, defaultYear) || inferModuleRangeFromLine(line, courseCalendar);
    if (range) activeRange = range;
    const contextRange = range || activeRange;

    const previous = lines[index - 1] || "";
    const next = lines[index + 1] || "";
    const ownDate = findDateInLine(line, {
      activeRange: contextRange,
      courseCalendar,
      defaultYear,
      allowDefaultDue: looksLikeCoursework(line, line),
    });
    const candidates = [];

    if (ownDate) {
      candidates.push({ text: line, sourceLine: line });
      if (previous && looksLikeDetachedTitle(previous) && !findDateInLine(previous, { activeRange: contextRange, courseCalendar, defaultYear })) {
        candidates.push({ text: `${previous} ${line}`, sourceLine: `${previous} ${line}` });
      }
    } else if (next && looksLikeDetachedTitle(line) && !shouldSkipSyllabusLine(next) && findDateInLine(next, { activeRange: contextRange, courseCalendar, defaultYear })) {
      candidates.push({ text: `${line} ${next}`, sourceLine: `${line} ${next}` });
    }

    for (const candidate of candidates) {
      const item = syllabusItemFromLine(candidate.text, candidate.sourceLine, contextRange, defaultYear, courseCalendar);
      if (!item) continue;
      const key = `${item.title.toLowerCase()}|${item.dueAt}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(item);
      break;
    }
  }

  return items.sort(compareDue);
}

function normalizeSyllabusLines(text) {
  return cleanUploadedText(text)
    .split("\n")
    .flatMap((line) => line.split(/(?<=\d{4}|\d{1,2}\/\d{1,2})\s+(?=(?:Week|Module|Unit|Lesson)\s+\d+)/i))
    .map((line) => line.replace(/^[\-*•]\s*/, "").replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function shouldSkipSyllabusLine(line) {
  if (line.length > 360) return true;
  if (/^(week|module|unit|lesson|date|due date|assignment|topic|readings?|activities?|points?)\s*(\|\s*)*$/i.test(line)) return true;
  if (/^\s*(?:assignment|activity|task|deliverable|item)\s*\|\s*(?:due date|date|deadline)\b/i.test(line)) return true;
  if (isDefaultDueRuleLine(line)) return true;
  if (/holiday|spring break|fall break|no class|drop date|withdraw|tuition|office hours|copyright|accessibility/i.test(line)) return true;
  return false;
}

function looksLikeDetachedTitle(line) {
  if (!line || shouldSkipSyllabusLine(line)) return false;
  if (findDateInLine(line, { defaultYear: inferSyllabusYear(line) })) return false;
  if (/^\s*(?:course|class|instructor|professor|faculty|syllabus|schedule|calendar)\b/i.test(line)) return false;
  if (/^\s*(?:week|module|unit|lesson)\s+\d+\s*$/i.test(line)) return false;
  return looksLikeCoursework(line, line);
}

function syllabusItemFromLine(line, sourceLine, activeRange, defaultYear, courseCalendar = null) {
  const date = findDateInLine(line, {
    activeRange,
    courseCalendar,
    defaultYear,
    allowDefaultDue: looksLikeCoursework(line, line),
  });
  if (!date) return null;
  const title = extractSyllabusTitle(line, date);
  if (!title || title.length < 3 || !looksLikeCoursework(title, line)) return null;

  const type = detectType({ name: title });
  const dueAt = date.date.toISOString();
  return {
    id: uid(),
    include: true,
    title,
    type,
    dueAt,
    estimatedHours: estimateHours(type, null),
    priority: inferPriority(dueAt),
    sourceLine,
  };
}

function findDateInLine(line, options = {}) {
  const defaultYear = options.defaultYear || new Date().getFullYear();
  const matches = findDateMatchesInLine(line, defaultYear);
  const weekdayDue = findWeekdayDueInLine(line, options.activeRange, options.courseCalendar);
  if (weekdayDue) matches.push(weekdayDue);
  const defaultDue = options.allowDefaultDue ? findDefaultDueInRange(line, options.activeRange, options.courseCalendar) : null;
  if (defaultDue) matches.push(defaultDue);
  if (!matches.length) return null;

  const dueIndex = keywordIndex(line, /\b(?:due|deadline|submit|submitted|complete|completed|closes?|ends?|by|before)\b/i);
  if (dueIndex >= 0) {
    const afterDue = matches.find((match) => match.index >= dueIndex);
    if (afterDue) return afterDue;
  }

  const range = findDateRangeInLine(line, defaultYear);
  if (range && matches.length > 1) return range.end;

  return matches[matches.length - 1];
}

function findDateMatchesInLine(line, defaultYear) {
  const matches = [];
  const numericPattern = /\b(0?[1-9]|1[0-2])[\/.-](0?[1-9]|[12]\d|3[01])(?:[\/.-](\d{2,4}))?\b/g;
  const monthPattern = /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?/gi;
  const compactIcsPattern = /\b(20\d{2})(\d{2})(\d{2})(?:T(\d{2})(\d{2}))?\b/g;

  for (const match of line.matchAll(numericPattern)) {
    const date = buildDateMatch(line, match[0], Number(match[1]), Number(match[2]), normalizeYear(match[3], defaultYear), match.index);
    if (date) matches.push(date);
  }

  for (const match of line.matchAll(monthPattern)) {
    const date = buildDateMatch(line, match[0], monthNumber(match[1]), Number(match[2]), normalizeYear(match[3], defaultYear), match.index);
    if (date) matches.push(date);
  }

  for (const match of line.matchAll(compactIcsPattern)) {
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4] || 23), Number(match[5] || 59));
    if (validDateParts(date, Number(match[1]), Number(match[2]), Number(match[3]))) {
      matches.push({ text: match[0], date, index: match.index, explicitYear: true });
    }
  }

  return dedupeDateMatches(matches).sort((a, b) => a.index - b.index);
}

function findDateRangeInLine(line, defaultYear = new Date().getFullYear()) {
  const numeric = line.match(/\b(0?[1-9]|1[0-2])[\/.-](0?[1-9]|[12]\d|3[01])(?:[\/.-](\d{2,4}))?\s*(?:-|–|—|to|through|thru)\s*(?:(0?[1-9]|1[0-2])[\/.-])?(0?[1-9]|[12]\d|3[01])(?:[\/.-](\d{2,4}))?\b/i);
  if (numeric) {
    const startMonth = Number(numeric[1]);
    const startYear = normalizeYear(numeric[3], defaultYear);
    const endMonth = Number(numeric[4] || numeric[1]);
    const endYear = normalizeYear(numeric[6] || numeric[3], defaultYear);
    const start = buildDateMatch(line, numeric[0], startMonth, Number(numeric[2]), startYear, numeric.index);
    const end = buildDateMatch(line, numeric[0], endMonth, Number(numeric[5]), endYear, numeric.index + numeric[0].length - String(numeric[5]).length);
    if (start && end) return { start, end };
  }

  const monthRange = line.match(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?\s*(?:-|–|—|to|through|thru)\s*(?:(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+)?(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?/i);
  if (monthRange) {
    const startMonth = monthNumber(monthRange[1]);
    const startYear = normalizeYear(monthRange[3], defaultYear);
    const endMonth = monthRange[4] ? monthNumber(monthRange[4]) : startMonth;
    const endYear = normalizeYear(monthRange[6] || monthRange[3], defaultYear);
    const start = buildDateMatch(line, monthRange[0], startMonth, Number(monthRange[2]), startYear, monthRange.index);
    const end = buildDateMatch(line, monthRange[0], endMonth, Number(monthRange[5]), endYear, monthRange.index + monthRange[0].length - String(monthRange[5]).length);
    if (start && end) return { start, end };
  }

  return null;
}

function inferCourseCalendar(text, defaultYear = new Date().getFullYear()) {
  const lines = normalizeSyllabusLines(text).slice(0, 120);
  const calendar = {
    courseRange: null,
    weekStartsOn: null,
    weekEndsOn: null,
    defaultDueDay: null,
    defaultDueTime: null,
  };
  let pendingStart = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const weekdayRange = findWeekdayRangeInLine(line);
    if (weekdayRange && /\b(?:course|class|week|module|unit|lesson|runs?|begins?|starts?|ends?|follows?|schedule)\b/i.test(line)) {
      calendar.weekStartsOn ??= weekdayRange.start;
      calendar.weekEndsOn ??= weekdayRange.end;
    }

    const dueDay = findDefaultDueDayInLine(line);
    if (dueDay != null) {
      calendar.defaultDueDay ??= dueDay;
      calendar.defaultDueTime ??= findTimeInLine(line);
    }

    const courseRange = findCourseDateSpanInLine(line, defaultYear);
    if (courseRange && (!calendar.courseRange || spanDays(courseRange) > spanDays(calendar.courseRange))) {
      calendar.courseRange = courseRange;
    }

    const dates = findDateMatchesInLine(line, defaultYear);
    if (dates.length === 1 && /\b(?:start|starts|begin|begins|opens?)\b/i.test(line)) {
      pendingStart = dates[0];
    }
    if (dates.length === 1 && pendingStart && /\b(?:end|ends|finish|finishes|closes?)\b/i.test(line)) {
      const splitRange = { start: pendingStart, end: dates[0] };
      if (!calendar.courseRange || spanDays(splitRange) > spanDays(calendar.courseRange)) {
        calendar.courseRange = splitRange;
      }
    }

    if (!calendar.courseRange) {
      const broadRange = findDateRangeInLine(line, defaultYear);
      if (broadRange && index < 40 && spanDays(broadRange) >= 21) {
        calendar.courseRange = broadRange;
      }
    }
  }

  if (calendar.courseRange && calendar.weekStartsOn == null) {
    calendar.weekStartsOn = calendar.courseRange.start.date.getDay();
  }
  if (calendar.weekStartsOn != null && calendar.weekEndsOn == null) {
    calendar.weekEndsOn = (calendar.weekStartsOn + 6) % 7;
  }
  if (calendar.defaultDueDay == null && calendar.weekEndsOn != null) {
    calendar.defaultDueDay = calendar.weekEndsOn;
  }
  if (!calendar.defaultDueTime) {
    calendar.defaultDueTime = { hours: 23, minutes: 59 };
  }

  return calendar.courseRange ? calendar : null;
}

function scheduleOverridesFromState() {
  const schedule = state.syllabus?.schedule || {};
  return {
    courseStart: schedule.courseStart || "",
    courseEnd: schedule.courseEnd || "",
    weekStartsOn: schedule.weekStartsOn || "",
    weekEndsOn: schedule.weekEndsOn || "",
    defaultDueDay: schedule.defaultDueDay || "",
    defaultDueTime: schedule.defaultDueTime || "",
  };
}

function applyScheduleOverrides(calendar, overrides = {}, defaultYear = new Date().getFullYear()) {
  const merged = calendar ? structuredCloneCalendar(calendar) : {
    courseRange: null,
    weekStartsOn: null,
    weekEndsOn: null,
    defaultDueDay: null,
    defaultDueTime: null,
  };

  const start = parseDateOnly(overrides.courseStart);
  const end = parseDateOnly(overrides.courseEnd);
  if (start && end) {
    merged.courseRange = {
      start: { text: "Course start", date: startOfDay(start), index: 0, explicitYear: true },
      end: { text: "Course end", date: endOfDay(end), index: 0, explicitYear: true },
    };
  } else if (start && !merged.courseRange) {
    merged.courseRange = {
      start: { text: "Course start", date: startOfDay(start), index: 0, explicitYear: true },
      end: { text: "Course end", date: endOfDay(addDays(start, 55)), index: 0, explicitYear: true },
    };
  } else if (end && !merged.courseRange) {
    merged.courseRange = {
      start: { text: "Course start", date: startOfDay(new Date(defaultYear, 0, 1)), index: 0, explicitYear: true },
      end: { text: "Course end", date: endOfDay(end), index: 0, explicitYear: true },
    };
  }

  if (overrides.weekStartsOn !== "") merged.weekStartsOn = Number(overrides.weekStartsOn);
  if (overrides.weekEndsOn !== "") merged.weekEndsOn = Number(overrides.weekEndsOn);
  if (overrides.defaultDueDay !== "") merged.defaultDueDay = Number(overrides.defaultDueDay);
  if (overrides.defaultDueTime) merged.defaultDueTime = timeFromInput(overrides.defaultDueTime);

  if (merged.courseRange && merged.weekStartsOn == null) merged.weekStartsOn = merged.courseRange.start.date.getDay();
  if (merged.weekStartsOn != null && merged.weekEndsOn == null) merged.weekEndsOn = (merged.weekStartsOn + 6) % 7;
  if (merged.defaultDueDay == null && merged.weekEndsOn != null) merged.defaultDueDay = merged.weekEndsOn;
  if (!merged.defaultDueTime) merged.defaultDueTime = { hours: 23, minutes: 59 };

  return merged.courseRange ? merged : null;
}

function structuredCloneCalendar(calendar) {
  return {
    courseRange: calendar.courseRange ? {
      start: { ...calendar.courseRange.start, date: new Date(calendar.courseRange.start.date) },
      end: { ...calendar.courseRange.end, date: new Date(calendar.courseRange.end.date) },
    } : null,
    weekStartsOn: calendar.weekStartsOn,
    weekEndsOn: calendar.weekEndsOn,
    defaultDueDay: calendar.defaultDueDay,
    defaultDueTime: calendar.defaultDueTime ? { ...calendar.defaultDueTime } : null,
  };
}

function timeFromInput(value) {
  const [hours, minutes] = String(value).split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return { hours, minutes };
}

function findCourseDateSpanInLine(line, defaultYear) {
  if (!/\b(?:course|class|term|semester|session|start|starts|begin|begins|end|ends|runs|dates|available)\b/i.test(line)) return null;
  const directRange = findDateRangeInLine(line, defaultYear);
  if (directRange) return directRange;
  const dates = findDateMatchesInLine(line, defaultYear);
  if (dates.length >= 2) {
    return { start: dates[0], end: dates[dates.length - 1] };
  }
  return null;
}

function inferModuleRangeFromLine(line, courseCalendar) {
  if (!courseCalendar?.courseRange) return null;
  const module = line.match(/\b(?:week|module|unit|lesson)\s*(\d{1,2})\b/i);
  if (!module) return null;
  const number = Number(module[1]);
  if (!Number.isFinite(number) || number < 1) return null;

  const start = addDays(startOfDay(courseCalendar.courseRange.start.date), (number - 1) * 7);
  const end = endOfDay(addDays(start, 6));
  if (start > courseCalendar.courseRange.end.date) return null;
  const boundedEnd = end > courseCalendar.courseRange.end.date ? endOfDay(courseCalendar.courseRange.end.date) : end;

  return {
    start: { text: module[0], date: start, index: module.index, explicitYear: true },
    end: { text: module[0], date: boundedEnd, index: module.index, explicitYear: true },
  };
}

function findWeekdayDueInLine(line, activeRange, courseCalendar = null) {
  if (!activeRange || !/\b(?:due|deadline|submit|complete|by|before)\b/i.test(line)) return null;
  const weekday = line.match(/\b(Sun(?:day)?|Mon(?:day)?|Tue(?:s(?:day)?)?|Wed(?:nesday)?|Thu(?:rs(?:day)?)?|Fri(?:day)?|Sat(?:urday)?)\b/i);
  if (!weekday) return null;
  return dateForWeekdayInRange(line, activeRange, weekdayNumber(weekday[1]), weekday[0], weekday.index, courseCalendar);
}

function findDefaultDueInRange(line, activeRange, courseCalendar = null) {
  if (!activeRange || courseCalendar?.defaultDueDay == null) return null;
  if (findDateMatchesInLine(line, activeRange.start.date.getFullYear()).length) return null;
  return dateForWeekdayInRange(line, activeRange, courseCalendar.defaultDueDay, weekdayName(courseCalendar.defaultDueDay), line.length, courseCalendar, true);
}

function dateForWeekdayInRange(line, activeRange, target, text, index, courseCalendar = null, fromCalendar = false) {
  const start = startOfDay(activeRange.start.date);
  const end = endOfDay(activeRange.end.date);
  for (let date = new Date(start); date <= end; date = addDays(date, 1)) {
    if (date.getDay() === target) {
      const matched = buildDateMatch(line, text, date.getMonth() + 1, date.getDate(), date.getFullYear(), index);
      if (matched && fromCalendar && courseCalendar?.defaultDueTime) {
        matched.date.setHours(courseCalendar.defaultDueTime.hours, courseCalendar.defaultDueTime.minutes, 0, 0);
      }
      return matched;
    }
  }
  return null;
}

function buildDateMatch(line, text, month, day, year, index = 0) {
  let date = new Date(year, month - 1, day, 23, 59, 0, 0);
  if (!validDateParts(date, year, month, day)) return null;
  if (!yearWasExplicit(text) && date < addDays(new Date(), -180)) {
    date = new Date(year + 1, month - 1, day, 23, 59, 0, 0);
  }
  const time = line.match(/\b(\d{1,2})(?::(\d{2}))?\s*(A\.?M\.?|P\.?M\.?)\b/i) || line.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  if (time) {
    let hours = Number(time[1]);
    const minutes = Number(time[2] || 0);
    const meridiem = time[3]?.toUpperCase().replace(/\./g, "");
    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    date.setHours(hours, minutes, 0, 0);
  } else if (/\bnoon\b/i.test(line)) {
    date.setHours(12, 0, 0, 0);
  } else if (/\bmidnight\b/i.test(line)) {
    date.setHours(0, 0, 0, 0);
  }
  return { text, date, index, explicitYear: yearWasExplicit(text) };
}

function yearWasExplicit(text) {
  return /\b\d{4}\b|\b\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}\b/.test(text);
}

function normalizeYear(value, fallback = new Date().getFullYear()) {
  if (!value) return fallback;
  const year = Number(value);
  if (year < 100) return year + 2000;
  return year;
}

function inferSyllabusYear(text) {
  const counts = new Map();
  for (const match of text.matchAll(/\b(20\d{2})\b/g)) {
    const year = Number(match[1]);
    counts.set(year, (counts.get(year) || 0) + 1);
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || new Date().getFullYear();
}

function monthNumber(value) {
  return ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].findIndex((month) => value.toLowerCase().startsWith(month)) + 1;
}

function weekdayNumber(value) {
  return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].findIndex((day) => value.toLowerCase().startsWith(day));
}

function weekdayName(value) {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][value] || "Sunday";
}

function findWeekdayRangeInLine(line) {
  const weekday = "(?:Sun(?:day)?|Mon(?:day)?|Tue(?:s(?:day)?)?|Wed(?:nesday)?|Thu(?:rs(?:day)?)?|Fri(?:day)?|Sat(?:urday)?)";
  const match = line.match(new RegExp(`\\b(${weekday})\\b.{0,24}?\\b(?:to|through|thru|until|-)\\b.{0,24}?\\b(${weekday})\\b`, "i"))
    || line.match(new RegExp(`\\b(?:begin|begins|start|starts)\\b.{0,24}?\\b(${weekday})\\b.{0,32}?\\b(?:end|ends|finish|finishes)\\b.{0,24}?\\b(${weekday})\\b`, "i"));
  if (!match) return null;
  return { start: weekdayNumber(match[1]), end: weekdayNumber(match[2]) };
}

function findDefaultDueDayInLine(line) {
  if (!/\b(?:due|deadline|submit|submitted|complete|completed)\b/i.test(line)) return null;
  if (!/\b(?:all|assignments?|coursework|work|activities|quizzes|exams|discussions?|posts?|deliverables|items?|tasks?)\b/i.test(line)) return null;
  const weekday = line.match(/\b(Sun(?:day)?|Mon(?:day)?|Tue(?:s(?:day)?)?|Wed(?:nesday)?|Thu(?:rs(?:day)?)?|Fri(?:day)?|Sat(?:urday)?)\b/i);
  return weekday ? weekdayNumber(weekday[1]) : null;
}

function isDefaultDueRuleLine(line) {
  if (findDefaultDueDayInLine(line) == null) return false;
  return /^\s*(?:all\s+)?(?:assignments?|coursework|work|activities|quizzes|exams|discussions?|discussion posts?|posts?|deliverables|items?|tasks?)\b/i.test(line);
}

function findTimeInLine(line) {
  const match = line.match(/\b(\d{1,2})(?::(\d{2}))?\s*(A\.?M\.?|P\.?M\.?)\b/i) || line.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  if (!match) {
    if (/\bnoon\b/i.test(line)) return { hours: 12, minutes: 0 };
    if (/\bmidnight\b/i.test(line)) return { hours: 0, minutes: 0 };
    return null;
  }
  let hours = Number(match[1]);
  const minutes = Number(match[2] || 0);
  const meridiem = match[3]?.toUpperCase().replace(/\./g, "");
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
}

function spanDays(range) {
  if (!range?.start?.date || !range?.end?.date) return 0;
  return Math.round((startOfDay(range.end.date) - startOfDay(range.start.date)) / MS_PER_DAY) + 1;
}

function extractSyllabusTitle(line, dateMatch) {
  const cleaned = line.replace(/\s*\|\s*/g, " | ").replace(/\s+/g, " ").trim();
  const dueIndex = keywordIndex(cleaned, /\b(?:due|deadline|submit|submitted|complete|completed|closes?|ends?)\b/i);
  let title = dueIndex > 4 ? cleaned.slice(0, dueIndex) : "";
  if (!title && dateMatch.index <= Math.max(10, cleaned.length * 0.25)) {
    title = cleaned.slice(dateMatch.index + dateMatch.text.length);
  }
  if (!title) title = cleaned;

  title = chooseSyllabusTitleSegment(stripDateFragments(title));

  title = title
    .replace(/\b(?:by|at)\s+\d{1,2}(?::\d{2})?\s*(?:A\.?M\.?|P\.?M\.?)\b/gi, " ")
    .replace(/\b(?:by|at)\s+([01]?\d|2[0-3]):([0-5]\d)\b/gi, " ")
    .replace(/\b(?:due|deadline|submit|submitted|complete|completed|available|opens|closes|before|by|on)\b/gi, " ")
    .replace(/^\s*(?:week|module|unit|lesson)\s*\d+\s*[-:.)]?\s*/i, "")
    .replace(/^\s*\d+\s*[-:.)]\s*/, "")
    .replace(/\b\d+(?:\.\d+)?\s*(?:pts?|points?|%)\b/gi, " ")
    .replace(/[-:;|]+$/g, "")
    .replace(/^[-:;|]+/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (title.length < 4) {
    title = chooseSyllabusTitleSegment(stripDateFragments(cleaned))
      .replace(/\b\d+(?:\.\d+)?\s*(?:pts?|points?|%)\b/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  return title.slice(0, 120);
}

function chooseSyllabusTitleSegment(value) {
  const segments = value
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => !/^(?:week|module|unit|lesson)\s+\d+$/i.test(part))
    .filter((part) => !/^[-:;]+$/.test(part))
    .filter((part) => !/^\d+(?:\.\d+)?\s*(?:pts?|points?|%)$/i.test(part));

  if (!segments.length) return value;
  const courseworkSegments = segments.filter((part) => hasCourseworkWord(part));
  return (courseworkSegments.at(-1) || segments[0]).trim();
}

function stripDateFragments(value) {
  return value
    .replace(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?\s*(?:-|–|—|to|through|thru)\s*(?:(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+)?\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?/gi, " ")
    .replace(/\b(0?[1-9]|1[0-2])[\/.-](0?[1-9]|[12]\d|3[01])(?:[\/.-](\d{2,4}))?\s*(?:-|–|—|to|through|thru)\s*(?:(0?[1-9]|1[0-2])[\/.-])?(0?[1-9]|[12]\d|3[01])(?:[\/.-](\d{2,4}))?\b/gi, " ")
    .replace(/\b(0?[1-9]|1[0-2])[\/.-](0?[1-9]|[12]\d|3[01])(?:[\/.-](\d{2,4}))?\b/gi, " ")
    .replace(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?/gi, " ")
    .replace(/\b(Sun(?:day)?|Mon(?:day)?|Tue(?:s(?:day)?)?|Wed(?:nesday)?|Thu(?:rs(?:day)?)?|Fri(?:day)?|Sat(?:urday)?)\b/gi, " ");
}

function looksLikeCoursework(title, line) {
  if (/^(?:at|by|before)?\s*(?:noon|midnight|\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?)?)$/i.test(title.trim())) return false;
  if (/^\s*(?:due|deadline|submit|complete)\b/i.test(line) && !hasCourseworkWord(title)) return false;
  if (hasCourseworkWord(`${title} ${line}`)) {
    return true;
  }
  if (/\b(?:week|module|unit|lesson)\s+\d+\b/i.test(title) && title.length < 24) return false;
  return /\b(?:due|deadline|submit|complete|by|before)\b/i.test(line) && title.length > 5;
}

function hasCourseworkWord(value) {
  return /\b(?:assignment|homework|quiz|exam|essay|project|presentation|reading|read|discussion|post|paper|journal|case|study|worksheet|chapter|lab|reflection|milestone|module assessment|final|midterm|test|draft|proposal|report|problem set|assessment)\b/i.test(value);
}

function keywordIndex(value, pattern) {
  const match = value.match(pattern);
  return match ? match.index : -1;
}

function validDateParts(date, year, month, day) {
  return Number.isFinite(date.getTime()) && date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function dedupeDateMatches(matches) {
  const seen = new Set();
  return matches.filter((match) => {
    const key = `${match.index}:${match.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function fileNameWithoutExtension(fileName = "") {
  return fileName.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
}

async function syncCanvas() {
  const canvasUrlInput = document.getElementById("canvasUrl");
  const canvasTokenInput = document.getElementById("canvasToken");
  const saveTokenInput = document.getElementById("saveToken");
  if (canvasUrlInput) state.settings.canvasUrl = canvasUrlInput.value.trim();
  if (canvasTokenInput) sessionToken = canvasTokenInput.value.trim();
  if (saveTokenInput) {
    state.settings.saveToken = saveTokenInput.checked;
    state.settings.token = saveTokenInput.checked ? sessionToken : "";
  }

  const token = currentCanvasToken();
  if (!token) {
    state.ui.view = "canvas";
    persist();
    render();
    toast("Add a Canvas token to sync.");
    return;
  }

  try {
    setSyncStatus("Syncing courses...");
    const canvasCourses = await fetchCanvasPages("/api/v1/courses?enrollment_type=student&enrollment_state=active&include[]=teachers&include[]=term&per_page=100");
    const syncedCourses = upsertCanvasCourses(canvasCourses);
    persist();
    render();

    setSyncStatus("Syncing assignments...");
    const assignmentGroups = await Promise.all(
      syncedCourses.map(async (course) => {
        try {
          const path = `/api/v1/courses/${course.canvasId}/assignments?include[]=submission&include[]=all_dates&order_by=due_at&per_page=100`;
          const assignments = await fetchCanvasPages(path);
          return { course, assignments };
        } catch (error) {
          console.warn(`Assignment sync failed for ${course.name}`, error);
          return { course, assignments: [] };
        }
      })
    );
    upsertCanvasAssignments(assignmentGroups);

    setSyncStatus("Syncing planner...");
    try {
      const start = toDateInput(addDays(new Date(), -14));
      const end = toDateInput(addDays(new Date(), 120));
      const planner = await fetchCanvasPages(`/api/v1/planner/items?start_date=${start}&end_date=${end}&filter=incomplete_items&per_page=100`);
      upsertPlannerItems(planner);
    } catch (error) {
      console.warn("Planner sync failed", error);
    }

    state.settings.lastSync = new Date().toISOString();
    setSyncStatus("Synced");
    persist();
    render();
    toast("Canvas sync complete.");
  } catch (error) {
    console.error(error);
    setSyncStatus("Sync failed");
    render();
    toast(error.message || "Canvas sync failed.");
  }
}

function setSyncStatus(status) {
  state.settings.syncStatus = status;
  persist();
  const pill = els.viewRoot.querySelector(".panel-head .pill");
  if (state.ui.view === "canvas" && pill) pill.textContent = status;
}

async function fetchCanvasPages(path) {
  const results = [];
  let url = canvasUrl(path);
  let guard = 0;
  while (url && guard < 20) {
    guard += 1;
    const response = await fetchCanvasUrl(url);
    if (!response.ok) {
      let message = `Canvas returned ${response.status}`;
      try {
        const body = await response.json();
        message = body.message || body.error || message;
      } catch {
        // Keep the status message.
      }
      throw new Error(message);
    }
    const data = await response.json();
    results.push(...(Array.isArray(data) ? data : [data]));
    url = nextLink(response.headers.get("Link"));
  }
  return results;
}

async function fetchCanvasUrl(url) {
  const headers = {
    Authorization: `Bearer ${currentCanvasToken()}`,
    Accept: "application/json",
  };
  try {
    return await fetch(url, { headers });
  } catch (error) {
    if (!canUseLocalProxy()) throw error;
    return fetch(`/canvas-proxy?url=${encodeURIComponent(url)}`, { headers });
  }
}

function canvasUrl(path) {
  const base = (state.settings.canvasUrl || CANVAS_DEFAULT_URL).replace(/\/+$/, "");
  if (path.startsWith("http")) return path;
  return `${base}${path}`;
}

function currentCanvasToken() {
  return (state.settings.saveToken ? state.settings.token : sessionToken) || sessionToken || "";
}

function canUseLocalProxy() {
  return location.protocol.startsWith("http") && ["localhost", "127.0.0.1", "::1"].includes(location.hostname);
}

function nextLink(header) {
  if (!header) return "";
  const parts = header.split(",");
  const next = parts.find((part) => part.includes('rel="next"'));
  if (!next) return "";
  const match = next.match(/<([^>]+)>/);
  return match ? match[1] : "";
}

function upsertCanvasCourses(canvasCourses) {
  const currentByCanvas = new Map(state.courses.filter((course) => course.canvasId).map((course) => [String(course.canvasId), course]));
  const synced = [];
  const updated = [...state.courses.filter((course) => !course.canvasId)];

  for (const canvasCourse of canvasCourses.filter((course) => course && course.id && course.name)) {
    const existing = currentByCanvas.get(String(canvasCourse.id));
    const teacher = Array.isArray(canvasCourse.teachers) && canvasCourse.teachers[0] ? canvasCourse.teachers[0].display_name : "";
    const course = {
      ...(existing || {}),
      id: existing?.id || uid(),
      canvasId: String(canvasCourse.id),
      name: canvasCourse.name,
      code: canvasCourse.course_code || canvasCourse.sis_course_id || "",
      instructor: teacher || existing?.instructor || "",
      color: existing?.color || courseColors[updated.length % courseColors.length],
      term: canvasCourse.term?.name || "",
      htmlUrl: `${(state.settings.canvasUrl || CANVAS_DEFAULT_URL).replace(/\/+$/, "")}/courses/${canvasCourse.id}`,
      syncedAt: new Date().toISOString(),
    };
    updated.push(course);
    synced.push(course);
  }

  state.courses = updated;
  return synced;
}

function upsertCanvasAssignments(groups) {
  const byCanvas = new Map(
    state.assignments
      .filter((item) => item.canvasId)
      .map((item) => [`${item.courseId}:${item.canvasId}`, item])
  );
  const manual = state.assignments.filter((item) => !item.canvasId && !item.canvasPlannerKey);
  const updated = [...manual];

  for (const group of groups) {
    for (const canvasAssignment of group.assignments) {
      const key = `${group.course.id}:${canvasAssignment.id}`;
      const existing = byCanvas.get(key);
      updated.push(canvasAssignmentToLocal(canvasAssignment, group.course, existing));
    }
  }

  state.assignments = dedupeAssignments(updated);
}

function canvasAssignmentToLocal(canvasAssignment, course, existing = null) {
  const submission = canvasAssignment.submission || {};
  const dueAt = canvasAssignment.due_at || bestDateFromAllDates(canvasAssignment.all_dates);
  return {
    ...(existing || {}),
    id: existing?.id || uid(),
    courseId: course.id,
    canvasId: String(canvasAssignment.id),
    title: canvasAssignment.name || "Untitled assignment",
    type: detectType(canvasAssignment),
    dueAt: dueAt || null,
    status: statusFromSubmission(submission),
    priority: existing?.priority || inferPriority(dueAt),
    estimatedHours: existing?.estimatedHours ?? estimateHours(detectType(canvasAssignment), canvasAssignment.points_possible),
    notes: existing?.notes || stripHtml(canvasAssignment.description || "").slice(0, 280),
    htmlUrl: canvasAssignment.html_url || null,
    submission,
    syncedAt: new Date().toISOString(),
  };
}

function upsertPlannerItems(items) {
  const courseByCanvas = new Map(state.courses.filter((course) => course.canvasId).map((course) => [String(course.canvasId), course]));
  const byPlanner = new Map(state.assignments.filter((item) => item.canvasPlannerKey).map((item) => [item.canvasPlannerKey, item]));
  const additions = [];

  for (const item of items) {
    const course = courseByCanvas.get(String(item.course_id));
    if (!course || !item.plannable) continue;
    const plannable = item.plannable;
    const type = String(item.plannable_type || "").toLowerCase();
    if (type === "assignment" && plannable.id) continue;
    const key = `${course.id}:${type}:${item.plannable_id}`;
    const existing = byPlanner.get(key);
    const dueAt = plannable.due_at || plannable.todo_date || plannable.start_at || null;
    additions.push({
      ...(existing || {}),
      id: existing?.id || uid(),
      courseId: course.id,
      canvasPlannerKey: key,
      title: plannable.title || plannable.name || item.title || "Canvas item",
      type: type.includes("discussion") ? "discussion" : detectType(plannable),
      dueAt,
      status: item.submissions ? statusFromSubmission(item.submissions) : "not-started",
      priority: existing?.priority || inferPriority(dueAt),
      estimatedHours: existing?.estimatedHours ?? 1,
      notes: existing?.notes || "",
      htmlUrl: item.html_url ? absoluteCanvasUrl(item.html_url) : null,
      syncedAt: new Date().toISOString(),
    });
  }

  state.assignments = dedupeAssignments([...state.assignments, ...additions]);
}

function dedupeAssignments(assignments) {
  const seen = new Map();
  for (const item of assignments) {
    const key = item.canvasId ? `${item.courseId}:canvas:${item.canvasId}` : item.canvasPlannerKey || `manual:${item.id}`;
    seen.set(key, item);
  }
  return Array.from(seen.values());
}

function absoluteCanvasUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${(state.settings.canvasUrl || CANVAS_DEFAULT_URL).replace(/\/+$/, "")}${url}`;
}

function setAssignmentStatus(id, status) {
  if (isDoneStatus(status)) {
    removeAssignmentFromState(id);
    persist();
    render();
    playPlink("done");
    toast("Item removed.");
    return;
  }
  state.assignments = state.assignments.map((item) => (item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item));
  persist();
  render();
}

function moveWeek(delta) {
  const start = parseDateOnly(state.ui.weekStart) || startOfWeek(new Date());
  state.ui.weekStart = toDateInput(addDays(start, delta * 7));
  persist();
  render();
}

function moveMonth(delta) {
  const current = startOfMonth(parseDateOnly(state.ui.monthCursor || state.ui.weekStart) || new Date());
  current.setMonth(current.getMonth() + delta);
  state.ui.monthCursor = toDateInput(startOfMonth(current));
  persist();
  render();
}

function setCalendarMonth(value) {
  state.ui.monthCursor = toDateInput(startOfMonth(value));
  persist();
  render();
}

function exportData() {
  const blob = new Blob([JSON.stringify({ ...state, settings: { ...state.settings, token: "" } }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `school-planner-${toDateInput(new Date())}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function resetPlinkData() {
  const confirmed = await showConfirmDialog(
    "Reset Plink data?",
    "This clears courses, assignments, study sessions, quick notes, Canvas settings, and tutorial progress saved on this device. Export first if you want a backup.",
    "Reset data",
    "primary danger"
  );
  if (!confirmed) return;

  const finalCheck = await showConfirmDialog(
    "Start fresh?",
    "Last check: Plink will restart with an empty planner on this device. This cannot be undone.",
    "Start fresh",
    "primary danger"
  );
  if (!finalCheck) return;

  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("plink-tour-complete");
  sessionToken = "";
  latestUpdateManifest = null;
  state = loadState();
  persist();
  render();
  playPlink("done");
  toast("Plink reset. Clean slate.");
}

function activeAssignments() {
  return state.assignments.filter((item) => !isDone(item));
}

function isCountedDueAssignment(item) {
  return !["reading", "video", "reminder", "goal"].includes(item.type);
}

function nextWorkByCourse() {
  return state.courses
    .map((course) => ({
      course,
      item: assignmentsForCourse(course.id).filter((item) => !isDone(item)).sort(compareDue)[0] || null,
    }));
}

function upcomingAssignments(days) {
  const now = startOfDay(new Date());
  const end = endOfDay(addDays(now, days));
  return activeAssignments()
    .filter((item) => item.dueAt && new Date(item.dueAt) >= now && new Date(item.dueAt) <= end)
    .sort(compareDue);
}

function upcomingSessions(days) {
  const now = new Date();
  const end = endOfDay(addDays(now, days));
  return state.sessions
    .filter((session) => new Date(session.startAt) >= now && new Date(session.startAt) <= end)
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
}

function recommendedAssignment() {
  return activeAssignments()
    .map((item) => ({ item, score: recommendationScore(item) }))
    .sort((a, b) => b.score - a.score)[0]?.item || null;
}

function recommendationScore(item) {
  const due = item.dueAt ? new Date(item.dueAt) : null;
  const days = due ? Math.max(-3, Math.ceil((due - new Date()) / MS_PER_DAY)) : 30;
  const dueScore = due ? Math.max(0, 40 - days * 5) : 2;
  const priorityScore = { low: 0, normal: 8, high: 18, critical: 28 }[item.priority] || 8;
  const statusScore = item.status === "working" ? 8 : 0;
  const effortScore = Number(item.estimatedHours || 1) > 3 ? 6 : 0;
  return dueScore + priorityScore + statusScore + effortScore;
}

function workloadDays(days) {
  return Array.from({ length: days }, (_, index) => {
    const date = addDays(new Date(), index);
    const dueHours = activeAssignments()
      .filter((item) => item.dueAt && sameDay(new Date(item.dueAt), date))
      .reduce((total, item) => total + Number(item.estimatedHours || 1), 0);
    const sessionHours = state.sessions
      .filter((session) => sameDay(new Date(session.startAt), date))
      .reduce((total, item) => total + Number(item.durationMinutes || 60) / 60, 0);
    return { date, hours: round(dueHours + sessionHours) };
  });
}

function assignmentsForCourse(courseId) {
  return state.assignments.filter((item) => item.courseId === courseId);
}

function visibleCourseItems(courseId) {
  return assignmentsForCourse(courseId).filter((item) => !isDone(item)).sort(compareDue);
}

function removeCompletedAssignmentsFromState(nextState) {
  const completedIds = new Set(nextState.assignments.filter(isDone).map((item) => item.id));
  if (!completedIds.size) return nextState;
  return {
    ...nextState,
    assignments: nextState.assignments.filter((item) => !completedIds.has(item.id)),
    sessions: nextState.sessions.filter((item) => !completedIds.has(item.assignmentId)),
  };
}

function stripGradeDataFromState(nextState) {
  return {
    ...nextState,
    courses: nextState.courses.map(({ currentScore, currentGrade, ...course }) => course),
    assignments: nextState.assignments.map(({ score, pointsPossible, ...assignment }) => assignment),
  };
}

function removeAssignmentFromState(id) {
  state.assignments = state.assignments.filter((item) => item.id !== id);
  state.sessions = state.sessions.filter((item) => item.assignmentId !== id);
}

function courseById(id) {
  return state.courses.find((course) => course.id === id);
}

function assignmentById(id) {
  return state.assignments.find((item) => item.id === id);
}

function sessionById(id) {
  return state.sessions.find((item) => item.id === id);
}

function isDueWithin(item, days) {
  if (!item.dueAt) return false;
  const now = startOfDay(new Date());
  const due = new Date(item.dueAt);
  return due >= now && due <= endOfDay(addDays(now, days));
}

function isDone(item) {
  return isDoneStatus(item?.status);
}

function isDoneStatus(status) {
  return DONE_STATUSES.has(String(status || "").toLowerCase());
}

function compareDue(a, b) {
  if (!a.dueAt && !b.dueAt) return a.title.localeCompare(b.title);
  if (!a.dueAt) return 1;
  if (!b.dueAt) return -1;
  return new Date(a.dueAt) - new Date(b.dueAt);
}

function statusFromSubmission(submission = {}) {
  if (submission.workflow_state === "graded" || submission.graded || submission.grade != null || submission.score != null) return "graded";
  if (submission.submitted_at || submission.workflow_state === "submitted") return "submitted";
  return "not-started";
}

function detectType(assignment = {}) {
  const title = `${assignment.name || assignment.title || ""}`.toLowerCase();
  const submissionTypes = Array.isArray(assignment.submission_types) ? assignment.submission_types : [];
  if (submissionTypes.includes("online_quiz") || title.includes("quiz")) return "quiz";
  if (submissionTypes.includes("discussion_topic") || title.includes("discussion")) return "discussion";
  if (title.includes("exam") || title.includes("test") || title.includes("midterm") || title.includes("final")) return "exam";
  if (title.includes("essay") || title.includes("paper")) return "essay";
  if (title.includes("project")) return "project";
  if (title.includes("video") || title.includes("watch")) return "video";
  if (title.includes("read") || title.includes("chapter")) return "reading";
  return "homework";
}

function inferPriority(dueAt) {
  if (!dueAt) return "normal";
  const days = Math.ceil((new Date(dueAt) - new Date()) / MS_PER_DAY);
  if (days < 1) return "critical";
  if (days <= 3) return "high";
  return "normal";
}

function estimateHours(type, points) {
  if (type === "exam") return 3;
  if (type === "essay" || type === "project") return 4;
  if (type === "reading") return 1;
  if (type === "reminder") return 0.25;
  if (type === "goal") return 1;
  if (Number(points) >= 100) return 3;
  if (Number(points) >= 50) return 2;
  return 1;
}

function bestDateFromAllDates(allDates = []) {
  if (!Array.isArray(allDates) || !allDates.length) return null;
  const dated = allDates.find((item) => item.due_at);
  return dated?.due_at || null;
}

function typeLabel(value) {
  return {
    homework: "Homework",
    quiz: "Quiz",
    exam: "Exam",
    essay: "Essay",
    project: "Project",
    reading: "Reading",
    video: "Video",
    discussion: "Discussion",
    reminder: "Reminder",
    goal: "Goal",
  }[value] || "Assignment";
}

function statusLabel(value) {
  const status = String(value || "").toLowerCase();
  return {
    "not-started": "Not started",
    working: "Working",
    submitted: "Submitted",
    read: "Read",
    completed: "Completed",
    graded: "Completed",
  }[status] || "Not started";
}

function priorityLabel(value) {
  return {
    low: "Low",
    normal: "Normal",
    high: "High",
    critical: "Critical",
  }[value] || "Normal";
}

function hoursLabel(value) {
  return value ? `${round(value)}h` : "No estimate";
}

function courseChip(course) {
  return `
    <span 
      class="course-chip"
      style="
        background:${course.color}22;
        border-color:${course.color}55;
        color:${course.color};
      "
    >
      ${escapeHtml(course.name)}
    </span>
  `;
}

function icon(name, className = "icon") {
  const path = icons[name] || icons.plus;
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"></path></svg>`;
}

function hydrateIcons(root) {
  root.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = icon(el.dataset.icon);
  });
}

function registerPlinkServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (!["http:", "https:"].includes(window.location.protocol)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

function toast(message) {
  const existingToast = els.toastHost.querySelector(".toast");
if (existingToast) {
  existingToast.classList.remove("toast-shake");
  void existingToast.offsetWidth;
  existingToast.classList.add("toast-shake");
  return;
}
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  els.toastHost.appendChild(node);
  setTimeout(() => node.remove(), 5200);
}

async function showConfirmDialog(title, message, confirmText = "Confirm", actionClass = "primary") {
  return new Promise((resolve) => {
    document.getElementById("confirmTitle").textContent = title;
    document.getElementById("confirmMessage").textContent = message;
    const actionButton = document.getElementById("confirmActionButton");
    actionButton.textContent = confirmText;
    actionButton.className = actionClass;

    const dialog = document.getElementById("confirmDialog");
    const form = document.getElementById("confirmForm");
    let settled = false;
    let submitted = false;

    const cleanup = () => {
      form.removeEventListener("submit", handleSubmit);
      dialog.removeEventListener("close", handleClose);
    };

    const finish = (confirmed) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(confirmed);
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      submitted = event.submitter?.value === "confirm";
      if (dialog.open) {
        dialog.close();
        return;
      }
      finish(submitted);
    };

    const handleClose = () => finish(submitted);

    form.addEventListener("submit", handleSubmit);
    dialog.addEventListener("close", handleClose);

    dialog.showModal();
  });
}

function userDisplayName() {
  const raw = window.PLINK_USER?.name || "";
  const cleaned = String(raw)
    .replace(/[^a-z0-9\s'_-]/gi, " ")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "";
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function playPlink(kind = "add") {;
  if (!state.ui.soundOn) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const audio = new AudioContextClass();
  const now = audio.currentTime;
  const master = audio.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.18, now + 0.012);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
  master.connect(audio.destination);

  const notes =
  kind === "error" ? [523, 392, 311] :
  kind === "done" ? [740, 1046] :
  [880, 1318];
  notes.forEach((frequency, index) => {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const start = now + index * 0.055;
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(index ? 0.22 : 0.16, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
    osc.connect(gain);
    gain.connect(master);
    osc.start(start);
    osc.stop(start + 0.2);
  });

  setTimeout(() => audio.close().catch(() => {}), 420);
}

function spawnPlinkPulse(kind = "add") {
  const node = document.createElement("div");
  node.className = `plink-pulse ${kind === "done" ? "is-done" : ""}`;
  node.innerHTML = "<span></span><span></span><span></span>";
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 760);
}

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function numberOrNull(value) {
  if (value === "" || value == null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function sum(values) {
  return round(values.reduce((total, value) => total + Number(value || 0), 0));
}

function clamp(value, min, max) {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

function compareVersions(left, right) {
  const a = parseVersionParts(left);
  const b = parseVersionParts(right);
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    const diff = (a[index] || 0) - (b[index] || 0);
    if (diff) return diff;
  }
  return 0;
}

function parseVersionParts(value) {
  return String(value || "")
    .trim()
    .replace(/^v/i, "")
    .split(/[.-]/)
    .map((part) => Number.parseInt(part, 10))
    .map((part) => (Number.isFinite(part) ? part : 0));
}

function round(value) {
  return Math.round(Number(value) * 10) / 10;
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function startOfMonth(date) {
  const d = startOfDay(date);
  d.setDate(1);
  return d;
}

function startOfWeek(date) {
  const d = startOfDay(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function sameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function parseDateOnly(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function toDateInput(value) {
  const d = new Date(value);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toTimeInput(value) {
  const d = new Date(value);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function toDateTimeInput(value) {
  const d = new Date(value);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function defaultSessionStart() {
  const d = new Date();
  d.setHours(d.getHours() + 1, 0, 0, 0);
  return d;
}

function defaultSessionStartForDate(value) {
  const d = parseDateOnly(value) || new Date();
  d.setHours(18, 0, 0, 0);
  return d;
}

function formatDateLong(value) {
  return new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date(value));
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(value));
}

function formatWeekday(value) {
  return new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(new Date(value));
}

function formatTime(value) {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function formatDateTime(value) {
  return `${formatShortDate(value)}, ${formatTime(value)}`;
}

function formatDue(value) {
  const date = new Date(value);
  const today = startOfDay(new Date());
  const diff = Math.round((startOfDay(date) - today) / MS_PER_DAY);
  if (diff === 0) return `Today at ${formatTime(date)}`;
  if (diff === 1) return `Tomorrow at ${formatTime(date)}`;
  if (diff === -1) return `Yesterday at ${formatTime(date)}`;
  return `${formatShortDate(date)} at ${formatTime(date)}`;
}

function relativeTime(value) {
  const then = new Date(value);
  const seconds = Math.max(1, Math.round((Date.now() - then.getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value = "") {
  return escapeHtml(value);
}

if (!localStorage.getItem("plink-tour-complete")) {
  showTourStep(0);
}

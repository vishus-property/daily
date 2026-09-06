const START_DATE = new Date("2026-09-07T00:00:00");
const END_DATE = new Date("2027-03-07T00:00:00"); // six-month anniversary
const ONE_YEAR_MESSAGE = "Congrats on one year ❤️";
const BEFORE_START_MESSAGE = "I love you ❤️";
const WAIT_MESSAGE = "Wait for it... good things take time 💛";

const dateEl = document.getElementById("date");
const messageEl = document.getElementById("message");
const progressEl = document.getElementById("progress");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const msPerDay = 24 * 60 * 60 * 1000;
let previewOffset = 0;
let triedToGoForward = false;

function localDateOnly(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getToday() {
  const now = new Date();
  return localDateOnly(now);
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function daysBetween(a, b) {
  return Math.round((localDateOnly(b) - localDateOnly(a)) / msPerDay);
}

function render() {
  const today = getToday();
  const viewedDate = new Date(today.getTime() + previewOffset * msPerDay);

  // Before the project starts: always show the fallback.
  if (viewedDate < START_DATE) {
    dateEl.textContent = "For now";
    messageEl.textContent = BEFORE_START_MESSAGE;
    progressEl.textContent = "";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  if (triedToGoForward && previewOffset === 0) {
    dateEl.textContent = formatDate(today);
    messageEl.textContent = WAIT_MESSAGE;
    progressEl.textContent = `${daysBetween(today, END_DATE)} days to go`;
    prevBtn.disabled = daysBetween(START_DATE, today) <= 0;
    nextBtn.disabled = true;
    return;
  }

  // Six-month anniversary and anything after it.
  if (viewedDate >= END_DATE) {
    dateEl.textContent = formatDate(viewedDate);
    messageEl.textContent = ONE_YEAR_MESSAGE;
    progressEl.textContent = "";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  const index = daysBetween(START_DATE, viewedDate);

  // If there are fewer messages than days, show a gentle placeholder.
  if (index >= messages.length) {
    dateEl.textContent = formatDate(viewedDate);
    messageEl.textContent = "Something special is waiting here.";
    progressEl.textContent = `${daysBetween(viewedDate, END_DATE)} days to go`;
  } else {
    dateEl.textContent = formatDate(viewedDate);
    messageEl.textContent = messages[index];
    progressEl.textContent = `${daysBetween(viewedDate, END_DATE)} days to go`;
  }

  prevBtn.disabled = index <= 0;
  nextBtn.disabled = false;
}

prevBtn.addEventListener("click", () => {
  if (!prevBtn.disabled) {
    previewOffset--;
    triedToGoForward = false;
    render();
  }
});

nextBtn.addEventListener("click", () => {
  if (previewOffset < 0) {
    previewOffset++;
    render();
  } else {
    triedToGoForward = true;
    render();
  }
});

render();

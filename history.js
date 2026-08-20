const list = document.querySelector("#history-list");
const status = document.querySelector("#history-status");

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short"
  });
}

function makeNoteCard(savedNote) {
  const article = document.createElement("article");
  article.className = "note-card";

  const noteDate = document.createElement("time");
  noteDate.dateTime = savedNote.note_date;
  noteDate.textContent = formatDate(savedNote.note_date);

  const question = document.createElement("h2");
  question.textContent = savedNote.question;

  const answerLabel = document.createElement("p");
  answerLabel.className = "answer-label";
  answerLabel.textContent = "あなたの記録";

  const answer = document.createElement("p");
  answer.className = "saved-answer";
  answer.textContent = savedNote.answer || "（回答はまだありません）";

  article.append(noteDate, question, answerLabel, answer);
  return article;
}

async function loadHistory() {
  try {
    const response = await fetch("/api/notes");
    if (!response.ok) throw new Error("読み込みに失敗しました。");
    const notes = await response.json();

    if (notes.length === 0) {
      status.textContent = "まだ保存された記録はありません。";
      return;
    }

    status.textContent = `${notes.length}件の記録があります。`;
    list.replaceChildren(...notes.map(makeNoteCard));
  } catch {
    status.textContent = "記録を読み込めませんでした。サーバーを起動して開き直してください。";
  }
}

loadHistory();

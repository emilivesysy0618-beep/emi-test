import { auth, collection, db, getDocs, googleProvider, onAuthStateChanged, signInWithPopup, signOut } from "./firebase.js?v=9761ed4";

const list = document.querySelector("#history-list");
const status = document.querySelector("#history-status");
const authStatus = document.querySelector("#auth-status");
const signInButton = document.querySelector("#sign-in");
const signOutButton = document.querySelector("#sign-out");

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
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

async function loadHistory(user) {
  status.textContent = "記録を読み込んでいます。";
  try {
    const snapshot = await getDocs(collection(db, "users", user.uid, "notes"));
    const notes = snapshot.docs.map((item) => item.data()).sort((a, b) => b.note_date.localeCompare(a.note_date));
    if (notes.length === 0) { status.textContent = "まだ保存された記録はありません。"; return; }
    status.textContent = `${notes.length}件の記録があります。`;
    list.replaceChildren(...notes.map(makeNoteCard));
  } catch {
    status.textContent = "記録を読み込めませんでした。時間をおいてもう一度お試しください。";
  }
}

function showAuthError(error) {
  const code = error?.code || error?.message || "不明なエラー";
  authStatus.textContent = `ログインできませんでした（${code}）。`;
}

signInButton.addEventListener("click", async () => {
  signInButton.disabled = true;
  try { await signInWithPopup(auth, googleProvider); } catch (error) { showAuthError(error); signInButton.disabled = false; }
});
signOutButton.addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, async (user) => {
  const signedIn = Boolean(user);
  signInButton.hidden = signedIn;
  signOutButton.hidden = !signedIn;
  authStatus.textContent = signedIn ? `${user.displayName || user.email} としてログイン中です。` : "記録を見るにはGoogleでログインしてください。";
  list.replaceChildren();
  if (user) await loadHistory(user);
  else status.textContent = "ログインすると、あなたの記録を表示できます。";
});

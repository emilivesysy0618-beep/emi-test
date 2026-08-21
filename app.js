import { auth, db, doc, getDoc, googleProvider, onAuthStateChanged, serverTimestamp, setDoc, signInWithPopup, signOut } from "./firebase.js";

const questions = [
  "未来の自分から、今の自分へ届くメッセージがあるとしたら、どんな言葉だろう？", "半年後の自分が、今日の自分にそっと勧めたい一歩は何だろう？", "過去の自分に、今ならどんな安心を渡してあげられるだろう？", "胸に残る記憶を、無理のない範囲で見つめたとき、今の自分が気づけるやさしさは何だろう？", "今の自分の本音や内なる声は、何を大切にしてほしいと言っているだろう？", "静かな場所で自分の内側に意識を向けると、どんな願いが浮かぶだろう？", "今日の迷いの奥には、どんな望みが隠れているだろう？", "未来の安心した自分は、どんな表情で何をしているだろう？", "手放しても大丈夫な思い込みをひとつ挙げるとしたら、何だろう？", "今日の自分を守り、満たすためにできる小さな行動は何だろう？", "自分の内側の知恵が、今いちばん伝えたいことは何だろう？", "これから育てていきたい感覚やエネルギーを、ひとことで表すと何だろう？"
];
const today = new Date();
const dateKey = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
const dayNumber = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
const note = document.querySelector("#note");
const status = document.querySelector("#status");
const deepen = document.querySelector("#deepen");
const followUps = document.querySelector("#follow-ups");
const authStatus = document.querySelector("#auth-status");
const signInButton = document.querySelector("#sign-in");
const signOutButton = document.querySelector("#sign-out");
const saveButton = document.querySelector("#save-note");
let currentUser = null;

document.querySelector("#date").textContent = today.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
document.querySelector("#question").textContent = questions[dayNumber % questions.length];

function showFollowUps(answer) {
  const focus = answer.trim().replace(/\s+/g, " ").slice(0, 48) || "いま浮かんだイメージ";
  const prompts = [`「${focus}」を色で表すなら、どんな色ですか？ 明るさや質感も感じてみましょう。`, "そこにはどんな音、温度、匂い、または味がありますか？ 体のどこにどんな感覚があるでしょう？", "そのイメージの中で、あなたはいつ・どこにいて、誰といますか？ 周りには何が見えますか？", "その場面で何が起き、あなたは本当は何をしたい、または受け取りたいと感じていますか？", "今の生活で、その感覚をほんの少し大切にするには、今日どんな行動を選べますか？"];
  followUps.replaceChildren(...prompts.map((prompt) => { const item = document.createElement("li"); item.textContent = prompt; return item; }));
  deepen.classList.add("visible");
}

function setSignedInState(user) {
  currentUser = user;
  const signedIn = Boolean(user);
  note.disabled = !signedIn;
  saveButton.disabled = !signedIn;
  signInButton.hidden = signedIn;
  signOutButton.hidden = !signedIn;
  authStatus.textContent = signedIn ? `${user.displayName || user.email} としてログイン中です。` : "記録を保存するにはGoogleでログインしてください。";
  note.placeholder = signedIn ? "考え込まず、自由に書いてみてください。" : "Googleでログインすると記録できます。";
}

function showAuthError(error) {
  const code = error?.code || "不明なエラー";
  authStatus.textContent = `ログインできませんでした（${code}）。`;
}

async function loadNote() {
  if (!currentUser) return;
  status.textContent = "記録を読み込んでいます。";
  try {
    const snapshot = await getDoc(doc(db, "users", currentUser.uid, "notes", dateKey));
    if (snapshot.exists()) {
      note.value = snapshot.data().answer || "";
      showFollowUps(note.value);
      status.textContent = "今日の記録を読み込みました。";
    } else {
      note.value = "";
      deepen.classList.remove("visible");
      status.textContent = "今日の記録はまだありません。";
    }
  } catch {
    status.textContent = "記録を読み込めませんでした。時間をおいてもう一度お試しください。";
  }
}

signInButton.addEventListener("click", async () => {
  signInButton.disabled = true;
  try { await signInWithPopup(auth, googleProvider); } catch (error) { showAuthError(error); signInButton.disabled = false; }
});
signOutButton.addEventListener("click", () => signOut(auth));

document.querySelector("#note-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!currentUser) return;
  saveButton.disabled = true;
  try {
    await setDoc(doc(db, "users", currentUser.uid, "notes", dateKey), { note_date: dateKey, question: document.querySelector("#question").textContent, answer: note.value.trim(), updated_at: serverTimestamp() });
    status.textContent = "今日の記録を保存しました。";
    showFollowUps(note.value);
  } catch {
    status.textContent = "保存できませんでした。時間をおいてもう一度お試しください。";
  } finally { saveButton.disabled = false; }
});

onAuthStateChanged(auth, async (user) => {
  setSignedInState(user);
  if (user) await loadNote();
  else { note.value = ""; deepen.classList.remove("visible"); status.textContent = ""; }
});

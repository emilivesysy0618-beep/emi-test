const questions = [
  "未来の自分から、今の自分へ届くメッセージがあるとしたら、どんな言葉だろう？",
  "半年後の自分が、今日の自分にそっと勧めたい一歩は何だろう？",
  "過去の自分に、今ならどんな安心を渡してあげられるだろう？",
  "胸に残る記憶を、無理のない範囲で見つめたとき、今の自分が気づけるやさしさは何だろう？",
  "今の自分の本音や内なる声は、何を大切にしてほしいと言っているだろう？",
  "静かな場所で自分の内側に意識を向けると、どんな願いが浮かぶだろう？",
  "今日の迷いの奥には、どんな望みが隠れているだろう？",
  "未来の安心した自分は、どんな表情で何をしているだろう？",
  "手放しても大丈夫な思い込みをひとつ挙げるとしたら、何だろう？",
  "今日の自分を守り、満たすためにできる小さな行動は何だろう？",
  "自分の内側の知恵が、今いちばん伝えたいことは何だろう？",
  "これから育てていきたい感覚やエネルギーを、ひとことで表すと何だろう？"
];

const today = new Date();
const dateKey = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
const dayNumber = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
const note = document.querySelector("#note");
const status = document.querySelector("#status");
const deepen = document.querySelector("#deepen");
const followUps = document.querySelector("#follow-ups");

document.querySelector("#date").textContent = today.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
document.querySelector("#question").textContent = questions[dayNumber % questions.length];
loadNote();

function showFollowUps(answer) {
  const focus = answer.trim().replace(/\s+/g, " ").slice(0, 48) || "いま浮かんだイメージ";
  const prompts = [
    `「${focus}」を色で表すなら、どんな色ですか？ 明るさや質感も感じてみましょう。`,
    "そこにはどんな音、温度、匂い、または味がありますか？ 体のどこにどんな感覚があるでしょう？",
    "そのイメージの中で、あなたはいつ・どこにいて、誰といますか？ 周りには何が見えますか？",
    "その場面で何が起き、あなたは本当は何をしたい、または受け取りたいと感じていますか？",
    "今の生活で、その感覚をほんの少し大切にするには、今日どんな行動を選べますか？"
  ];
  followUps.replaceChildren(...prompts.map((prompt) => {
    const item = document.createElement("li");
    item.textContent = prompt;
    return item;
  }));
  deepen.classList.add("visible");
}

async function loadNote() {
  try {
    const response = await fetch(`/api/notes/${dateKey}`);
    if (!response.ok) throw new Error("読み込みに失敗しました。");
    const savedNote = await response.json();
    if (savedNote) {
      note.value = savedNote.answer;
      status.textContent = "SQLiteから今日の記録を読み込みました。";
      showFollowUps(note.value);
    }
  } catch {
    status.textContent = "記録を読み込めませんでした。サーバーを起動して開き直してください。";
  }
}

document.querySelector("#note-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: dateKey,
        question: document.querySelector("#question").textContent,
        answer: note.value
      })
    });
    if (!response.ok) throw new Error("保存に失敗しました。");
    status.textContent = "SQLiteに今日の記録を保存しました。";
    showFollowUps(note.value);
  } catch {
    status.textContent = "保存できませんでした。サーバーが起動しているか確認してください。";
  }
});

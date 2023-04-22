// DOM要素の取得
const muteAudioBtn = document.getElementById('muteAudio');
const hideVideoBtn = document.getElementById('hideVideo');
const leaveChatBtn = document.getElementById('leaveChat');
const participantsList = document.getElementById('participants');

// イベントリスナーの追加
muteAudioBtn.addEventListener('click', toggleAudioMute);
hideVideoBtn.addEventListener('click', toggleVideoHide);
leaveChatBtn.addEventListener('click', leaveChat);

// 関数の定義
function toggleAudioMute() {
  // 音声ミュートの切り替え処理
}

function toggleVideoHide() {
  // 動画非表示の切り替え処理
}

function leaveChat() {
  console.log('チャットから抜けます。');
  // チャットから抜ける処理
  socket.disconnect(); // サーバーとのWebSocket接続を切断
  window.location.href = '/home'; // 任意のページにリダイレクト（例: トップページ）
}

function updateParticipantsList(participants) {
  console.log('参加者一覧を更新します。', participants);

  // 参加者一覧をクリア
  participantsList.innerHTML = '';

  // 新しい参加者一覧を追加
  participants.forEach((participant) => {
    const listItem = document.createElement('li');
    listItem.textContent = participant.username;
    participantsList.appendChild(listItem);
  });
}

// WebSocketの接続
console.log('websocketに接続します。');
const socket = io('http://localhost:3000');
// socket.emit('joinChatSpace', { chatSpaceId: 1, userId: 1 });

socket.on('updateParticipants', (participants) => {
  updateParticipantsList(participants);
});

socket.on('connect', () => {
  console.log('Connected to the server');
});

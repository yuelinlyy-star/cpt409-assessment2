// --- 1. 故事数据中心 (无变化) ---
const storyData = {
  main: {
    video: "main.mp4",
    choices: [
      { text: "Buy external data", target: "optionA" },
      { text: "Collect own data", target: "optionB" },
    ],
  },
  optionA: {
    video: "optionA.mp4",
    parent: "main",
    choices: [
      { text: "Keep current performance", target: "optionA1" },
      { text: "Push to raise accuracy", target: "optionA2" },
    ],
  },
  optionB: {
    video: "optionB.mp4",
    parent: "main",
    choices: [
      { text: "Roll out users in batches", target: "optionB1" },
      { text: "Add budget for server upgrades", target: "optionB2" },
    ],
  },
  optionA1: {
    video: "optionA1.mp4",
    parent: "optionA",
    choices: [
      { text: "Turn the product a toolkit", target: "optionA1a" },
      { text: "Recollect high-quality data", target: "optionA1b" },
    ],
  },
  optionA2: {
    video: "optionA2.mp4",
    parent: "optionA",
    choices: null,
    isSpecialEnding: true,
  },
  optionB1: {
    video: "optionB1.mp4",
    parent: "optionB",
    choices: null,
    isSpecialEnding: true,
  },
  optionB2: {
    video: "optionB2.mp4",
    parent: "optionB",
    choices: null,
    isSpecialEnding: true,
  },
  optionA1a: {
    video: "optionA1a.mp4",
    parent: "optionA1",
    choices: null,
    isSpecialEnding: true,
  },
  optionA1b: {
    video: "optionA1b.mp4",
    parent: "optionA1",
    choices: null,
    isSpecialEnding: true,
  },
};

// --- 2. 获取 DOM 元素 (重新添加 replayContainer) ---
const videoContainer = document.getElementById("video-container");
const video = document.getElementById("my-video");
const decisionButtonsContainer = document.getElementById("decision-buttons");
const decisionTitle = document.getElementById("decision-title");
const buttonWrapper = document.querySelector(".button-wrapper");
const replayContainer = document.getElementById("replay-container"); // 重新添加
const returnBtn = document.getElementById("return-btn");
let currentNodeId = "main";

// --- 3. 核心函数：播放节点 (无变化) ---
function playNode(nodeId) {
  const node = storyData[nodeId];
  if (!node) return;
  currentNodeId = nodeId;
  video.src = node.video;
  video.play();
  decisionButtonsContainer.classList.remove("show");
  decisionButtonsContainer.classList.remove("is-end-screen");
  if (node.parent) {
    videoContainer.classList.add("nav-active");
    setupInVideoNav();
  } else {
    videoContainer.classList.remove("nav-active");
  }
}

// --- 4. 视频播放结束事件 (无变化) ---
video.addEventListener("ended", function () {
  const node = storyData[currentNodeId];
  if (!node) return;
  if (node.choices) {
    showDecisionButtons(node.choices);
  } else if (node.isSpecialEnding) {
    showTheEndScreen();
  } else if (node.parent) {
    setTimeout(() => returnToDecision(node.parent), 500);
  }
});

// --- 5. 显示决策按钮 (关键改动：恢复创建重新播放按钮的逻辑) ---
function showDecisionButtons(choices) {
  decisionTitle.textContent = "Make your choice!";
  // 清空所有旧按钮
  buttonWrapper.innerHTML = "";
  replayContainer.innerHTML = "";

  // 创建主要决策按钮
  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.textContent = choice.text;
    button.onclick = () => playNode(choice.target);
    buttonWrapper.appendChild(button);
  });

  // 创建“重新播放”按钮
  const replayButton = document.createElement("button");
  replayButton.textContent = "Replay";
  replayButton.onclick = () => playNode(currentNodeId); // 点击时，重新播放当前节点
  replayContainer.appendChild(replayButton); // 放入专用容器

  decisionButtonsContainer.classList.add("show");
}

// --- 6. "The end" 屏幕 (关键改动：确保也清空 replayContainer) ---
function showTheEndScreen() {
  decisionTitle.textContent = "The end";
  buttonWrapper.innerHTML = "";
  replayContainer.innerHTML = ""; // 确保清空
  const replayButton = document.createElement("button");
  replayButton.textContent = "Replay";
  replayButton.onclick = () => playNode(currentNodeId);
  const returnToMainButton = document.createElement("button");
  returnToMainButton.textContent = "Start Over";
  returnToMainButton.onclick = () => playNode("main");
  buttonWrapper.appendChild(replayButton);
  buttonWrapper.appendChild(returnToMainButton);
  decisionButtonsContainer.classList.add("is-end-screen");
  decisionButtonsContainer.classList.add("show");
}

// --- 7. 设置视频内导航 (无变化) ---
function setupInVideoNav() {
  const node = storyData[currentNodeId];
  if (!node.parent) return;
  returnBtn.onclick = () => returnToDecision(node.parent);
}

// --- 8. 返回决策点 (无变化) ---
function returnToDecision(parentNodeId) {
  const parentNode = storyData[parentNodeId];
  if (!parentNode) return;
  currentNodeId = parentNodeId;
  video.src = parentNode.video;
  showDecisionButtons(parentNode.choices);
  videoContainer.classList.remove("nav-active");
}

// --- 9. 启动故事 (无变化) ---
window.onload = () => {
  video.src = storyData.main.video;
};

const video = document.getElementById('my-video');
const decisionButtons = document.getElementById('decision-buttons');

// 当视频播放结束时，会触发 'ended' 事件
video.addEventListener('ended', function () {
  // 检查当前播放的视频是不是主视频（可选但推荐）
  // .includes() 检查字符串中是否包含 'main.mp4'
  if (video.currentSrc.includes('main.mp4')) {
    // 显示决策按钮
    decisionButtons.classList.add('show');
  }
});

function playBranch(videoSrc) {
  // 隐藏决策按钮
  decisionButtons.classList.remove('show');

  // 延迟 500 毫秒，让淡出动画播放完毕
  setTimeout(() => {
    video.src = videoSrc; // 设置新的视频源
    video.play(); // 播放新的视频
  }, 500); // 这个时间应与 CSS 中的 transition 时间保持一致
}

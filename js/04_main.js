// -------------------------- 实验启动核心逻辑 --------------------------
let jsPsych;

document.addEventListener("DOMContentLoaded", () => {
    // 检查 IMAGE_LIST 是否正确初始化
    if (!IMAGE_LIST || IMAGE_LIST.length === 0) {
        console.error("IMAGE_LIST 未正确初始化！");
        alert("实验材料加载失败，请刷新页面重试。");
        return;
    }

    // ✅ 先初始化 jsPsych
    jsPsych = initJsPsych({
        on_finish: () => {
            console.log("实验完全结束！");
            console.log("被试姓名：", GLOBAL_DATA.subjectName);
            console.log("实验数据预览：", GLOBAL_DATA.experimentLog.slice(0, 5));
        }
    });

    // ✅ 然后再使用 jsPsych.randomization（顺序很重要！）
    IMAGE_LIST = jsPsych.randomization.shuffle(IMAGE_LIST);

    // 收集所有需要预加载的图片路径
    const imagesToPreload = IMAGE_LIST.map(item => item.imageUrl);

    // 创建预加载 trial
    const preloadTrial = {
        type: jsPsychPreload,
        images: imagesToPreload,
        message: '正在加载实验材料，请稍候...',
        show_progress_bar: true,
        continue_after_error: false,
        error_message: '❌ 部分图片加载失败，请检查网络连接后刷新页面重试。',
        on_success: () => {
            console.log('✅ 所有图片预加载完成！');
        },
        on_error: (file) => {
            console.error('❌ 图片加载失败:', file);
        }
    };

    // 构建实验时间线
    const experimentTimeline = buildTimeline();

    // 组合完整时间线：预加载 + 实验内容
    const fullTimeline = [preloadTrial, ...experimentTimeline];

    // 运行实验
    jsPsych.run(fullTimeline);
});

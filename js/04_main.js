document.addEventListener("DOMContentLoaded", () => {
    // 1. 确保 IMAGE_LIST 已定义
    if (!IMAGE_LIST || IMAGE_LIST.length === 0) {
        console.error("IMAGE_LIST 未正确初始化！");
        return;
    }

    // 2. 随机打乱顺序
    IMAGE_LIST = jsPsych.randomization.shuffle(IMAGE_LIST);
    
    // 3. 收集图片路径
    const imagesToPreload = IMAGE_LIST.map(item => item.imageUrl);

    // 4. 初始化 jsPsych（方法一：使用配置自动预加载）
    jsPsych = initJsPsych({
        on_finish: () => {
            console.log("实验完全结束！");
            console.log("被试姓名：", GLOBAL_DATA.subjectName);
            console.log("实验数据预览：", GLOBAL_DATA.experimentLog.slice(0, 5));
        },
        show_preload_progress_bar: true,
        auto_preload: true,
        preload_images: imagesToPreload  // 直接在配置中指定
    });

    // 5. 构建并运行实验
    const timeline = buildTimeline();
    jsPsych.run(timeline);
});

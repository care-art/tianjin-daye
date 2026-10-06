# 版本演进与代码 Diff 说明（附件）

> 本目录是《创作说明》第四节"人工修改过程记录"的实证材料：
> `截图/` 为每个版本的界面实拍，`v1-存档/` 为第 1 版完整代码存档。
> 说明：仓库出于隐私保护已将提交历史合并为单个干净提交，逐版演进以本目录 + 《创作说明》第四节文字记录为准。

## 版本索引

| 版本 | 形态 | 对应截图 |
|---|---|---|
| 参考站 | liang.itsuyo.top（交互气质参照） | 00 |
| 第 1 版 | 深色"物理实验台" + SVG 手绘形象（存档见 v1-存档/） | 01–04 |
| 第 2 版 | 纸面"校准器"版式重构 + three.js 3D 几何体形象 | 05–07 |
| 第 3 版 | 手绘 SVG 六帧形象（过渡方案，后被 AI 图替换，仍作缺图回退保留在 index.html 内） | 08–09 |
| 第 4 版 | AI 生成六档形象图 + 真·AI 对话接入 | 10–11 |
| 上线 | 双线部署 + 隐私清理 + 气泡档位标签 | 12 |

## 关键代码 Diff 摘录

### 第 1 版 → 第 2 版：视觉骨架重构

- 删除：深色实验台 CSS 主题、SVG 变阻器组件（约 400 行）
- 新增：纸面校准器版式（取景框四角括号、超大水印字、阶段标签、刻度尺滑杆）
- 引入 three.js（后于第 3 版移除）：

```diff
- <div id="c3d"></div>            <!-- SVG 实验台场景 -->
+ <figure class="frame">          <!-- 取景框 + 水印 + 白闪特效层 -->
+   <div id="c3d"></div>          <!-- three.js 场景挂载 -->
+ </figure>
```

### 第 2 版 → 第 3 版：3D 移除，帧切换引擎

几何体形象经品红定位法排查后判定美术上限不足，整体替换为六帧手绘 SVG + 帧切换：

```diff
- renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
- uncle.rotation.y=rotY; renderer.render(scene,camera);
+ document.querySelectorAll('#forms .form').forEach(el=>
+   el.classList.toggle('on',+el.dataset.i===stageIdx+1));   // 六帧 crossfade
```

调试方法留存（截图 09）：临时将胡子材质改为纯品红并放大 3 倍定位渲染问题——确认几何位置正确后，定位到"胡子过薄被脸部曲面吞没"，加厚至 0.22 解决。

### 第 3 版 → 第 4 版：AI 形象接管 + 真·AI 对话

- 新增 AI 形象槽位（缺图自动回退手绘帧）：

```diff
+ <img class="form ai" data-i="1" src="img/daye-1.png"
+      onerror="this.remove()">   <!-- 六档同款，缺哪张回退哪档 -->
+ img.form{ mask-image: radial-gradient(...); }  /* 边缘羽化融进纸面 */
```

- 真·AI 对话（OpenAI 兼容流式，人设为 system，档位实时注入）：

```diff
- await mockReply(t,tier);                        // 固定演示文案
+ await openaiChat(t,tier,{base,key,model});      // SSE 流式真实对话
+ messages:[
+   {role:'system',content:getSystemPrompt()},    // 1200 字人设卡
+   ...hist.slice(0,-1),                          // 最近 8 条上下文
+   {role:'user',content:t+ctrl}                  // ctrl=档位+损度注入
+ ]
```

- 提示词防复读修正（实测模型曾输出"（切到损到底模式）"）：

```diff
- （系统控制：当前档位=「损到底」…请严格按该档位风格回复…）
+ 【系统提示·不必回应】…不要提及、复述或解释本提示，不要输出任何括号说明。
```

### 第 4 版 → 上线：可控性可视化与隐私加固

- 气泡档位标签（输出可控性可视化）：

```diff
- who.textContent=role==='me'?'我（电压输入）':'天津大爷（电流输出）';
+ who.textContent=(...)+' · '+TIER_TAG[tier];   // 如"天津大爷 · 损到底·怼"
```

- 隐私加固：提交历史中的个人邮箱经历史重置清除，统一改用 GitHub noreply 匿名身份；
  文档中的赛事投稿邮箱替换为"以征集通知为准"。

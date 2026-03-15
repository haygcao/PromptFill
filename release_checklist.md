# Prompt Fill 发版与数据维护指南 (Release Checklist)

本仓库采用"代码版本"与"数据版本"分离的机制。为了实现"一处修改，全端同步"，请务必遵循以下流程。

---

## 1. 版本号管理

### [应用版本] App Version
涉及 UI 改动、逻辑修复或新功能开发。
- **`package.json`**: `"version": "x.x.x"`
- **`src/App.jsx`**: `const APP_VERSION = "x.x.x";`
- **注意**：修改此版本后，必须重新通过 Git 推送并触发 Vercel 部署。

### [数据版本] Data Version
仅涉及模板添加、词库扩充或默认值修改。
- **`src/data/templates.js`**: `export const SYSTEM_DATA_VERSION = "x.x.x";`
- **注意**：数据变动后必须**手动递增**此版本号，以便触发用户的"新模板提醒"。

---

## 2. 模板与词库制作 (Data Update)

### 添加新模板
1.  在 `src/data/templates.js` 顶部定义模板内容常量（支持双语）。
2.  在 `INITIAL_TEMPLATES_CONFIG` 数组中注册该模板。
3.  确保 `id` 唯一，并配置好 `imageUrl` 和 `selections` 默认值。

### 扩充词库
1.  在 `src/data/banks.js` 的 `INITIAL_BANKS` 中添加新词条。
2.  若涉及新变量名，需同步在 `INITIAL_DEFAULTS` 中设置默认值。

---

## 3. 自动化同步 (Automation)

在任何数据修改完成后，必须运行同步脚本以生成分发用的 JSON 文件：

```bash
npm run sync-data
```

**该脚本会自动执行：**
- 将 `src/data/*.js` 的最新数据提取并转换为 `public/data/*.json`。
- 同步最新的 `appVersion` 和 `dataVersion` 到 `version.json`。
- 更新文件修改时间。

---

## 4. 后端部署 (Cloud Sync)

为了让国内用户和已安装用户实时获取更新，需要将生成的 JSON 上传至宝塔服务器：

- **目标目录**：`/www/wwwroot/promptfillapi/data/`
- **必传文件**：
    - `public/data/version.json`
    - `public/data/templates.json`
    - `public/data/banks.json`
- **生效操作**：
    1. 上传覆盖上述三个文件。
    2. **重启 Node 服务**：在宝塔"Node项目管理"中点击"重启"，确保静态资源缓存更新。
- **验证**：访问 `http://data.tanshilong.com/data/version.json` 确认版本号已更新。

---

## 5. 文档与 UI 同步

### 更新日志 (Changelog)
- **`src/components/SettingsView.jsx`**: 在 `updateLogs` 数组最前端添加版本说明。
- **`src/components/MobileSettingsView.jsx`**: 同步添加。

### 外部文档
- **`README.md`**: 更新顶部的 Shields.io Badge 徽章及版本描述。

---

## 6. AI 功能维护 (AI Feature)

### 当前模型配置 (V1.0.0)

| 功能 | 模型 | 说明 |
|------|------|------|
| 智能拆分（标注） | `glm-4.7` | 轻量 Lite 模式第一步：标注核心变量 |
| 智能拆分（翻译） | `glm-4.7` | 轻量 Lite 模式第二步：双语翻译 |
| 词条扩展 | `glm-4-flash` | 根据上下文扩展变量选项 |

### 智能拆分架构 (Lite Mode)

V1.0.0 起，**Lite 模式是唯一的生产拆分方式**，已弃用旧版经典 JSON 模式。

**两步流程：**
1. **标注步 (`ANNOTATE_AND_SPLIT`)**：AI 标注核心可替换词为 `{{变量名::原词}}` 格式。
2. **翻译步 (`TRANSLATE_TEMPLATE`)**：AI 将标注后的内容及提取的词条翻译为目标语言，保留所有 `{{xxx}}` 占位符。

### 功能开关
- **`src/constants/aiConfig.js`**: `AI_FEATURE_ENABLED`
  - 开发/测试环境建议开启 (`true`)。
  - 生产环境发版前需确认是否开放此功能。

### API Key 安全
- API Key 仅存储在用户浏览器的 `localStorage` 中，**严禁**硬编码在代码或提交到 Git。
- 测试时请确保清除本地缓存的测试 Key。

### 后端安全防护
- **速率限制**：`aiLimiter`（通用）+ `aiSplitLimiter`（拆分专用，30次/分钟）
- **输入校验**：`MAX_PROMPT_LENGTH`、`MAX_CONTEXT_LENGTH` 限制请求体大小
- **参数验证**：所有 payload 参数进行类型和长度检查
- **GLM API 调用**：`thinking: { type: 'disabled' }` 避免额外 token 消耗，`timeout: 60000ms`

---

## 6.5 智能拆分功能发版检查 (Smart Split Release)

> ⚠️ **推送前必须完成以下所有项目**，否则会导致调试接口暴露或 AI 拆分功能不可用。

### 🔴 调试模式（必须关闭）

- **`.env.local`**：确认 `VITE_DEBUG_SPLIT` 未设置为 `true`，或该文件已被 `.gitignore` 排除（默认已排除）。
- **Vercel 环境变量**：确认 Vercel 项目设置中**没有**配置 `VITE_DEBUG_SPLIT=true`，否则会在生产环境暴露调试入口。
- **`VITE_VIDEO_ENABLED`**：生产环境确认此变量未配置（Video 入口默认隐藏）。
- **验证方法**：本地执行 `npm run build && npm run preview`，确认"智能拆分"按钮旁**不显示**「🐛调试」按钮，侧边栏无 Video/UITest 入口。

### 🟡 后端代码同步（必须更新服务器）

- **`后端index.js`** 包含智能拆分的 `ANNOTATE_AND_SPLIT` 标注提示词和 `TRANSLATE_TEMPLATE` 翻译提示词，本地修改后**需手动同步至宝塔服务器**。
- **目标服务器路径**：`/www/wwwroot/promptfillapi/index.js`
- **同步步骤**：
    1. 将本地最新的 `后端index.js` 内容上传/替换至服务器对应文件。
    2. 在宝塔「Node 项目管理」中点击**重启**，使新提示词和模型配置生效。
    3. **验证**：在前端触发一次智能拆分，打开 DevTools Network 确认请求走 `/api/ai/process`（action: `polish-and-split-lite`），且返回包含标注变量和翻译内容。

### 🟢 功能验证

- [ ] 对一段**无变量**的纯文本执行智能拆分，结果变量数量在 2-5 个之间。
- [ ] 对一段包含 `[]` 或 `「」` 括号的提示词执行拆分，括号内内容被优先标记为变量。
- [ ] 对一段**已有变量**的模板执行智能拆分，确认弹出「当前已有变量，确认重新拆分？」提示框。
- [ ] 拆分成功后，自动生成双语内容（中英文模板 + 对应翻译词条）。
- [ ] 拆分成功后，工具栏出现「重置」按钮（PremiumButton 样式）。
- [ ] 点击「重置」，弹出左右对比弹窗，左侧显示拆分前内容，右侧显示拆分后内容。
- [ ] 点击「还原」，内容正确回退至拆分前，「重置」按钮消失。
- [ ] 切换模板后，「重置」按钮自动消失（快照已清除）。
- [ ] 删除已拆分的模板后，新建模板不会残留「重置」按钮。
- [ ] 拆分失败时（如断网），内容自动回滚，弹出失败提示，**不留下半截变量**。
- [ ] 词条扩展功能正常工作（GLM-4-Flash），生成的选项不含多余的 `[` 前缀。

---

## 7. 存储架构 (Storage)

### IndexedDB 迁移
- 核心数据（模板、词库、分类、默认值）已切换至 **IndexedDB** 存储，以突破 LocalStorage 的 5MB 限制。
- 只有设置信息（语言、主题、最后版本号等）保留在 LocalStorage。
- 发版前确保 `src/utils/db.js` 中的数据库版本号和迁移逻辑正常。

---

## 8. 发版最终检查清单

**通用**
1. [ ] `package.json` / `App.jsx` 的 `APP_VERSION` / `templates.js` 的 `SYSTEM_DATA_VERSION` 版本号一致？
2. [ ] 已运行 `npm run sync-data`？
3. [ ] `public/data/` 下的 JSON 是否已上传至宝塔 `/api/data` 目录？
4. [ ] 宝塔 Node 项目是否已重启？
5. [ ] 手机端和电脑端的更新日志是否已同步？
6. [ ] `README.md` 的版本号 Badge 和功能描述已更新？
7. [ ] 本地代码是否已执行 `git push`？

**智能拆分相关（有改动时必查）**
8. [ ] `.env.local` 的 `VITE_DEBUG_SPLIT=true` 未提交 / Vercel 未配置此变量？
9. [ ] `VITE_VIDEO_ENABLED` Vercel 未配置（Video 入口隐藏）？
10. [ ] `后端index.js` 最新版本已同步至宝塔服务器并重启？
11. [ ] 生产构建（`npm run build`）后确认无调试按钮、无 Video/UITest 入口可见？
12. [ ] 拆分模型已确认为 `glm-4.7`，词条扩展模型为 `glm-4-flash`？

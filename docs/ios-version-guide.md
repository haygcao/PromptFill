# iOS 最低版本适配建议

## 当前情况

- 当前最低版本：**iOS 18.6**
- 问题：门槛过高，大量用户无法安装（18.0–18.5、以及所有 17/16/15 用户）

## 建议最低版本

| 方案 | 建议版本 | 覆盖范围 | 说明 |
|------|----------|----------|------|
| **推荐** | **iOS 15.0** | 绝大多数活跃设备 | 与当前架构和 UI 完全兼容，用户面最广 |
| 保守 | iOS 16.0 | 略窄 | 若依赖的 Tauri 插件明确要求 16+ 再选 |
| 折中 | iOS 17.0 | 更窄 | 仅当希望少测老系统时考虑 |

**优先建议：把最低版本降到 iOS 15.0**，再根据实际构建/插件情况微调。

---

## 和你当前架构的兼容性

### 前端（React + Vite + WKWebView）

你用的 Web API 在 iOS 15+ 上都没问题：

- **IndexedDB**：iOS 10+
- **localStorage**：一直支持
- **navigator.share**：iOS 12.2+
- **navigator.clipboard.writeText**：iOS 13.4+
- **matchMedia('prefers-color-scheme')**：iOS 13+
- **CSS / Tailwind**：无依赖 iOS 18 的特性

因此从 **Web 侧** 看，**支持到 iOS 15 没有问题**。

### Tauri 与插件

- Tauri v2 的 iOS 构建基于 Xcode，**部署目标** 由 `IPHONEOS_DEPLOYMENT_TARGET` 决定，官方示例/文档中常见 **iOS 13+**，实际可设到 **iOS 15** 更稳妥。
- 你使用的插件建议在各自文档里确认一下最低 iOS：
  - `tauri-plugin-opener`：一般 13+
  - `tauri-plugin-fs` / `tauri-plugin-http`：一般 13+
  - iCloud 相关原生代码：以你在 `src-tauri` 里用的 API 为准（通常 15+ 足够）

结论：**整体架构和 UI 支持把最低版本设成 iOS 15**，无需为“兼容老系统”改前端逻辑。

---

## 在 Mac 上如何修改最低版本

`src-tauri` 在仓库里被 ignore，以下在 **Mac 本地** 的 `src-tauri` 里操作。

### 1. Xcode 工程（最常见）

- 用 Xcode 打开 `src-tauri/ios/` 下的 `.xcodeproj`
- 选中 **Project → 你的 Target → General**
- 找到 **Minimum Deployments** / **iOS 版本**
- 把 **18.6** 改成 **15.0**（或 16.0）

或直接改工程文件：

- 打开 `ios/*.xcodeproj/project.pbxproj`
- 搜索 `IPHONEOS_DEPLOYMENT_TARGET`
- 把所有 `18.6` 改为 `15.0`（保持同一工程里一致）

### 2. 若使用 Tauri 的 tauri.conf

若 `src-tauri/tauri.conf.json` 里有 iOS 相关配置，例如：

```json
"ios": {
  "deploymentTarget": "18.6"
}
```

改为：

```json
"ios": {
  "deploymentTarget": "15.0"
}
```

（具体键名以你项目里的 Tauri 文档为准。）

### 3. 若用 CocoaPods

检查 `ios/Podfile` 里是否有 `platform :ios, '18.6'`，改为 `'15.0'`。

### 4. 改完后必做

- **Clean**：Xcode 里 Product → Clean Build Folder
- **重新构建**：`npm run tauri ios build` 或 Xcode 里 Archive
- **真机 + 模拟器**：各选一台 iOS 15 / 16 设备做安装和基本功能测试

---

## 建议的测试清单（降版本后）

- [ ] 在 **iOS 15.x** 真机或模拟器上安装并打开 App
- [ ] 设置页：语言、外观、存储、iCloud（若开启）
- [ ] 模板编辑、复制结果、复制成功弹窗里的出图平台链接
- [ ] 分享、导出（若有）
- [ ] 从设置或侧栏打开 **GitHub / App Store** 等外链（opener 插件）

---

## 小结

- **18.6 过高**，会拦下大部分用户；建议改为 **iOS 15.0**（或 16.0），与你当前架构和 UI 兼容。
- 修改处：**仅在 Mac 的 `src-tauri` 里**（Xcode 的 `IPHONEOS_DEPLOYMENT_TARGET` 或 tauri.conf / Podfile），前端代码无需为“降低 iOS 版本”做改动。
- 降版本后做一次在 **iOS 15** 上的安装与核心流程测试即可。

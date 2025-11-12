<div align="center">

# kyxzhe.github.io

_Kevin Zheng 的个人网站，基于 Bentofolio 模板构建并部署在 GitHub Pages。_

[访问站点](https://kyxzhe.github.io)

</div>

## 项目简介

- **技术栈**：Next.js 15（App Router、Turbopack）、React 19、Tailwind CSS v4、Motion 动效
- **部署方式**：GitHub Actions 构建 → GitHub Pages 静态托管（`output: "export"`）
- **本地运行要求**：Node.js ≥ 18.18（推荐 20 LTS）+ pnpm 9（Corepack 自动管理）

## 快速开始

```bash
git clone https://github.com/kyxzhe/kyxzhe.github.io.git
cd kyxzhe.github.io
corepack enable pnpm           # 首次需要
pnpm install                   # 安装依赖
pnpm run dev                   # http://localhost:3000
pnpm run build                 # 生产构建，输出到 out/
```

> **提示**：项目根目录已经携带 `pnpm-lock.yaml`，请勿使用 npm/yarn 重新生成锁文件。

## 内容编辑指南

| 模块                     | 修改文件                                               | 说明 |
| ------------------------ | ------------------------------------------------------ | ---- |
| 站点文案（Hero、卡片）   | `src/lib/constants/siteContent.ts`                     | `hero`, `bentoItems` 等字段控制首页标题、描述、技能标签及卡片正文。 |
| 联系方式                | `src/lib/constants/contact.ts`                         | 修改邮箱、电话、所在地；`socials` 里可控制 CTA。 |
| 社交链接                | `src/lib/constants/socials.ts`                         | 对应导航右上角与 Contact 模态框的社交按钮。 |
| 导航/移动菜单           | `src/lib/constants/navItems.ts`                        | `href` 使用页面内锚点（例如 `#projects`）。 |
| 项目列表                | `src/lib/constants/projects.ts`                        | 每个项目包含 `title`, `description`, `tags`, `image`, `link`。图片放在 `public/projects/`。 |
| 控制台欢迎文案          | `src/components/Console.tsx` 与 `src/lib/utils/consoleUtil.ts` | 决定控制台彩蛋文本。 |
| 元数据 / SEO            | `src/app/layout.tsx`                                   | `metadata` 对象中设置站点标题、描述、OG/Twitter 信息。 |
| 主题与全局样式          | `src/app/globals.css`                                  | CSS 变量（颜色、阴影、栅格间距）以及基础排版。 |
| 个人头像 / 媒体资源     | `public/person2.jpg`、`public/projects/*`、`public/svgs/*` | 替换为你自己的图片，文件名保持一致或同步更新引用路径。 |

### 修改建议
1. **复制 assets**：保持 JPG/PNG/MP4 等文件位于 `public/` 内，Next.js 静态导出会直接拷贝。
2. **图片尺寸**：Hero 头像建议 800×800 以内；项目缩略图 1200×900 左右可减少体积。
3. **动画/布局**：所有动效定义集中在 `src/lib/animation/variants.ts`，如需统一调节时长或缓动可在此修改。
4. **表单/联系按钮**：当前按钮默认打开邮件链接（`mailto:`）；可在 `ContactModal.tsx` 中自定义为表单或外部链接。

## 部署与发布

1. 推送到 `main` 即可触发 `.github/workflows/deploy.yml`。流程：
   - 使用 Node 20 + pnpm 安装依赖；
   - 执行 `pnpm run build`（自动导出静态资源到 `out/`）；
   - 上传 `out/` 并通过 `actions/deploy-pages@v4` 发布。
2. 首次使用需在 **GitHub → Repository → Settings → Pages** 选择 “GitHub Actions” 作为部署来源。
3. 若需自定义域名，在同一页面绑定 `CNAME`，并在仓库 `public/` 内添加 `CNAME` 文件。

## 常见问题

- **构建时报 Node 版本错误**：请确认 `node -v` ≥ 18.18；推荐使用 `nvm install 20 && nvm use 20`。
- **图片加载失败**：检查 `public/` 路径与 `src/lib/constants` 中 `image` 字段是否一致；远程图片需在 `next.config.ts` 的 `images.remotePatterns` 中允许域名。
- **GitHub Pages 未更新**：在 Actions 页查看 `Deploy to GitHub Pages` workflow 结果；如失败，可手动 rerun 并查看日志。

## 目录结构

```
kyxzhe.github.io/
├── public/                 # 字体、图片、SVG、humans.txt
├── src/
│   ├── app/                # Next.js App Router (layout/page/全局样式)
│   ├── components/         # UI 组件（Navbar、Hero、Projects 等）
│   ├── hooks/              # 自定义 hook（菜单状态）
│   └── lib/
│       ├── animation/      # Motion 动画 variants
│       ├── constants/      # 所有可配置内容
│       └── utils/          # 辅助函数
├── .github/workflows/      # GitHub Pages 部署流水线
├── next.config.ts          # 静态导出 + 远程图片
├── package.json            # 脚本、依赖、包管理器信息
├── pnpm-lock.yaml
└── tsconfig.json
```

## 待办/可选优化

- 将 `public/fonts/` 中的 Gilroy 字体替换为有授权的字体或系统字体；
- 根据真实作品更新 `projects` 数据并添加外链；
- 在 `ContactModal` 中集成表单服务（Formspree / Resend），实现在线消息。

如需我继续协助（例如批量替换内容、编写自定义 section、接入后端 API），欢迎随时提出。🎉

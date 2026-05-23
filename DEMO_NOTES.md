# DBT Companion · Demo 简介

**Demo URL**: https://dbt-companion-swart.vercel.app/
**Repo**: https://github.com/amber-yanyi/dbt-companion

一个学生/心理咨询师 between-session 的 DBT 技能练习工具。

学校心理中心咨询师（典型场景：University of Michigan UCC）平时教学生 DBT 技能（处理冲突、调节情绪等），让他们带作业回家练习。问题是传统纸质 worksheet 学生回去不写、下次假装回忆一下应付。这个产品要做的事：**让学生在情绪发生那一刻能用、让咨询师下次见面前 30 秒就知道学生这周经历了什么**。

下面是产品功能描述。再下面是用一个示例学生（Maya）走一遍 user journey，**注意 demo 上的 4 个学生 + 老师都是预置的虚构数据，方便演示**——产品本身是通用的，任何咨询师都可以用来给自己的学生布置 + 跟踪。

---

# 产品功能

## 咨询师侧

### Dashboard — 30 秒扫所有学生
- "This week at a glance" 聚合视图按维度分块：DEARMAN 状态、PLEASE 数据、其他活动、Flagged for discussion、Quiet this week
- 学生名都可点击直接进单学生详情

### 单学生详情页
- **布置 weekly assignment**：选 focus skill（DEARMAN / PLEASE / Opposite Action / 不设）+ 切换每日 check-ins + 留 note 给学生
- 完整看到学生本周所有活动：DEARMAN 脚本 + 反思、PLEASE 7 天网格 + 每日详情、其他自发使用的 skill
- **私人 notes 区**：autosave，明确标注学生看不到

### 批量布置
- 从 dashboard 进 "Assign focus to multiple"——一次给多个学生同一个 focus / note（适配 DBT group session workflow）
- 单独修改某学生 assignment 仍然有效

### 模式可识别
- 系统自动 surface 模式（如"睡眠平均 < 7 小时"），但用 prose 不用红色警告——咨询师自己判断
- "Self-initiated" 标签区分 assigned vs 学生自发使用的 skill
- 所有 entry 都标 "Asynchronous log" 提示——明确不是实时监控

---

## 学生侧

### Home
- 看到老师布置的本周 focus + 老师的 note
- 当前进行中的 DEARMAN 状态卡 + 每日 check-in 入口
- 新建账号且没数据时显示温和的 Welcome card 而不是空 focus 卡

### DEARMAN（计划一次困难对话）
- 10 步引导式 planning，每屏一个问题，随时存档继续
- 自动组合 D+E+A+R 四段成可编辑脚本 + M/A/N "Before you go in" 提醒
- 完成对话后填 5 问反思（是否发生 / 整体 / 是否达成诉求 / 关系变化 / 自由 note）
- **Previous DEARMANs 归档**：可看可编辑过往反思（反思会随时间变化）
- **Abandon plan**：随时可以放弃没完成的 plan（不是所有计划的对话都要发生）

### PLEASE（身体基础日检）
- 5 字段 < 60 秒：睡眠 / 运动 / 三餐 / 用药 / 生病
- 7 天网格 + 每日详情列表（**学生能看到自己历史**——不只是老师能看）
- 缺的天就是空格，不是 "missed"——定位是 self-observation 而非 compliance tracker

### Skill library
- Opposite Action：教学内容 + "I used this" log 表单 + 使用历史
- Observe & Describe：教学内容

### Flag for next session ★
**最重要的 student → clinician 反向信号**：学生可以给任意 entry（DEARMAN 反思 / PLEASE 单日 / Opposite Action log）点 ★ 标记"我想下周聊这个"。咨询师 dashboard 会自动 surface 一个 "Flagged for discussion" 块。

---

## 跨端 / 共用

- **多账号 demo login**：登录页列出已 seeded 的账号 + 自建账号
- **"+ Add new student"**：任何访问者可以一键建一个自己的账号体验，并可自删
- **Account switcher**：右上角随时切换身份
- **手机优先**：UX 按手机设计，但桌面也好用
- **微文案纪律**：全 app 不用 "complete / due / missed / streak"，用 "noticed / when you're ready / come back" 替代

---

# Demo 中的预置数据（mock）

为了让 demo 一打开就有故事可看，我们预置了 1 个咨询师 + 4 个学生 + 完整一周的虚构数据。这些都是 demo seed，**不是产品本身的限制**——真实部署时咨询师可以管自己的学生 caseload。

| Demo 角色 | 演示什么 |
|---|---|
| **Dr. Park** | 咨询师，关联以下 4 个学生 |
| **Maya** | 完整 happy path——DEARMAN 走完 + PLEASE 5 条 + Opposite Action 自发使用 |
| **Luke** | DEARMAN 卡在第 5 步——告诉爸爸要从医学预科转哲学，停在那不敢继续 |
| **Sarah** | 只用 PLEASE，睡眠模式触发 pattern callout |
| **Jordan** | 被布置了但完全没动——真实咨询场景常见状态 |

登录页 "+ Add new student" 可以创你自己的账号——从零开始体验"first-time 学生"视角。

---

# 用 Maya 的故事走一遍

下面这个一周闭环用 Maya 的预置数据演示**每个功能在实际场景中怎么发生**：

### 周一 session 后 · Dr. Park 在 app 里布置
Session 结束，Dr. Park 打开 Maya 的页面：
- 选这周 focus 为 **DEARMAN**（要跟室友 Alex 谈脏盘子）
- 打开 **PLEASE** 每日 check-in
- 留 note："We talked about DEARMAN with Alex. Take your time."

同时在 **My notes** 私人区写："Maya 回避主题明显。如果她下周还没跟 Alex 谈，下次 session 探索 conflict 信念。"

> Group session 后还能用 "Assign focus to multiple" 一键给多人布置同样的 focus。

### 周一到周六 · Maya 自己用
- **周二** Maya 打开 app 看到 home 上 DEARMAN focus 卡 + 老师的 note。开始填 DEARMAN 10 步。
- **周三** 续填到第 10 步，编辑脚本，存为 "plan ready"。
- **周四** 真的找 Alex 谈了。回 app 填反思——happened: yes / overall: 4 / got what asked: partially / relationship: better。
- **周六** 复习经济学焦虑发作，自发用了 **Opposite Action**：逼自己去学习小组而不是窝床。回来 log 一笔。
- **周日** 把 DEARMAN 反思和周四 PLEASE 那条都 ★ flag——"我想下周聊这个"。

### 周日晚 · Dr. Park 30 秒看完准备下周 session
Dashboard at-a-glance：
- ★ Flagged for discussion: Maya 标了 2 件事
- DEARMAN: Maya 反思过了 · Luke 卡在 5/10 · Sarah Jordan 没开始
- PLEASE: Maya 5 条 · Sarah 4 条 · 平均睡眠 < 7h 的有 Maya, Sarah
- Quiet this week: Jordan

点 Maya 看完整轨迹。Next session 开局不再是 "How was your week?"，而是 "I saw you flagged Thursday's PLEASE — tell me about that night."

---

# 怎么试

1. 打开 https://dbt-companion-swart.vercel.app/
2. **Dr. Park 视角**：登录 → dashboard 30 秒视图 → 点 Maya 看完整 → 试 "Assign focus to multiple" 看批量布置
3. **学生视角**：右上角 Switch account → 换成 Maya → home → DEARMAN → Previous DEARMANs 展开看反思（可以试 "Edit reflection" 修改）
4. **First-time 视角**："+ Add new student" 起个名字 → 体验空状态 + Welcome card

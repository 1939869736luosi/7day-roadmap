// OKR 数据 API
// GET: 读取所有天的 OKR 数据
// PUT: 更新某天的某个字段

const DEFAULT_DATA = {
    day1: {
        status: "done",
        title: "Antigravity & 文风沉淀",
        objective: [
            "学会 Antigravity",
            "沉淀了文风 Skills、文风学习 Skills、转录 Skills",
            "解决了自媒体创作中的文案问题",
            "学会了 Granola",
            "初步学习了 Obsidian 和 Whisper Flow 和 Raycast"
        ],
        keyResults: [],
        review: ""
    },
    day2: {
        status: "done",
        title: "Skills 深度学习 & MCP",
        objective: [
            "进一步沉淀了小满的自媒体文风",
            "学习了 Skills（玩了很多 Skills）（顺便学会了创建 Skills、Workflow 转 Skills、使用了三个 Skills）",
            "学会使用 Granola 和 v0 的 MCP"
        ],
        keyResults: [],
        review: ""
    },
    day3: {
        status: "current",
        title: "MCP 工具链 & 信息传播 Skills",
        objective: [
            "学习微信公众号文章阅读 MCP",
            "Claude Code 中 Skills 的初步使用",
            "完全学习 Whisper Flow",
            "学习 GitHub 和 ChatPRD 和 Granola 和 v0 这四者 MCP，加上 CF 和 Railway 的 CLI，如何构建为 Skills（信息传播 Skills）"
        ],
        keyResults: [],
        review: ""
    },
    day4: {
        status: "upcoming",
        title: "Obsidian 数据库搭建",
        objective: [
            "Obsidian 数据库搭建（微信聊天记录导入、个人上下文管理、会议记录、项目资料库）",
            "把第三天学到的 MCP 实际跑通，沉淀为 Workflow"
        ],
        keyResults: [],
        review: ""
    },
    day5: {
        status: "upcoming",
        title: "每日信息自动抓取管线",
        objective: [
            "信息源接入：每天的聊天记录和 RSS 和各种信息源，自动抓取流程搭建",
            "输出格式逐个跑通：Canvas（Obsidian 的 skills）、播客、网页、信息图、PPT、思维导图",
            "视频概览输出（结合剪辑 Skills 和 Remotion Skills）",
            "整条管线串联：信息源 → 抓取 → 多格式输出，沉淀为 Workflow/Skills"
        ],
        keyResults: [],
        review: ""
    },
    day6: {
        status: "upcoming",
        title: "自媒体 IP 打造",
        objective: [
            "标题文案 Skills（参照文案）",
            "善用 AI Toolkit Collection 里面大量很好的 YouTube 和剪辑 Skills",
            "Qwen TTS / 配图 API 接入，结合 UI/UX Pro Max Skills",
            "去给自己的视频添加背书和活力和 YouTube 元素，沉淀为完整的自媒体创作 Skills"
        ],
        keyResults: [],
        review: ""
    },
    day7: {
        status: "upcoming",
        title: "Raycast 深度 & 全链路沉淀",
        objective: [
            "Raycast 深度学习（快捷指令、Extensions、与 AI 工作流的结合）",
            "信息传播 Skills 最终整合（Antigravity + ChatPRD + Granola + v0 + CF/Railway → 完整工作流）",
            "所有 Workflow 和 Skills 文件规范化（统一格式、写好文档）",
            "跑通一个完整的端到端 Demo：从信息抓取 → 内容生成 → 多格式输出 → 发布"
        ],
        keyResults: [],
        review: ""
    }
};

export async function onRequestGet(context) {
    const { env } = context;
    let data = await env.TASK_STATUS.get("okr_data", "json");
    if (!data) {
        data = DEFAULT_DATA;
        await env.TASK_STATUS.put("okr_data", JSON.stringify(data));
    }
    return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
}

export async function onRequestPut(context) {
    const { env, request } = context;
    const body = await request.json();
    const { day, field, value } = body;

    if (!day || !field) {
        return new Response(JSON.stringify({ error: "缺少 day 或 field" }), { status: 400 });
    }

    const validFields = ["status", "title", "objective", "keyResults", "review"];
    if (!validFields.includes(field)) {
        return new Response(JSON.stringify({ error: "无效字段" }), { status: 400 });
    }

    let data = await env.TASK_STATUS.get("okr_data", "json");
    if (!data) data = DEFAULT_DATA;

    if (!data[day]) {
        return new Response(JSON.stringify({ error: "无效的 day" }), { status: 400 });
    }

    data[day][field] = value;
    await env.TASK_STATUS.put("okr_data", JSON.stringify(data));

    return new Response(JSON.stringify({ ok: true, data: data[day] }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    });
}

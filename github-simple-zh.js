// ==UserScript==
// @name         GitHub 极简汉化
// @namespace    https://github.com/
// @version      4.1
// @description  用内置词典把 GitHub 常见界面文本替换为中文，保护文件名与用户生成的描述
// @author       You
// @match        https://github.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const ENABLE_PARTIAL = true;
    const MAX_PARTIAL_LEN = 120;
    const DEBOUNCE_DELAY = 200;

    const SKIP_TAGS = new Set([
        'SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA', 'INPUT',
        'KBD', 'SAMP', 'VAR', 'SELECT', 'OPTION'
    ]);

    const DICT = {
        'Agent suggestions for issues': '针对议题的代理建议',
        'Agent suggestions': '代理建议',
        'suggestions': '建议',
        'Agent': '代理',
        'Interaction limits': '交互限制',
        'Code review limits': '代码审查限制',
        'limits': '限制',
        'Runners': '运行器',
        'Policies': '策略',
        'Policy': '策略',
        'Policy insights': '策略洞察',
        'Code review': '代码审查',
        'review': '审查',
        'Cloud': '云端',
        'Internet': '互联网',
        'Internet access': '互联网访问',
        'MCP servers': 'MCP 服务器',
        'Dreaming': '构想',
        'General': '常规',
        'Access': '访问',
        'Collaborators': '协作者',
        'Moderation': '审核',
        'Code, planning, and automation': '代码、计划与自动化',
        'Rulesets': '规则集',
        'Webhooks': 'Webhooks',
        'Planning': '计划',
        'Pages': '页面',
        'Advanced Security': '高级安全',
        'Deploy keys': '部署密钥',
        'Secrets and variables': '机密与变量',
        'Actions secrets and variables': '操作机密与变量',
        'Dependabot secrets': 'Dependabot 机密',
        'Codespaces secrets': '代码空间机密',
        'Code security and analysis': '代码安全与分析',
        'MCP registry': 'MCP 注册表',
        'New codespace': '新建代码空间',
        'Type / to search': '输入 / 以搜索',
        'Branch': '分支',
        'Tag': '标签',
        'Feed': '动态',
        'Discussions': '讨论',
        'Codespaces': '代码空间',
        'Copilot': 'Copilot',
        'Agents': '代理',
        'Explore': '探索',
        'Marketplace': '市场',
        'Notifications': '通知',
        'Pull requests': '拉取请求',
        'Issues': '议题',
        'Sign in': '登录',
        'Sign up': '注册',
        'Sign out': '退出登录',
        'Settings': '设置',
        'Help': '帮助',
        'Dashboard': '仪表盘',
        'Home': '首页',
        'Upgrade': '升级',
        'Your profile': '你的个人资料',
        'Your repositories': '你的仓库',
        'Your organizations': '你的组织',
        'Your projects': '你的项目',
        'Your stars': '你的星标',
        'Your gists': '你的代码片段',
        'Your sponsors': '你的赞助',
        'New repository': '新建仓库',
        'New organization': '新建组织',
        'New project': '新建项目',
        'New gist': '新建代码片段',
        'Import repository': '导入仓库',
        'Account settings': '账户设置',
        'Appearance': '外观',
        'Accessibility': '无障碍',
        'Billing and plans': '账单与套餐',
        'Emails': '邮箱',
        'Password and authentication': '密码与认证',
        'Sessions': '会话',
        'SSH and GPG keys': 'SSH 与 GPG 密钥',
        'Repositories': '仓库',
        'Organizations': '组织',
        'Projects': '项目',
        'Stars': '星标',
        'Sponsors': '赞助',
        'Code': '代码',
        'Actions': '操作',
        'Wiki': '维基',
        'Security': '安全',
        'Security and quality': '安全与质量',
        'Insights': '洞察',
        'Pulse': '脉搏',
        'Contributors': '贡献者',
        'Community': '社区',
        'Traffic': '流量',
        'Commits': '提交',
        'Code frequency': '代码频率',
        'Dependency graph': '依赖图',
        'Network': '网络',
        'Forks': '复刻',
        'Fork': '复刻',
        'Star': '星标',
        'Unstar': '取消星标',
        'Watch': '关注',
        'Unwatch': '取消关注',
        'Sponsor': '赞助',
        'Clone': '克隆',
        'Download ZIP': '下载 ZIP',
        'Add file': '添加文件',
        'Go to file': '转到文件',
        'Create new file': '新建文件',
        'Upload files': '上传文件',
        'Find file': '查找文件',
        'Edit': '编辑',
        'Delete': '删除',
        'Save': '保存',
        'Cancel': '取消',
        'Confirm': '确认',
        'Submit': '提交',
        'Copy': '复制',
        'Copied!': '已复制！',
        'More': '更多',
        'Show more': '显示更多',
        'Show less': '显示更少',
        'Preview': '预览',
        'Write': '编写',
        'Commit changes': '提交更改',
        'Create': '创建',
        'Add': '添加',
        'Remove': '移除',
        'View': '查看',
        'Download': '下载',
        'Upload': '上传',
        'Back': '返回',
        'Next': '下一页',
        'Previous': '上一页',
        'Filter': '筛选',
        'Sort': '排序',
        'All': '全部',
        'Public': '公开',
        'Private': '私有',
        'Archived': '已归档',
        'Template': '模板',
        'Forked': '已复刻',
        'Branches': '分支',
        'Tags': '标签',
        'Switch branches/tags': '切换分支/标签',
        'Switch branch/tag': '切换分支/标签',
        'About': '关于',
        'License': '许可证',
        'Activity': '动态',
        'Releases': '发布',
        'Packages': '软件包',
        'Environments': '环境',
        'Deployments': '部署',
        'Latest commit': '最新提交',
        'History': '历史',
        'Files': '文件',
        'Languages': '语言',
        'No description, website, or topics provided.': '未提供描述、网站或主题。',
        'Edit repository metadata': '编辑仓库元数据',
        'Report repository': '举报仓库',
        'Use this template': '使用此模板',
        'Pin': '置顶',
        'Unpin': '取消置顶',
        'New issue': '新建议题',
        'New pull request': '新建拉取请求',
        'Open': '开启',
        'Closed': '已关闭',
        'Merged': '已合并',
        'Draft': '草稿',
        'Author': '作者',
        'Labels': '标签',
        'Milestone': '里程碑',
        'Milestones': '里程碑',
        'Assignee': '指派给',
        'Assignees': '指派给',
        'Reviewers': '审查者',
        'Comment': '评论',
        'Comments': '评论',
        'Close issue': '关闭议题',
        'Close with comment': '评论并关闭',
        'Reopen issue': '重新打开议题',
        'Submit new issue': '提交新议题',
        'Create pull request': '创建拉取请求',
        'Compare & pull request': '比较并创建拉取请求',
        'Approve': '批准',
        'Request changes': '请求更改',
        'Add a comment': '添加评论',
        'Leave a comment': '留下评论',
        'Write a comment': '写评论',
        'Reply': '回复',
        'Quote reply': '引用回复',
        'Edit comment': '编辑评论',
        'Delete comment': '删除评论',
        'Subscribe': '订阅',
        'Unsubscribe': '取消订阅',
        'Approved': '已批准',
        'Changes requested': '请求更改',
        'Review required': '需要审查',
        'Success': '成功',
        'Failure': '失败',
        'Pending': '待处理',
        'Skipped': '已跳过',
        'Neutral': '中性',
        'Queued': '排队中',
        'In progress': '进行中',
        'Completed': '已完成',
        'Waiting': '等待中',
        'Ready': '就绪',
        'just now': '刚刚',
        'yesterday': '昨天',
        'last week': '上周',
        'last month': '上个月',
        'last year': '去年',
        'Today': '今天',
        'Loading...': '加载中…',
        'No results matched your search.': '没有匹配的搜索结果。',
        'Something went wrong.': '出错了。',
        'Try again': '重试',
        'Learn more': '了解更多',
        'Read more': '阅读更多',
        'Show details': '显示详情',
        'Hide details': '隐藏详情',
        'Back to top': '回到顶部',
        'View all': '查看全部',
        'See all': '查看全部',
        'View more': '查看更多',
        'Trending': '趋势',
        'Collections': '合集',
        'Events': '活动',
        'GitHub Sponsors': 'GitHub 赞助',
        'Terms': '条款',
        'Privacy': '隐私',
        'Status': '状态',
        'Docs': '文档',
        'Contact GitHub': '联系 GitHub',
        'Pricing': '定价',
        'Training': '培训',
        'Blog': '博客',
        'Open in new tab': '在新标签页中打开',
        'Edit on GitHub': '在 GitHub 上编辑'
    };

    const REGEX_DICT = [
        [/\b(\d+)\s+seconds?\s+ago\b/gi, '$1 秒前'],
        [/\b(\d+)\s+minutes?\s+ago\b/gi, '$1 分钟前'],
        [/\b(\d+)\s+hours?\s+ago\b/gi, '$1 小时前'],
        [/\b(\d+)\s+days?\s+ago\b/gi, '$1 天前'],
        [/\b(\d+)\s+weeks?\s+ago\b/gi, '$1 周前'],
        [/\b(\d+)\s+months?\s+ago\b/gi, '$1 个月前'],
        [/\b(\d+)\s+years?\s+ago\b/gi, '$1 年前'],
        [/\b(\d+)\s+Branches\b/gi, '$1 个分支'],
        [/\b(\d+)\s+Tags\b/gi, '$1 个标签'],
        [/\b(\d+)\s+Contributors?\b/gi, '$1 位贡献者'],
        [/\b(\d+)\s+Commits?\b/gi, '$1 次提交']
    ];

    const DICT_LOWER = {};
    for (const [k, v] of Object.entries(DICT)) {
        DICT_LOWER[k.toLowerCase()] = v;
    }

    const SORTED_KEYS = Object.keys(DICT).sort((a, b) => b.length - a.length);

    const pending = new Set();
    let timer = null;
    let observer = null;

    function isSkippable(el) {
        if (!el) return true;
        if (SKIP_TAGS.has(el.tagName)) return true;
        if (el.closest('[contenteditable="true"]')) return true;
        if (el.closest('.markdown-body, .comment-body, [data-testid="markdown-body"], .blob-code, .highlight, [data-testid="code-viewer"]')) return true;
        if (el.closest('[data-testid="commit-row-item"], .commit-title, .commit-desc')) return true;
        return false;
    }

    function translateText(text) {
        const trimmed = text.trim();
        if (!trimmed) return null;

        if (/[\u4e00-\u9fa5]/.test(trimmed)) return null;

        if (/\.[a-zA-Z0-9]{1,6}$/.test(trimmed) || /\b[\w-]+\.(md|js|ts|py|json|css|html|txt|yml|yaml|go|rs|java|cpp|c|h|sh)\b/i.test(trimmed)) {
            return null;
        }

        const exact = DICT_LOWER[trimmed.toLowerCase()];
        if (exact) return exact;

        if (!ENABLE_PARTIAL) return null;
        if (trimmed.length > MAX_PARTIAL_LEN || trimmed.includes('\n')) return null;

        let result = trimmed;

        for (const [re, rep] of REGEX_DICT) {
            result = result.replace(re, rep);
        }

        for (const key of SORTED_KEYS) {
            if (!result.toLowerCase().includes(key.toLowerCase())) continue;
            const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const re = new RegExp(`\\b${escaped}\\b`, 'gi');
            result = result.replace(re, DICT[key]);
        }

        return result !== trimmed ? result : null;
    }

    function processNode(node) {
        const parent = node.parentElement;
        if (!parent || isSkippable(parent)) return;

        const raw = node.nodeValue;
        const translated = translateText(raw);

        if (translated == null || translated === raw) return;

        const lead = raw.match(/^\s*/)[0];
        const tail = raw.match(/\s*$/)[0];
        node.nodeValue = lead + translated + tail;
    }

    function processAttributes(root) {
        if (!root.querySelectorAll) return;
        const elements = root.querySelectorAll('input[placeholder], textarea[placeholder]');
        for (const el of elements) {
            const ph = el.getAttribute('placeholder');
            if (!ph) continue;

            const translated = translateText(ph);
            if (translated && translated !== ph) {
                el.setAttribute('placeholder', translated);
            }
        }
    }

    function scan(root) {
        if (!root) return;

        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                const p = node.parentElement;
                if (!p || isSkippable(p)) return NodeFilter.FILTER_REJECT;
                if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        const list = [];
        while (walker.nextNode()) list.push(walker.currentNode);
        list.forEach(processNode);

        processAttributes(root);

        if (root.querySelectorAll) {
            const elements = root.querySelectorAll('*');
            for (const el of elements) {
                if (el.shadowRoot) {
                    scan(el.shadowRoot);
                }
            }
        }
    }

    function schedule() {
        if (timer) return;
        timer = setTimeout(() => {
            timer = null;
            const nodes = Array.from(pending);
            pending.clear();
            for (const n of nodes) {
                if (n.isConnected) {
                    if (n.nodeType === Node.TEXT_NODE) {
                        processNode(n);
                    } else {
                        scan(n);
                    }
                }
            }
        }, DEBOUNCE_DELAY);
    }

    function start() {
        scan(document.body);

        if (!observer) {
            observer = new MutationObserver(mutations => {
                let hasChanges = false;
                for (const m of mutations) {
                    for (const n of m.addedNodes) {
                        if (n.nodeType === Node.ELEMENT_NODE || n.nodeType === Node.TEXT_NODE) {
                            pending.add(n);
                            hasChanges = true;
                        }
                    }
                    if (m.type === 'attributes' && m.attributeName === 'placeholder') {
                        pending.add(m.target);
                        hasChanges = true;
                    }
                    if (m.type === 'characterData') {
                        pending.add(m.target);
                        hasChanges = true;
                    }
                }
                if (hasChanges) schedule();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: true,
                attributeFilter: ['placeholder']
            });
        }
    }

    document.addEventListener('turbo:load', start);
    document.addEventListener('pjax:end', start);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
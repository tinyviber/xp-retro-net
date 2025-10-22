import { ExerciseDefinition } from "@/types/network";

const DOMAIN_IPS = {
  "baidu.com": "39.156.66.14",
  "bing.com": "204.79.197.200",
  "qq.com": "125.39.52.26",
  "bilibili.com": "23.66.147.113",
  "taobao.com": "140.205.94.189",
  "jd.com": "111.13.100.91",
  "youku.com": "203.107.50.59",
} as const;

const createDomainMap = (domains: (keyof typeof DOMAIN_IPS)[]) =>
  domains.reduce<Record<string, string>>((acc, key) => {
    acc[key] = DOMAIN_IPS[key];
    return acc;
  }, {});

export const exercises: ExerciseDefinition[] = [
  {
    id: 1,
    title: "练习 1｜DHCP 关闭导致 APIPA",
    summary: "模拟 DHCP 失效时主机落入 169.254.x.x 地址段的典型故障，要求学员手动恢复可用网络。",
    scenario:
      "小明的电脑突然打不开任何网页。老师发现多台电脑都拿到了 169.254.x.x 地址，研判为 DHCP 服务不可用。",
    objectives: [
      "识别 APIPA 地址与正常网段的差异。",
      "根据给定网段手动填写 IP、掩码、网关与 DNS。",
      "通过 ping 验证局域网与互联网连通性。",
    ],
    hints: [
      "APIPA 地址段 (169.254.x.x) 只能在本地自组织网络通信，无法访问网关。",
      "可以直接切换到手动 IP，也可以先尝试开启路由器 DHCP。",
      "DNS 可使用 114.114.114.114 或 223.5.5.5。",
    ],
    initialNetwork: {
      ipAddress: "169.254.45.12",
      subnetMask: "255.255.0.0",
      gateway: "",
      dns: "",
    },
    initialRouter: {
      dhcpEnabled: false,
      lanGateway: "192.168.1.1",
      lanSubnetMask: "255.255.255.0",
      dhcpRangeStart: "192.168.1.100",
      dhcpRangeEnd: "192.168.1.200",
      dhcpDns: "114.114.114.114",
      wanConnected: true,
      wanIp: "100.64.1.2",
      wanGateway: "100.64.1.1",
    },
    initialModes: {
      ip: "auto",
      dns: "auto",
    },
    initialSetup: {
      router: [
        "LAN: 192.168.1.1/24",
        "DHCP 已关闭，原地址池 192.168.1.100-200",
        "WAN 正常上线，DNS 指向 114.114.114.114",
      ],
      computer: [
        "网卡设置为自动获取 IPv4",
        "当前分配到 APIPA 169.254.45.12",
        "无网关与 DNS 信息",
      ],
    },
    allowedActions: [
      "进入路由器面板，开启或关闭 DHCP 服务",
      "在网络适配器属性中改为静态 IP",
      "使用 ipconfig、ping 观察现象",
    ],
    symptoms: [
      "ipconfig 显示 IPv4 地址为 169.254.x.x",
      "ping 192.168.1.1 请求超时",
      "ping baidu.com 提示无法解析目标主机",
    ],
    resolution: [
      "先在终端确认当前 IP 段与网关缺失情况。",
      "在路由器开启 DHCP 或手动设置 192.168.1.10 / 255.255.255.0 / 192.168.1.1。",
      "填写 DNS（114.114.114.114），依次 ping 网关和外网确认恢复。",
    ],
    takeaways: [
      "169.254.*.* 出现意味着主机没有从 DHCP 成功获取地址。",
      "手动配置时需要成套填写 IP、掩码、网关与 DNS。",
    ],
    pingTargets: [
      {
        name: "路由器网关",
        ip: "192.168.1.1",
        description: "局域网默认网关",
      },
      {
        name: "114.114.114.114",
        ip: "114.114.114.114",
        description: "公共 DNS 服务",
      },
      {
        name: "baidu.com",
        ip: DOMAIN_IPS["baidu.com"],
        description: "模拟外网站点",
      },
    ],
    domainMap: createDomainMap(["baidu.com", "bing.com"]),
    desktopTools: ["router", "network", "terminal"],
  },
  {
    id: 2,
    title: "练习 2｜DNS 配置错误",
    summary: "电脑能够访问网关与外网 IP，但由于 DNS 手工填写错误，域名解析失败。",
    scenario:
      "用户反馈“能打游戏但打不开网页”。排查发现电脑手动写了无效的 DNS 地址 1.1.1.300。",
    objectives: [
      "读取 ipconfig 输出，核对当前 DNS。",
      "将 DNS 改回自动或使用可用的公共 DNS。",
      "再次通过 ping 域名确认恢复解析。",
    ],
    hints: [
      "DNS 地址必须是合法 IPv4，例如 114.114.114.114。",
      "如果课堂演示，可让学生对比 ping IP 与 ping 域名的差异。",
      "也可以临时改用 223.5.5.5 来验证。",
    ],
    initialNetwork: {
      ipAddress: "",
      subnetMask: "",
      gateway: "",
      dns: "1.1.1.300",
    },
    initialRouter: {
      dhcpEnabled: true,
      lanGateway: "192.168.1.1",
      lanSubnetMask: "255.255.255.0",
      dhcpRangeStart: "192.168.1.100",
      dhcpRangeEnd: "192.168.1.200",
      dhcpDns: "114.114.114.114",
      wanConnected: true,
      wanIp: "100.64.1.3",
      wanGateway: "100.64.1.1",
    },
    initialModes: {
      ip: "auto",
      dns: "manual",
    },
    initialSetup: {
      router: [
        "LAN: 192.168.1.1/24，DHCP 已开启",
        "地址池 192.168.1.100-200，默认下发 DNS 为 114.114.114.114",
      ],
      computer: [
        "自动获取 IP，当前租到 192.168.1.101",
        "DNS 被手动改为 1.1.1.300（非法地址）",
      ],
    },
    allowedActions: [
      "在网卡中改为自动获取 DNS",
      "或手动填入 114.114.114.114 / 223.5.5.5",
      "使用 ping 验证域名与 IP 的区别",
    ],
    symptoms: [
      "ipconfig 显示 DNS 为 1.1.1.300",
      "ping 192.168.1.1 或 114.114.114.114 正常",
      "ping baidu.com 提示无法解析目标主机",
    ],
    resolution: [
      "通过 ipconfig 记录当前有效 IP 与错误 DNS。",
      "改为自动或重新填写合法 DNS。",
      "重新执行 ping baidu.com，确认解析与连通恢复。",
    ],
    takeaways: [
      "能 ping 通 IP 却解析不了域名时应优先检查 DNS。",
      "公共 DNS 地址需要写全四段且在 0-255 范围内。",
    ],
    pingTargets: [
      {
        name: "路由器网关",
        ip: "192.168.1.1",
        description: "确认内网连通",
      },
      {
        name: "114.114.114.114",
        ip: "114.114.114.114",
        description: "公共 DNS",
      },
      {
        name: "baidu.com",
        ip: DOMAIN_IPS["baidu.com"],
        description: "测试域名解析",
      },
    ],
    domainMap: createDomainMap(["baidu.com", "bing.com", "qq.com"]),
    desktopTools: ["network", "terminal"],
  },
  {
    id: 3,
    title: "练习 3｜网关配置错误",
    summary: "电脑写错了默认网关，导致无法访问外部网络。",
    scenario:
      "新入职同事手动配置静态 IP 后能访问局域网共享，却无法访问互联网，怀疑默认网关填写错误。",
    objectives: [
      "通过 ipconfig 判断默认网关是否正确。",
      "修正网关地址后再次测试连通。",
      "区分内网互通与访问外网的差异。",
    ],
    hints: [
      "默认网关应为 192.168.1.1。",
      "改完网关后可先 ping 114.114.114.114，再测试域名。",
      "静态配置时注意避免与 DHCP 地址池重叠。",
    ],
    initialNetwork: {
      ipAddress: "192.168.1.10",
      subnetMask: "255.255.255.0",
      gateway: "192.168.1.254",
      dns: "114.114.114.114",
    },
    initialRouter: {
      dhcpEnabled: false,
      lanGateway: "192.168.1.1",
      lanSubnetMask: "255.255.255.0",
      dhcpRangeStart: "192.168.1.100",
      dhcpRangeEnd: "192.168.1.200",
      dhcpDns: "114.114.114.114",
      wanConnected: true,
      wanIp: "100.64.1.4",
      wanGateway: "100.64.1.1",
    },
    initialSetup: {
      router: [
        "LAN: 192.168.1.1/24，DHCP 关闭",
        "需要手动为终端配置 IP",
      ],
      computer: [
        "静态 IP 192.168.1.10/24",
        "默认网关误写为 192.168.1.254",
      ],
    },
    allowedActions: [
      "修改网关为 192.168.1.1",
      "保持 DNS 为 114.114.114.114",
      "使用 ping 验证网关与外网",
    ],
    symptoms: [
      "ping 192.168.1.1 超时或提示不可达",
      "ping 192.168.1.254 无响应",
      "ping baidu.com 请求超时",
    ],
    resolution: [
      "确认当前网关字段为 192.168.1.254。",
      "改为 192.168.1.1 后重新测试网关与公网 IP。",
      "最后 ping baidu.com 验证域名解析。",
    ],
    takeaways: [
      "默认网关决定是否能出网，写错会导致外网不可达。",
      "静态 IP 需与网关处于同一网段。",
    ],
    pingTargets: [
      {
        name: "路由器网关",
        ip: "192.168.1.1",
        description: "应先确保能互通",
      },
      {
        name: "114.114.114.114",
        ip: "114.114.114.114",
        description: "验证外网 IP",
      },
      {
        name: "baidu.com",
        ip: DOMAIN_IPS["baidu.com"],
        description: "验证域名解析",
      },
    ],
    domainMap: createDomainMap(["baidu.com", "bing.com", "taobao.com"]),
    desktopTools: ["network", "terminal"],
  },
  {
    id: 4,
    title: "练习 4｜子网掩码配置错误",
    summary: "主机表面看似在同一网段，但子网掩码不一致导致与网关通信异常。",
    scenario:
      "电脑手工配置 IP 后，子网掩码被误填为 255.255.0.0，导致 ARP 请求异常，与网关不通。",
    objectives: [
      "识别子网掩码与网段边界的关系。",
      "修正掩码后验证局域网互通。",
      "确认可以访问外部网络。",
    ],
    hints: [
      "正确的掩码应为 255.255.255.0。",
      "掩码越大，广播域越大，容易造成错误判断。",
      "修改掩码后务必重新 ping 网关。",
    ],
    initialNetwork: {
      ipAddress: "192.168.1.150",
      subnetMask: "255.255.0.0",
      gateway: "192.168.1.1",
      dns: "114.114.114.114",
    },
    initialRouter: {
      dhcpEnabled: true,
      lanGateway: "192.168.1.1",
      lanSubnetMask: "255.255.255.0",
      dhcpRangeStart: "192.168.1.100",
      dhcpRangeEnd: "192.168.1.200",
      dhcpDns: "114.114.114.114",
      wanConnected: true,
      wanIp: "100.64.1.5",
      wanGateway: "100.64.1.1",
    },
    initialSetup: {
      router: [
        "LAN: 192.168.1.1/24",
        "DHCP 保持开启，提供 192.168.1.100-200",
      ],
      computer: [
        "静态 IP 192.168.1.150",
        "子网掩码误填 255.255.0.0",
      ],
    },
    allowedActions: [
      "将子网掩码改为 255.255.255.0",
      "维持其他参数不变",
      "使用 ping 验证网关与外网",
    ],
    symptoms: [
      "ping 192.168.1.1 请求超时",
      "ipconfig 显示掩码异常",
      "即便 DNS 正确也无法访问外部网络",
    ],
    resolution: [
      "检查 ipconfig 输出的子网掩码字段。",
      "修正为 255.255.255.0 后重新测试。",
      "确认能 ping 网关、公共 IP 与域名。",
    ],
    takeaways: [
      "掩码定义了网络与主机位，错误的掩码会导致寻址混乱。",
      "排查时应优先验证网关连通。",
    ],
    pingTargets: [
      {
        name: "路由器网关",
        ip: "192.168.1.1",
        description: "修正掩码后应立即测试",
      },
      {
        name: "114.114.114.114",
        ip: "114.114.114.114",
        description: "验证外网连通",
      },
      {
        name: "baidu.com",
        ip: DOMAIN_IPS["baidu.com"],
        description: "检测 DNS",
      },
    ],
    domainMap: createDomainMap(["baidu.com", "bing.com", "jd.com"]),
    desktopTools: ["network", "terminal"],
    requiresSubnetMatchForGateway: true,
  },
  {
    id: 5,
    title: "练习 5｜DHCP 地址池耗尽",
    summary: "新设备接入后自动获取失败，需要扩大 DHCP 池或改为静态地址。",
    scenario:
      "实验室路由器地址池仅 192.168.1.2-192.168.1.5，新增电脑无法自动获取地址，老设备仍可上网。",
    objectives: [
      "识别 DHCP 地址池不足导致的 169.254.x.x 现象。",
      "通过调整路由器或静态配置恢复连通。",
      "再次验证公网连通性。",
    ],
    hints: [
      "可以在路由器将地址池扩大到 192.168.1.100-200。",
      "或直接给电脑手动分配一个未冲突的地址。",
      "修改后重新执行 ipconfig /all，确认租约信息。",
    ],
    initialNetwork: {
      ipAddress: "",
      subnetMask: "",
      gateway: "",
      dns: "",
    },
    initialRouter: {
      dhcpEnabled: true,
      lanGateway: "192.168.1.1",
      lanSubnetMask: "255.255.255.0",
      dhcpRangeStart: "192.168.1.2",
      dhcpRangeEnd: "192.168.1.5",
      dhcpDns: "114.114.114.114",
      wanConnected: true,
      wanIp: "100.64.1.6",
      wanGateway: "100.64.1.1",
    },
    initialModes: {
      ip: "auto",
      dns: "auto",
    },
    initialSetup: {
      router: [
        "LAN: 192.168.1.1/24",
        "DHCP 地址池过小，仅 192.168.1.2-5",
      ],
      computer: [
        "设置为自动获取，但迟迟拿不到地址",
        "最终落入 169.254.*.*",
      ],
    },
    allowedActions: [
      "在路由器扩大 DHCP 地址池",
      "或在电脑改为静态 192.168.1.x",
      "使用 ipconfig /renew 与 ping 验证",
    ],
    symptoms: [
      "ipconfig 显示 169.254.x.x",
      "ping 192.168.1.1 请求超时",
      "老电脑仍可访问外网",
    ],
    resolution: [
      "在终端确认 APIPA 地址。",
      "调整路由器地址池或手动配置 192.168.1.50。",
      "重新连接后验证网关与公网。",
    ],
    takeaways: [
      "地址池耗尽时，新设备会拿不到有效租约。",
      "扩大地址池或采用静态保留可快速解决。",
    ],
    pingTargets: [
      {
        name: "路由器网关",
        ip: "192.168.1.1",
        description: "确认恢复租约后应可互通",
      },
      {
        name: "114.114.114.114",
        ip: "114.114.114.114",
        description: "公共 DNS",
      },
      {
        name: "baidu.com",
        ip: DOMAIN_IPS["baidu.com"],
        description: "外网站点",
      },
    ],
    domainMap: createDomainMap(["baidu.com", "bing.com", "youku.com"]),
    desktopTools: ["router", "network", "terminal"],
    dhcpStatus: "pool-exhausted",
  },
  {
    id: 6,
    title: "练习 6｜静态 IP 冲突",
    summary: "两台电脑写成相同静态 IP，导致互相掉线与冲突提示。",
    scenario:
      "电脑 A 与电脑 B 都手动写成 192.168.1.50，网络时断时续并提示 IP 冲突，需要更换地址。",
    objectives: [
      "通过现象判断是否存在 IP 冲突。",
      "将其中一台改为自动获取或换成未占用地址。",
      "恢复稳定连通。",
    ],
    hints: [
      "冲突时 ping 会间歇超时，系统可能弹出气泡提示。",
      "改用 DHCP 或静态 192.168.1.60 即可解决。",
      "完成后可再次观察 ping 是否稳定。",
    ],
    initialNetwork: {
      ipAddress: "192.168.1.50",
      subnetMask: "255.255.255.0",
      gateway: "192.168.1.1",
      dns: "114.114.114.114",
    },
    initialRouter: {
      dhcpEnabled: true,
      lanGateway: "192.168.1.1",
      lanSubnetMask: "255.255.255.0",
      dhcpRangeStart: "192.168.1.100",
      dhcpRangeEnd: "192.168.1.200",
      dhcpDns: "114.114.114.114",
      wanConnected: true,
      wanIp: "100.64.1.7",
      wanGateway: "100.64.1.1",
    },
    initialSetup: {
      router: [
        "LAN: 192.168.1.1/24，DHCP 正常",
        "无特别限制",
      ],
      computer: [
        "静态 IP 192.168.1.50",
        "网络时断时续，提示“检测到 IP 地址冲突”",
      ],
    },
    allowedActions: [
      "改为自动获取 IP",
      "或手动更改为未使用的地址，如 192.168.1.60",
      "通过 ping 网关验证是否稳定",
    ],
    symptoms: [
      "ping 网关或外网间歇超时",
      "系统弹出 IP 冲突提醒",
      "同事设备也会掉线",
    ],
    resolution: [
      "确认当前 IP 与冲突提示。",
      "改为自动或换成不冲突的地址。",
      "持续 ping 网关，确认不再丢包。",
    ],
    takeaways: [
      "静态地址需规划管理，避免与他人重复。",
      "冲突通常表现为间歇丢包或系统气泡提示。",
    ],
    pingTargets: [
      {
        name: "路由器网关",
        ip: "192.168.1.1",
        description: "修复冲突后应稳定",
      },
      {
        name: "114.114.114.114",
        ip: "114.114.114.114",
        description: "用于确认外网",
      },
      {
        name: "bilibili.com",
        ip: DOMAIN_IPS["bilibili.com"],
        description: "示例域名",
      },
    ],
    domainMap: createDomainMap(["baidu.com", "bilibili.com", "qq.com"]),
    desktopTools: ["network", "terminal"],
    conflictingIp: "192.168.1.50",
  },
  {
    id: 7,
    title: "练习 7｜路由器 DNS 配置错误",
    summary: "路由器上游 DNS 写错导致全网域名解析失败，需在路由器修复或本机覆盖。",
    scenario:
      "校园网路由器的上游 DNS 被误写成 203.0.113.123，全班同学都无法打开域名，只能 ping 通外网 IP。",
    objectives: [
      "判断问题在于路由器 DNS。",
      "在路由器或电脑侧修正 DNS 设置。",
      "验证域名访问恢复。",
    ],
    hints: [
      "可将路由器 DNS 改为 114.114.114.114 / 223.5.5.5。",
      "临时应急可在本机手动填写公共 DNS。",
      "修改后需要重新获取租约或刷新 DNS 缓存。",
    ],
    initialNetwork: {
      ipAddress: "",
      subnetMask: "",
      gateway: "",
      dns: "",
    },
    initialRouter: {
      dhcpEnabled: true,
      lanGateway: "192.168.1.1",
      lanSubnetMask: "255.255.255.0",
      dhcpRangeStart: "192.168.1.100",
      dhcpRangeEnd: "192.168.1.200",
      dhcpDns: "203.0.113.123",
      wanConnected: true,
      wanIp: "100.64.1.8",
      wanGateway: "100.64.1.1",
    },
    initialModes: {
      ip: "auto",
      dns: "auto",
    },
    initialSetup: {
      router: [
        "LAN: 192.168.1.1/24，DHCP 正常",
        "上游 DNS 误设为 203.0.113.123",
      ],
      computer: [
        "自动获取到 192.168.1.x",
        "DNS 继承了错误的 203.0.113.123",
      ],
    },
    allowedActions: [
      "在路由器将 DNS 改为 114.114.114.114",
      "或在网卡手动覆盖 DNS",
      "通过 ping 域名验证",
    ],
    symptoms: [
      "ping 114.114.114.114 正常",
      "ping baidu.com 无法解析",
      "全网设备均出现相同问题",
    ],
    resolution: [
      "确认本机 DNS 为 203.0.113.123。",
      "在路由器或电脑侧改为可用 DNS。",
      "重新获取租约，验证域名解析。",
    ],
    takeaways: [
      "路由器 DNS 错误会影响整个局域网。",
      "可通过本机临时覆盖 DNS 进行快速恢复。",
    ],
    pingTargets: [
      {
        name: "路由器网关",
        ip: "192.168.1.1",
        description: "确保内网无异常",
      },
      {
        name: "114.114.114.114",
        ip: "114.114.114.114",
        description: "验证外网 IP",
      },
      {
        name: "baidu.com",
        ip: DOMAIN_IPS["baidu.com"],
        description: "域名测试",
      },
    ],
    domainMap: createDomainMap(["baidu.com", "bing.com", "taobao.com"]),
    desktopTools: ["router", "network", "terminal"],
  },
  {
    id: 8,
    title: "练习 8｜路由器 WAN 断网",
    summary: "路由器 WAN 口未上线，导致只能访问内网，无法访问外网。",
    scenario:
      "网关可以 ping 通，DNS 也看似正确，但 ping 外网 IP 仍然超时，怀疑路由器 WAN 口未接入。",
    objectives: [
      "区分内网故障与外网故障。",
      "通过路由器状态页确认 WAN 是否断开。",
      "能够向用户解释需要检查上联或联系运营商。",
    ],
    hints: [
      "若 WAN 未连接，再怎么改主机配置也无效。",
      "可在路由器界面查看 WAN 状态灯或拨号状态。",
      "课堂演示可提示“物理网线未插好”。",
    ],
    initialNetwork: {
      ipAddress: "",
      subnetMask: "",
      gateway: "",
      dns: "",
    },
    initialRouter: {
      dhcpEnabled: true,
      lanGateway: "192.168.1.1",
      lanSubnetMask: "255.255.255.0",
      dhcpRangeStart: "192.168.1.100",
      dhcpRangeEnd: "192.168.1.200",
      dhcpDns: "114.114.114.114",
      wanConnected: false,
      wanIp: undefined,
      wanGateway: undefined,
    },
    initialModes: {
      ip: "auto",
      dns: "auto",
    },
    initialSetup: {
      router: [
        "LAN: 192.168.1.1/24",
        "WAN 状态：未连接",
      ],
      computer: [
        "自动获取到 192.168.1.x",
        "DNS 为 114.114.114.114",
      ],
    },
    allowedActions: [
      "查看路由器 WAN 状态",
      "使用 ping 区分内外网",
      "记录问题并建议检查外线",
    ],
    symptoms: [
      "ping 192.168.1.1 正常",
      "ping 114.114.114.114 请求超时",
      "ping baidu.com 解析后仍然超时",
    ],
    resolution: [
      "确认内网连通正常。",
      "查看路由器 WAN 状态，发现未连接。",
      "告知需要检查上联线路或联系运营商。",
    ],
    takeaways: [
      "排查顺序：先看网关，再测外网 IP，最后看域名。",
      "WAN 未上线时，本地如何配置都无济于事。",
    ],
    pingTargets: [
      {
        name: "路由器网关",
        ip: "192.168.1.1",
        description: "确认内网",
      },
      {
        name: "114.114.114.114",
        ip: "114.114.114.114",
        description: "公共 DNS",
      },
      {
        name: "baidu.com",
        ip: DOMAIN_IPS["baidu.com"],
        description: "域名连通测试",
      },
    ],
    domainMap: createDomainMap(["baidu.com", "bing.com"]),
    desktopTools: ["router", "terminal"],
  },
  {
    id: 9,
    title: "练习 9｜LAN 网段调整后 DHCP 未同步",
    summary: "路由器 LAN 改为 192.168.10.1，但 DHCP 仍发 192.168.1.x，导致主机拿到错误网段。",
    scenario:
      "老师把路由器 LAN 改到 192.168.10.1/24，却忘了改 DHCP，学生电脑拿到 192.168.1.101，无法访问网关。",
    objectives: [
      "识别网关地址与主机地址不在同一网段的问题。",
      "在路由器同步调整 DHCP 配置或在电脑临时改网段。",
      "恢复与网关及外网的连通。",
    ],
    hints: [
      "LAN 改网段时要同时更新 DHCP 地址池。",
      "临时可手动改为 192.168.10.x 再登陆路由器。",
      "注意 DNS 也要同步到新的网关。",
    ],
    initialNetwork: {
      ipAddress: "192.168.1.101",
      subnetMask: "255.255.255.0",
      gateway: "192.168.1.1",
      dns: "192.168.1.1",
    },
    initialRouter: {
      dhcpEnabled: true,
      lanGateway: "192.168.10.1",
      lanSubnetMask: "255.255.255.0",
      dhcpRangeStart: "192.168.1.100",
      dhcpRangeEnd: "192.168.1.200",
      dhcpDns: "192.168.1.1",
      wanConnected: true,
      wanIp: "100.64.1.9",
      wanGateway: "100.64.1.1",
    },
    initialSetup: {
      router: [
        "LAN: 192.168.10.1/24",
        "DHCP 仍旧发放 192.168.1.x",
      ],
      computer: [
        "当前地址 192.168.1.101",
        "默认网关 192.168.1.1（实际不存在）",
      ],
    },
    allowedActions: [
      "在路由器同步修改 DHCP 地址池与网关",
      "或在电脑临时改为 192.168.10.x",
      "使用 ping 验证",
    ],
    symptoms: [
      "ping 192.168.10.1 不通",
      "ipconfig 显示网关 192.168.1.1",
      "ping baidu.com 超时",
    ],
    resolution: [
      "确认当前 IP 与路由器不在同一网段。",
      "调整 DHCP 或手动改为 192.168.10.20。",
      "恢复后再次测试网关与域名。",
    ],
    takeaways: [
      "改网段时必须同时调整 LAN IP、掩码与 DHCP。",
      "主机地址应与网关处于同一网段。",
    ],
    pingTargets: [
      {
        name: "新网关",
        ip: "192.168.10.1",
        description: "目标路由器地址",
      },
      {
        name: "114.114.114.114",
        ip: "114.114.114.114",
        description: "公共 DNS",
      },
      {
        name: "baidu.com",
        ip: DOMAIN_IPS["baidu.com"],
        description: "外网检测",
      },
    ],
    domainMap: createDomainMap(["baidu.com", "bing.com", "jd.com"]),
    desktopTools: ["router", "network", "terminal"],
  },
  {
    id: 10,
    title: "练习 10｜跨网段静态配置错误",
    summary: "路由器 LAN 改到 10.0.0.1/24，但电脑仍写 192.168.1.88，导致与网关不在同一网段。",
    scenario:
      "升级网络后路由器改为 10.0.0.1，学生电脑依旧保留旧的 192.168.1.88，怎么都 ping 不通网关。",
    objectives: [
      "判断电脑与网关不在同一网段。",
      "改写正确的 IP、掩码、网关与 DNS。",
      "验证恢复外网访问。",
    ],
    hints: [
      "新的网段为 10.0.0.0/24，网关 10.0.0.1。",
      "建议填写 10.0.0.10 作为演示地址。",
      "DNS 可继续使用 114.114.114.114。",
    ],
    initialNetwork: {
      ipAddress: "192.168.1.88",
      subnetMask: "255.255.255.0",
      gateway: "192.168.1.1",
      dns: "114.114.114.114",
    },
    initialRouter: {
      dhcpEnabled: false,
      lanGateway: "10.0.0.1",
      lanSubnetMask: "255.255.255.0",
      dhcpRangeStart: "10.0.0.100",
      dhcpRangeEnd: "10.0.0.200",
      dhcpDns: "114.114.114.114",
      wanConnected: true,
      wanIp: "100.64.1.10",
      wanGateway: "100.64.1.1",
    },
    initialSetup: {
      router: [
        "LAN: 10.0.0.1/24",
        "DHCP 暂未启用，需要静态配置",
      ],
      computer: [
        "仍旧写着 192.168.1.88",
        "网关为 192.168.1.1",
      ],
    },
    allowedActions: [
      "将电脑改为 10.0.0.10 / 255.255.255.0",
      "默认网关填 10.0.0.1，DNS 114.114.114.114",
      "使用 ping 验证",
    ],
    symptoms: [
      "ping 10.0.0.1 请求超时",
      "ipconfig 显示旧网段",
      "外网全部不可达",
    ],
    resolution: [
      "确认当前网段与路由器不一致。",
      "改写为 10.0.0.10 / 255.255.255.0 / 10.0.0.1。",
      "验证外网与域名恢复。",
    ],
    takeaways: [
      "网关与主机必须在同一网段才能互通。",
      "变更网段后要及时同步终端配置。",
    ],
    pingTargets: [
      {
        name: "路由器网关",
        ip: "10.0.0.1",
        description: "新的局域网出口",
      },
      {
        name: "114.114.114.114",
        ip: "114.114.114.114",
        description: "公共 DNS",
      },
      {
        name: "baidu.com",
        ip: DOMAIN_IPS["baidu.com"],
        description: "域名连通",
      },
    ],
    domainMap: createDomainMap(["baidu.com", "bing.com", "youku.com"]),
    desktopTools: ["network", "terminal"],
  },
];

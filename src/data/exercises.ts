import { ExerciseDefinition } from "@/types/network";

const DOMAIN_IPS = {
  "baidu.com": "39.156.66.14",
} as const;

const createDomainMap = (domains: (keyof typeof DOMAIN_IPS)[]) =>
  domains.reduce<Record<string, string>>((acc, key) => {
    acc[key] = DOMAIN_IPS[key];
    return acc;
  }, {});

export const exercises: ExerciseDefinition[] = [
  {
    id: 1,
    title: "练习 1｜网页完全打不开",
    summary: "办公室电脑突然打不开任何网页，请排查当前租约并用 ipconfig 确认网络是否恢复。",
    scenario:
      "一早到公司发现多台电脑的网页全都打不开。ipconfig 显示主机落在 169.254.x.x 的 APIPA 地址段，怀疑路由器的地址发放出现问题，需要你在面板上确认并排除。",
    verificationSteps: [
      "登录路由器检查并恢复正常的地址发放。",
      "运行 ipconfig，确认主机获取到 192.168.1.x 地址以及默认网关 192.168.1.1。",
    ],
    hints: [
      "169.254.x.x 代表主机没有拿到可用的 DHCP 租约。",
      "恢复地址分配后再执行 ipconfig 查看更新的网络配置。",
    ],
    initialNetwork: {
      ipAddress: "",
      subnetMask: "",
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
    desktopTools: ["router", "terminal"],
    domainMap: createDomainMap([]),
  },
  {
    id: 2,
    title: "练习 2｜局域网设备连不通",
    summary: "同事电脑无法访问局域网中的 192.168.1.5，请根据路由器提供的信息排查本机 IPv4 设置。",
    scenario:
      "路由器的 DHCP 按钮显示为灰色且无法启用，目前所有终端都处于 169.254.x.x 段。请先查看路由器的 LAN 配置信息，再在本机上手动填写 IPv4 地址、子网掩码和网关，让 ping 192.168.1.5 恢复正常。",
    verificationSteps: [
      "从路由器界面获取 LAN 网关及掩码信息。",
      "在网络适配器中改为静态地址并成功 ping 通 192.168.1.5。",
    ],
    hints: [
      "没有 DHCP 服务时需要手动写全 IP、掩码、网关。",
      "本地地址应与 192.168.1.5 位于同一网段，例如 192.168.1.10。",
    ],
    initialNetwork: {
      ipAddress: "",
      subnetMask: "",
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
      wanIp: "100.64.1.3",
      wanGateway: "100.64.1.1",
    },
    initialModes: {
      ip: "auto",
      dns: "auto",
    },
    desktopTools: ["router", "network", "terminal"],
    domainMap: createDomainMap([]),
    dhcpStatus: "unavailable",
  },
  {
    id: 3,
    title: "练习 3｜域名访问异常",
    summary: "局域网资源访问正常，但输入网址始终解析失败，请检查 DNS 配置并再次测试 ping baidu.com。",
    scenario:
      "用户反馈局域网共享盘、打印机都正常，但访问互联网总是提示无法解析域名。检查 ipconfig 发现 IP 和网关正确，只有 DNS 被手动填成了无效值，需要恢复为可用的公共 DNS。",
    verificationSteps: [
      "将 DNS 改为自动获取，或手动填写 114.114.114.114 / 223.5.5.5。",
      "执行 ping baidu.com，确认域名能够解析并连通。",
    ],
    hints: [
      "DNS 地址需要是合法的 IPv4。",
      "常见的公共 DNS 包括 114.114.114.114 和 223.5.5.5。",
    ],
    initialNetwork: {
      ipAddress: "192.168.1.101",
      subnetMask: "255.255.255.0",
      gateway: "192.168.1.1",
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
      wanIp: "100.64.1.4",
      wanGateway: "100.64.1.1",
    },
    initialModes: {
      ip: "auto",
      dns: "manual",
    },
    desktopTools: ["network", "terminal"],
    domainMap: createDomainMap(["baidu.com"]),
  },
  {
    id: 4,
    title: "练习 4｜网络时断时续",
    summary: "电脑经常断网并提示冲突，需要调整 IP 配置后再用 ping baidu.com 确认恢复。",
    scenario:
      "新加入网络的电脑手动写了 192.168.1.100，与其他设备冲突导致外网全部超时。请调整 IPv4 设置，避免冲突后再测试对 baidu.com 的连通性。",
    verificationSteps: [
      "将 IP 模式改为自动，或手动换成未被占用的地址。",
      "运行 ping baidu.com，确认冲突解除并且可以访问互联网。",
    ],
    hints: [
      "IP 冲突时 ping 会提示请求超时，并且同段其他设备也无法通信。",
      "改成自动获取即可让 DHCP 分配一个新的可用地址。",
    ],
    initialNetwork: {
      ipAddress: "192.168.1.100",
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
      wanIp: "100.64.1.5",
      wanGateway: "100.64.1.1",
    },
    initialModes: {
      ip: "manual",
      dns: "manual",
    },
    desktopTools: ["network", "terminal"],
    domainMap: createDomainMap(["baidu.com"]),
    conflictingIp: "192.168.1.100",
  },
  {
    id: 5,
    title: "练习 5｜局域网时好时坏",
    summary: "办公电脑偶尔能访问内网但很快又断，需要检查子网掩码是否填写正确。",
    scenario:
      "同事反馈只能偶尔访问共享服务器，ping 默认网关 192.168.1.1 时时通时不通。检查发现电脑手动配置的子网掩码写成了 B 类格式，导致广播域错误。请修正掩码后再次测试连通性。",
    verificationSteps: [
      "打开网络适配器，将子网掩码改为 255.255.255.0。",
      "执行 ping 192.168.1.1，确认网关稳定连通。",
    ],
    hints: [
      "与 192.168.1.x 同网段时掩码应为 255.255.255.0。",
      "掩码过大或过小都会造成广播域不匹配。",
    ],
    initialNetwork: {
      ipAddress: "192.168.1.120",
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
      wanIp: "100.64.1.6",
      wanGateway: "100.64.1.1",
    },
    initialModes: {
      ip: "manual",
      dns: "manual",
    },
    desktopTools: ["network", "terminal"],
    domainMap: createDomainMap([]),
  },
  {
    id: 6,
    title: "练习 6｜外网彻底中断",
    summary: "全公司都无法访问互联网，需要在路由器里排查 WAN 连接状态并恢复。",
    scenario:
      "暴风雨后所有电脑都无法访问外网，但局域网共享资源正常。登录路由器发现 WAN 口掉线，需要重新拨号/连接让 baidu.com 可以被访问。",
    verificationSteps: [
      "在路由器界面检查 WAN 状态并恢复连接。",
      "执行 ping baidu.com，确认外网恢复。",
    ],
    hints: [
      "WAN 状态显示未连接时，需要重新发起连接。",
      "恢复后可以在路由器状态页看到新的公网地址。",
    ],
    initialNetwork: {
      ipAddress: "192.168.1.110",
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
      wanConnected: false,
    },
    initialModes: {
      ip: "auto",
      dns: "auto",
    },
    desktopTools: ["router", "terminal"],
    domainMap: createDomainMap(["baidu.com"]),
  },
];

import { ExerciseDefinition } from "@/types/network";

export const exercises: ExerciseDefinition[] = [
  {
    id: 1,
    title: "练习 1：自动私有 IP (APIPA)",
    summary: "模拟 DHCP 故障导致的 APIPA 地址，需要手动设置正确的网络参数。",
    scenario:
      "实验室内多台电脑无法连通局域网。执行 ipconfig 显示网卡被分配了 169.254.x.x 的地址，说明 DHCP 服务器不可用或网络配置异常。",
    objectives: [
      "确认当前主机的 IP 地址与子网掩码状态。",
      "判断问题是否来自 DHCP，手动设置静态 IP。",
      "验证与网关和公网的连通性。",
    ],
    hints: [
      "APIPA 地址段（169.254.x.x）无法访问互联网。",
      "请为电脑配置 192.168.1.x 网段的静态 IP。",
      "设置默认网关为 192.168.1.1，并确认 DNS 正确。",
    ],
    initialNetwork: {
      ipAddress: "169.254.45.12",
      subnetMask: "255.255.0.0",
      gateway: "",
      dns: "",
    },
    initialRouter: {
      dhcpEnabled: false,
    },
  },
  {
    id: 2,
    title: "练习 2：缺失默认网关",
    summary: "网络参数几乎正确，但默认网关为空，导致无法访问互联网。",
    scenario:
      "用户报告可以访问同一局域网中的共享打印机，但 Bing.com 无法打开。检查网络配置后发现默认网关为空。",
    objectives: [
      "使用 ipconfig 查看当前网络配置并定位问题。",
      "补全默认网关配置，确保能够访问外网。",
      "通过 ping 命令验证内外网连通性。",
    ],
    hints: [
      "目标网关为 192.168.1.1。",
      "补全网关后先 ping 8.8.8.8，再尝试域名。",
      "如果域名仍失败，检查 DNS 设置。",
    ],
    initialNetwork: {
      ipAddress: "192.168.1.42",
      subnetMask: "255.255.255.0",
      gateway: "",
      dns: "8.8.8.8",
    },
    initialRouter: {
      dhcpEnabled: true,
    },
  },
  {
    id: 3,
    title: "练习 3：DNS 配置错误",
    summary: "IP 与网关正确，但 DNS 输入了内网无效地址，导致域名解析失败。",
    scenario:
      "新入职员工手动配置网络后可以 ping 通 192.168.1.1，却无法解析任何域名。怀疑 DNS 设置有问题。",
    objectives: [
      "确认当前 DNS 配置情况。",
      "替换为公共 DNS（例如 8.8.8.8 或 1.1.1.1）。",
      "通过 nslookup 与 ping <domain> 验证结果。",
    ],
    hints: [
      "先使用 nslookup 检查目前的 DNS 服务器。",
      "改为常见公共 DNS：8.8.8.8。",
      "修改后再次 ping 域名确认恢复正常。",
    ],
    initialNetwork: {
      ipAddress: "192.168.1.88",
      subnetMask: "255.255.255.0",
      gateway: "192.168.1.1",
      dns: "123.123.123.123",
    },
    initialRouter: {
      dhcpEnabled: true,
    },
  },
];

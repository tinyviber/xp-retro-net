import { NetworkSettings } from "@/types/network";

const IPV4_REGEX =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

const PUBLIC_DNS = new Set(["8.8.8.8", "1.1.1.1", "114.114.114.114", "223.5.5.5"]);

const DOMAIN_IP_MAP: Record<string, string> = {
  "baidu.com": "39.156.66.14",
  "bing.com": "204.79.197.200",
  "example.com": "93.184.216.34",
  "google.com": "142.250.72.14",
};

const ipToInt = (ip: string) =>
  ip.split(".").reduce((acc, part) => (acc << 8) + Number(part), 0);

const inSameSubnet = (ipA: string, ipB: string, mask: string) => {
  if (![ipA, ipB, mask].every((value) => IPV4_REGEX.test(value))) {
    return false;
  }

  const maskInt = ipToInt(mask);
  return (ipToInt(ipA) & maskInt) === (ipToInt(ipB) & maskInt);
};

const hasValidGateway = (gateway: string) => IPV4_REGEX.test(gateway);

const isPublicDns = (dns: string) => PUBLIC_DNS.has(dns);

const formatIpConfig = (config: NetworkSettings) => {
  const { ipAddress, subnetMask, gateway, dns } = config;
  return [
    "Windows IP 配置",
    "",
    "以太网适配器 本地连接:",
    `   IP 地址 . . . . . . . . . . . . : ${ipAddress || "未分配"}`,
    `   子网掩码 . . . . . . . . . . . : ${subnetMask || "未配置"}`,
    `   默认网关. . . . . . . . . . . . : ${gateway || "未配置"}`,
    `   DNS 服务器  . . . . . . . . . . : ${dns || "未配置"}`,
  ].join("\n");
};

const formatPingSuccess = (target: string, displayIp: string) => {
  const header =
    displayIp === target
      ? `正在 Ping ${target} 具有 32 字节的数据:`
      : `正在 Ping ${target} [${displayIp}] 具有 32 字节的数据:`;

  const reply = `来自 ${displayIp} 的回复: 字节=32 时间<1ms TTL=128`;
  return [header, reply, reply, reply, reply, "", "Ping 统计信息:", "    已发送 = 4，已接收 = 4，丢失 = 0 (0% 丢失)"].join(
    "\n"
  );
};

const formatPingTimeout = (target: string) => {
  const header = `正在 Ping ${target} 具有 32 字节的数据:`;
  return [
    header,
    "请求超时。",
    "请求超时。",
    "请求超时。",
    "请求超时。",
    "",
    "Ping 统计信息:",
    "    已发送 = 4，已接收 = 0，丢失 = 4 (100% 丢失)",
  ].join("\n");
};

const formatNslookupSuccess = (domain: string, dns: string) => {
  const resolvedIp = DOMAIN_IP_MAP[domain] ?? "93.184.216.34";
  return [
    `服务器:  ${dns === "8.8.8.8" ? "google-public-dns-a.google.com" : "公共 DNS 服务器"}`,
    `Address:  ${dns}`,
    "",
    "非权威应答:",
    `名称:    ${domain}`,
    `Address:  ${resolvedIp}`,
  ].join("\n");
};

const formatNslookupFailure = (domain: string, dns: string) => {
  const dnsDisplay = dns || "0.0.0.0";
  return [
    "服务器:  UnKnown",
    `Address:  ${dnsDisplay}`,
    "",
    `*** UnKnown 找不到 ${domain}: Non-existent domain`,
  ].join("\n");
};

const handlePing = (args: string[], config: NetworkSettings) => {
  if (args.length === 0) {
    return "用法: ping <目标地址>";
  }

  const target = args[0].toLowerCase();
  const { ipAddress, subnetMask, gateway, dns } = config;
  const isIpTarget = IPV4_REGEX.test(target);

  if (!isIpTarget) {
    if (!isPublicDns(dns) || !hasValidGateway(gateway)) {
      return `Ping 请求找不到主机 ${target}。请检查该名称并重试。`;
    }

    const resolvedIp = DOMAIN_IP_MAP[target] ?? "93.184.216.34";
    return formatPingSuccess(target, resolvedIp);
  }

  if (inSameSubnet(ipAddress, target, subnetMask)) {
    return formatPingSuccess(target, target);
  }

  if (!hasValidGateway(gateway)) {
    return formatPingTimeout(target);
  }

  if (!isPublicDns(dns) && !inSameSubnet(gateway, target, subnetMask)) {
    return formatPingTimeout(target);
  }

  return formatPingSuccess(target, target);
};

const handleNslookup = (args: string[], config: NetworkSettings) => {
  if (args.length === 0) {
    return "用法: nslookup <域名>";
  }

  const domain = args[0].toLowerCase();
  const { dns } = config;

  if (!isPublicDns(dns)) {
    return formatNslookupFailure(domain, dns);
  }

  return formatNslookupSuccess(domain, dns);
};

export const executeVirtualCommand = (command: string, config: NetworkSettings) => {
  const trimmed = command.trim();

  if (!trimmed) {
    return "";
  }

  const [rawCommand, ...args] = trimmed.split(/\s+/);
  const normalized = rawCommand.toLowerCase();

  switch (normalized) {
    case "ipconfig":
      return formatIpConfig(config);
    case "ping":
      return handlePing(args, config);
    case "nslookup":
      return handleNslookup(args, config);
    default:
      return `'${rawCommand}' 不是内部或外部命令，也不是可运行的程序\n或批处理文件。`;
  }
};

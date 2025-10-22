export type AssignmentMode = "auto" | "manual";

export interface NetworkSettings {
  ipAddress: string;
  subnetMask: string;
  gateway: string;
  dns: string;
}

export interface NetworkAdapterConfig extends NetworkSettings {
  ipMode: AssignmentMode;
  dnsMode: AssignmentMode;
}

export interface RouterSettings {
  dhcpEnabled: boolean;
  lanGateway: string;
  lanSubnetMask: string;
  dhcpRangeStart: string;
  dhcpRangeEnd: string;
  dhcpDns: string;
  wanConnected: boolean;
  wanIp?: string;
  wanGateway?: string;
}

export type DesktopTool = "router" | "network" | "terminal";

export interface PingTarget {
  name: string;
  ip: string;
  description?: string;
}

export type DhcpStatus = "normal" | "unavailable" | "pool-exhausted";

export interface ExerciseDefinition {
  id: number;
  title: string;
  summary: string;
  scenario: string;
  objectives: string[];
  hints: string[];
  initialNetwork: NetworkSettings;
  initialRouter: RouterSettings;
  initialModes?: {
    ip: AssignmentMode;
    dns: AssignmentMode;
  };
  initialSetup: {
    router: string[];
    computer: string[];
  };
  allowedActions: string[];
  symptoms: string[];
  resolution: string[];
  verificationSteps: string[];
  takeaways: string[];
  pingTargets: PingTarget[];
  domainMap: Record<string, string>;
  desktopTools: DesktopTool[];
  dhcpStatus?: DhcpStatus;
  requiresSubnetMatchForGateway?: boolean;
  conflictingIp?: string;
}

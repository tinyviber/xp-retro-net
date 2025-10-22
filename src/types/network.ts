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
}

export interface ExerciseDefinition {
  id: number;
  title: string;
  summary: string;
  scenario: string;
  objectives: string[];
  hints: string[];
  initialNetwork: NetworkSettings;
  initialRouter: RouterSettings;
}

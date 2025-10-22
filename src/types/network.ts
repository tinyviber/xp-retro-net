export interface NetworkSettings {
  ipAddress: string;
  subnetMask: string;
  gateway: string;
  dns: string;
}

export interface ExerciseDefinition {
  id: number;
  title: string;
  summary: string;
  scenario: string;
  objectives: string[];
  hints: string[];
  initialNetwork: NetworkSettings;
}

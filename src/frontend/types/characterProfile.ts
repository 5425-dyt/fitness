export interface CharacterIdentity {
  id: string;
  identityLock: boolean;
  appearance: Record<string, string>;
  faceGeometry: Record<string, string>;
  hair: Record<string, string>;
  eyes?: Record<string, string>;
  nose?: Record<string, string>;
  mouth?: Record<string, string>;
  jaw?: Record<string, string>;
  skin: Record<string, string>;
  body: Record<string, string>;
  voice: Record<string, string>;
  temperament: Record<string, string>;
  style: Record<string, string>;
  signatureFeatures: string[];
  negativeFeatures: string[];
  embedding: string;
  seed: number;
  loraId: string;
  createdAt: string;
}

export interface CharacterProfileRecord {
  character_id: string;
  character: CharacterIdentity;
}

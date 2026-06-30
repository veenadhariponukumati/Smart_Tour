import { Result, ok, err } from "@/lib/types/result";

// --- Types ---

export interface LockProvisionRequest {
  unitId: number;
  leadId: number;
  scheduledAt: Date;
}

export interface AccessCredential {
  accessCode: string;
  validFrom: Date;
  validUntil: Date;
}

// --- Lock Provider Interface ---

export interface LockProvider {
  provisionAccess(unitId: number, code: string, validFrom: Date, validUntil: Date): Promise<Result<void>>;
  revokeAccess(unitId: number, code: string): Promise<Result<void>>;
}

// --- Mock Lock Provider ---

export class MockLockProvider implements LockProvider {
  private activeCodes = new Map<string, { unitId: number; validUntil: Date }>();

  async provisionAccess(
    unitId: number,
    code: string,
    validFrom: Date,
    validUntil: Date
  ): Promise<Result<void>> {
    const now = new Date();
    if (validUntil <= now) {
      return err(new Error("Access code expiration must be in the future"));
    }
    if (this.activeCodes.has(code)) {
      return err(new Error("Access code already in use"));
    }

    this.activeCodes.set(code, { unitId, validUntil });
    console.log(`[MockLockProvider] Provisioned code ${code} for unit ${unitId} (valid until ${validUntil.toISOString()})`);
    return ok(undefined);
  }

  async revokeAccess(unitId: number, code: string): Promise<Result<void>> {
    const entry = this.activeCodes.get(code);
    if (!entry || entry.unitId !== unitId) {
      return err(new Error("Access code not found for this unit"));
    }

    this.activeCodes.delete(code);
    console.log(`[MockLockProvider] Revoked code ${code} for unit ${unitId}`);
    return ok(undefined);
  }
}

// --- Access Provisioning Service ---

export class AccessProvisioningService {
  private lockProvider: LockProvider;

  constructor(lockProvider: LockProvider = new MockLockProvider()) {
    this.lockProvider = lockProvider;
  }

  async provisionForTour(request: LockProvisionRequest): Promise<Result<AccessCredential>> {
    try {
      const code = this.generateAccessCode();
      const validFrom = new Date(request.scheduledAt);
      validFrom.setMinutes(validFrom.getMinutes() - 15); // 15 min grace before
      const validUntil = new Date(request.scheduledAt);
      validUntil.setHours(validUntil.getHours() + 2); // 2 hour window

      const result = await this.lockProvider.provisionAccess(
        request.unitId,
        code,
        validFrom,
        validUntil
      );

      if (!result.ok) {
        return err(result.error);
      }

      return ok({
        accessCode: code,
        validFrom,
        validUntil,
      });
    } catch (e) {
      return err(e instanceof Error ? e : new Error("Failed to provision access"));
    }
  }

  async revokeAccess(unitId: number, accessCode: string): Promise<Result<void>> {
    return this.lockProvider.revokeAccess(unitId, accessCode);
  }

  private generateAccessCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
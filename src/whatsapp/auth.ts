import { chmodSync, cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import { getWhatsAppAuthBackupDir, getWhatsAppAuthDir } from "./paths.ts";

function setPermissionsRecursive(targetPath: string): void {
  if (!existsSync(targetPath)) {
    return;
  }

  const stats = statSync(targetPath);
  const mode = stats.isDirectory() ? 0o700 : 0o600;
  chmodSync(targetPath, mode);

  if (stats.isDirectory()) {
    for (const entry of readdirSync(targetPath)) {
      setPermissionsRecursive(path.join(targetPath, entry));
    }
  }
}

export function ensureAuthDirectories(): void {
  mkdirSync(getWhatsAppAuthDir(), { recursive: true, mode: 0o700 });
  mkdirSync(getWhatsAppAuthBackupDir(), { recursive: true, mode: 0o700 });
  setPermissionsRecursive(getWhatsAppAuthDir());
  setPermissionsRecursive(getWhatsAppAuthBackupDir());
}

export function hasStoredAuthState(): boolean {
  const authDir = getWhatsAppAuthDir();
  if (!existsSync(authDir)) {
    return false;
  }

  return readdirSync(authDir).some((entry) => !entry.startsWith("."));
}

export function backupAuthState(): void {
  const authDir = getWhatsAppAuthDir();
  const backupDir = getWhatsAppAuthBackupDir();
  ensureAuthDirectories();

  if (!existsSync(authDir) || readdirSync(authDir).length === 0) {
    return;
  }

  rmSync(backupDir, { recursive: true, force: true });
  cpSync(authDir, backupDir, { recursive: true, force: true });
  setPermissionsRecursive(backupDir);
}

export function restoreAuthStateBackup(): boolean {
  const authDir = getWhatsAppAuthDir();
  const backupDir = getWhatsAppAuthBackupDir();
  if (!existsSync(backupDir) || readdirSync(backupDir).length === 0) {
    return false;
  }

  rmSync(authDir, { recursive: true, force: true });
  cpSync(backupDir, authDir, { recursive: true, force: true });
  setPermissionsRecursive(authDir);
  return true;
}

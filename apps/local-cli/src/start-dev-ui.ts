import { startUiDev, type UiDevHost } from '@buildautomaton/app-host/node';
import type { ParsedCli } from './parse-cli.js';
import { writeInfo } from './log.js';

export async function startDevUi(parsed: ParsedCli): Promise<UiDevHost | undefined> {
  if (parsed.mode !== 'app' || parsed.env !== 'dev') return undefined;
  const ui = await startUiDev({ apiPort: parsed.mcpPort, port: parsed.uiPort });
  writeInfo(`[CLI] UI dev ${ui.url}`);
  return ui;
}

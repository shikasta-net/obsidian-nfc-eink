import {
  Notice,
  Plugin,
} from 'obsidian';
import {unified} from 'unified';
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse';
import DOMPurify from 'dompurify';
import domtoimage from 'dom-to-image-more';
import {
  DEFAULT_SETTINGS,
  NfcEinkPluginSettings,
  NfcEinkSettingsTab,
} from './settings';

async function exportActiveNote(plugin: Plugin) {
  const file = plugin.app.workspace.getActiveFile();
  if (!file || !['md', 'markdown'].includes(file.extension)) {
    new Notice("No active file");
    return;
  }
  const markdown = await plugin.app.vault.cachedRead(file);
  const html = DOMPurify.sanitize(String(await unified()
  .use(remarkParse)
  .use(remarkHtml)
  .process(markdown)), {RETURN_DOM: true});
  await domtoimage.toPng(html).then(async function (blob) {
    await navigator.clipboard.writeText(blob);
  });
  if ("NDEFReader" in window) {
    try {
      const ndef = new NDEFReader();
      await ndef.scan();
      new Notice("> Scan started");

      ndef.addEventListener("readingerror", () => {
        new Notice("Argh! Cannot read data from the NFC tag. Try another one?");
      });

      ndef.addEventListener("reading", (event) => {
        const  { serialNumber }  = event as NDEFReadingEvent;
        new Notice(`> Serial Number: ${serialNumber}`);
      });
    } catch (error) {
      new Notice("Argh! " + error);
    }
  } else {
    new Notice("Web NFC is not available. Use Chrome on Android.");
  }
}

export default class NfcEinkPlugin extends Plugin {
  settings!: NfcEinkPluginSettings;

  async onload() {
    await this.loadSettings();

    this.addRibbonIcon('smartphone-nfc', 'Send to NFC', () => void exportActiveNote(this));

    this.addSettingTab(new NfcEinkSettingsTab(this.app, this));
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      (await this.loadData()) as Partial<NfcEinkPluginSettings>,
    );
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

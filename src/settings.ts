import {
  PluginSettingTab,
  Setting,
  type App,
} from 'obsidian';
import NfcEinkPlugin from './main';
import { Display, displays, Orientation, } from './displays';

export interface NfcEinkPluginSettings {
  display: Display;
  password: string;
  orientation: Orientation;
}

export const DEFAULT_SETTINGS: NfcEinkPluginSettings = {
  display: displays[Object.keys(displays)[0]!]!,
  password: "",
  orientation: Orientation.LANDSCAPE,
};

export class NfcEinkSettingsTab extends PluginSettingTab {
  plugin: NfcEinkPlugin;

  constructor(app: App, plugin: NfcEinkPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Select display model')
      .addDropdown((dropdown) => {
        dropdown.addOptions(
          Object.entries(displays).reduce((acc, [key, value]) => {
            return {...acc, [key]: value.name};
          }, {} as Record<string,string>)
        ).setValue(
          Object.keys(displays).find(key => displays[key] === this.plugin.settings.display)!
        ).onChange(async (value) => {
          this.plugin.settings.display = displays[value]!;
          await this.plugin.saveSettings();
        })
      });

    new Setting(containerEl)
      .setName('Display\'s password')
      .addText((text) =>
        text
          .setPlaceholder(this.plugin.settings.display.default_password)
          .setValue(this.plugin.settings.password)
          .onChange(async (value) => {
            this.plugin.settings.password = value;
            await this.plugin.saveSettings();
          }),
      );


    new Setting(containerEl)
      .setName('Orientation')
      .addDropdown((dropdown) => {
        dropdown.addOptions(
          Object.entries(Orientation).reduce((acc, [key, value]) => {
            return {...acc, [key]: value};
          }, {} as Record<string,string>)
        ).setValue(
          this.plugin.settings.orientation.valueOf()
         ).onChange(async (value) => {
          this.plugin.settings.orientation = value as Orientation;
          await this.plugin.saveSettings();
        })
      });
  }
}

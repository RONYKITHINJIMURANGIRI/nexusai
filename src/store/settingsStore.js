const settingsStore = {
  theme: 'dark',
  language: 'en',
  setTheme(theme) {
    this.theme = theme;
  },
  setLanguage(language) {
    this.language = language;
  },
};

export default settingsStore;

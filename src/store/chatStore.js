const chatStore = {
  messages: [],
  addMessage(message) {
    this.messages.push(message);
  },
  clear() {
    this.messages = [];
  },
};

export default chatStore;

class MailProvider {
  // TODO: this can hold request queues and pop and process will be the ideal setup
  constructor() {
    this.queue = [];
  }

  sendMail() {
    // interface method to be implemented in subclass
  }
}

module.exports = MailProvider;

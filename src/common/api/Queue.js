class Queue {
  constructor(...callbacks) {
    this.callbacks = callbacks;
    this.tasks = [];
  }

  /**
   * Get task
   *
   * @param {Function} callback
   *
   * @return {Function}
   */
  getTask(callback) {
    const task = (...parameters) => {
      callback(...parameters);
      this.resolveTask(task);
    };

    this.tasks.push(task);

    return task;
  }

  /**
   * Resolve task
   *
   * @param {Function} task
   */
  resolveTask(task) {
    const index = this.tasks.indexOf(task);

    if (index !== -1) {
      this.tasks.splice(index, 1);
    }

    if (!this.isBusy()) {
      this.callbacks.forEach(callback => callback());
    }
  }

  /**
   * Is the synchronizer active?
   *
   * @return {Boolean}
   */
  isBusy() {
    return this.tasks.length > 0;
  }
}

export default Queue;

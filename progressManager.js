const fs = require('fs');
const path = require('path');

const PROGRESS_FILE = path.join(__dirname, 'progress.json');

class ProgressManager {
  constructor() {
    this.loadProgress();
  }

  loadProgress() {
    try {
      if (fs.existsSync(PROGRESS_FILE)) {
        const data = fs.readFileSync(PROGRESS_FILE, 'utf8');
        this.progress = JSON.parse(data);
      } else {
        this.progress = {};
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      this.progress = {};
    }
  }

  saveProgress() {
    try {
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify(this.progress, null, 2));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  getUserProgress(userId) {
    return this.progress[userId] || { currentStep: 'N1-01', quizAttempts: {} };
  }

  setUserProgress(userId, step) {
    if (!this.progress[userId]) {
      this.progress[userId] = { currentStep: step, quizAttempts: {}, completedN1: false };
    } else {
      this.progress[userId].currentStep = step;
    }
    this.saveProgress();
  }

  markN1Complete(userId) {
    if (!this.progress[userId]) {
      this.progress[userId] = { currentStep: 'N1-01', quizAttempts: {}, completedN1: true };
    } else {
      this.progress[userId].completedN1 = true;
    }
    this.saveProgress();
  }

  hasCompletedN1(userId) {
    return this.progress[userId]?.completedN1 || false;
  }

  recordQuizAttempt(userId, quizId, passed) {
    if (!this.progress[userId]) {
      this.progress[userId] = { currentStep: 'N0-01', quizAttempts: {} };
    }
    if (!this.progress[userId].quizAttempts[quizId]) {
      this.progress[userId].quizAttempts[quizId] = [];
    }
    this.progress[userId].quizAttempts[quizId].push({
      timestamp: new Date().toISOString(),
      passed,
    });
    this.saveProgress();
  }

  resetUserProgress(userId) {
    delete this.progress[userId];
    this.saveProgress();
  }

  getAllUsers() {
    return Object.keys(this.progress);
  }
}

module.exports = new ProgressManager();


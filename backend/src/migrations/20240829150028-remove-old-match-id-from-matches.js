'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Matches', 'old_matchId');
  },

  down: async (queryInterface, Sequelize) => {
  }
};

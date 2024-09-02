'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, if the column already contains data, you might need to cast it to text to avoid issues.
    // We will rename the column temporarily to avoid conflicts.
    await queryInterface.renameColumn('Matches', 'matchId', 'old_matchId');

    // Add the new column with the desired type
    await queryInterface.addColumn('Matches', 'matchId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // Copy the data from the old column to the new column, converting types as needed
    await queryInterface.sequelize.query(
      'UPDATE "Matches" SET "matchId" = "old_matchId"::integer'
    );

    // Drop the old column
    await queryInterface.removeColumn('Matches', 'old_matchId');
  },

  down: async (queryInterface, Sequelize) => {
    // Reverse the migration: add the old column and convert back
    await queryInterface.addColumn('Matches', 'old_matchId', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    // Copy the data back to the old column
    await queryInterface.sequelize.query(
      'UPDATE "Matches" SET "old_matchId" = "matchId"::timestamp'
    );

    // Drop the new column
    await queryInterface.removeColumn('Matches', 'matchId');

    // Rename the old column back to the original name
    await queryInterface.renameColumn('Matches', 'old_matchId', 'matchId');
  }
};

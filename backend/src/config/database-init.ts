import sequelize from './database';
import User from '../models/user';
import Trade from '../models/trade';

export const initializeDatabase = async () => {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync models with database
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');

    // Set up relationships
    User.hasMany(Trade, {
      sourceKey: 'user_id',
      foreignKey: 'user_id',
      as: 'trades'
    });

    Trade.belongsTo(User, {
      targetKey: 'user_id',
      foreignKey: 'user_id',
      as: 'user'
    });

  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}; 
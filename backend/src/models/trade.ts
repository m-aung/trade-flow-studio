import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './user';

interface TradeAttributes {
  trade_id: string;
  user_id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  executed_at?: Date;
}

interface TradeCreationAttributes extends Omit<TradeAttributes, 'trade_id'> {}

class Trade extends Model<TradeAttributes, TradeCreationAttributes> {
  declare trade_id: string;
  declare user_id: string;
  declare symbol: string;
  declare type: 'BUY' | 'SELL';
  declare quantity: number;
  declare price: number;
  declare status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  declare executed_at?: Date;
}

Trade.init(
  {
    trade_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id'
      }
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('BUY', 'SELL'),
      allowNull: false
    },
    quantity: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'COMPLETED', 'CANCELLED'),
      defaultValue: 'PENDING'
    },
    executed_at: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    modelName: 'Trade',
    timestamps: true
  }
);

export default Trade; 
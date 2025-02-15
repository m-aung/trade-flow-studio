import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

interface UserAttributes {
  user_id: string;
  email: string;
  password_hash: string;
  role: string;
  first_name?: string;
  last_name?: string;
  status: string;
}

interface UserCreationAttributes extends Omit<UserAttributes, 'user_id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare user_id: string;
  declare email: string;
  declare password_hash: string;
  declare role: string;
  declare first_name?: string;
  declare last_name?: string;
  declare status: string;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }
}

User.init(
  {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active'
    }
  },
  {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password_hash) {
          user.password_hash = await bcrypt.hash(user.password_hash, 10);
        }
      }
    }
  }
);

export default User; 
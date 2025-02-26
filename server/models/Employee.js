import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Employee = sequelize.define('Employee', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        unique: true
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

export default Employee;
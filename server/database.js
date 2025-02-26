import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',
        logging: console.log,
    }
);

// Definición de modelos con Sequelize
const Client = sequelize.define('Client', {
    vehiclePlate: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    phoneNumber: { type: DataTypes.STRING, allowNull: false },
    hasSubscription: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: false });

const Subscription = sequelize.define('Subscription', {
    clientId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Client, key: 'id' } },
    subscriptionType: { type: DataTypes.STRING, allowNull: false },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false }
}, { timestamps: false });

const GateRegistry = sequelize.define('GateRegistry', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    gate: { 
        type: DataTypes.INTEGER,
        allowNull: false 
    },
    vehiclePlate: { 
        type: DataTypes.STRING(255), 
        allowNull: false 
    },
    entry_date_time: { 
        type: DataTypes.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    exit_date_time: { 
        type: DataTypes.DATE, 
        allowNull: true 
    },
    client_id: { 
        type: DataTypes.INTEGER, 
        allowNull: true, 
        references: { model: Client, key: 'id' }, 
        onDelete: 'SET NULL'
    },
    amount: { 
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00 
    }
}, { 
    tableName: "gateRegistry",
    timestamps: false 
});


const Employee = sequelize.define('Employee', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.STRING, allowNull: false },
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: false });

// Relaciones
Client.hasMany(Subscription, { foreignKey: 'client_id' });
Client.hasMany(GateRegistry, { foreignKey: 'client_id' });

// Funciones CRUD con Sequelize
export async function registerEntry(gate, vehiclePlate, clientId) {
    const entry = await GateRegistry.create({ gate, vehiclePlate, clientId });
    return entry.id;
}

export async function registerExit(registryId, amount) {
    await GateRegistry.update(
        { exit_date_time: new Date(), amount },
        { where: { id: registryId, exit_date_time: null } }
    );
}

export async function getGateRegisterByID(id) {
    return await GateRegistry.findByPk(id);
}

export async function getAllGateRegisters() {
    try {
        const result = await GateRegistry.findAll();
        console.log("GateRegistry result:", result);
        return result;
    } catch (error) {
        console.error("Error en getAllGateRegisters:", error);
        throw error; 
    }
}

export async function addClient(vehiclePlate, name, email, phoneNumber, hasSubscription) {
    const client = await Client.create({ vehiclePlate, name, email, phoneNumber, hasSubscription });
    return client.id;
}

export async function updateClient(id, name, email, phoneNumber, hasSubscription) {
    await Client.update({ name, email, phoneNumber, hasSubscription }, { where: { id } });
}

export async function deleteClient(id) {
    await Client.destroy({ where: { id } });
}

export async function addSubscription(clientId, subscriptionType, startDate, endDate) {
    const subscription = await Subscription.create({ clientId, subscriptionType, startDate, endDate });
    return subscription.id;
}

export async function deleteSubscription(id) {
    await Subscription.destroy({ where: { id } });
}

export async function addEmployee(name, email, password, phoneNumber, isAdmin) {
    const employee = await Employee.create({ name, email, password, phoneNumber, isAdmin });
    return employee.id;
}

export async function getEmployeeByEmail(email) {
    return await Employee.findOne({ where: { email } });
}

export default sequelize;

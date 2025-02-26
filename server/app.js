import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // Importa fileURLToPath
import { dirname } from 'path'; //Importa dirname
import sequelize from "./database.js";
import authRoutes from './routes/auth.routes.js';
import {
    registerEntry,
    registerExit,
    getGateRegisterByID,
    addClient,
    addEmployee,
    getAllGateRegisters
} from "./database.js";
import { body } from "express-validator";

const __filename = fileURLToPath(import.meta.url); // Obtiene la ruta del archivo actual
const __dirname = dirname(__filename); // Obtiene el directorio del archivo actual

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

const corsOptions = {
    origin: "*",
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.options('*', (req, res) => {
    res.status(200).send();
});

// Endpoints para el registro de entradas y salidas
app.post("/gateRegistry/entry", async (req, res) => {
    try {
        const { gate, vehiclePlate, clientId } = req.body;
        const entryId = await registerEntry(gate, vehiclePlate, clientId);
        res.status(201).send({ message: "Entrada registrada", entryId });
    } catch (error) {
        res.status(500).send({ error: "Error registrando la entrada" });
    }
});

app.put("/gateRegistry/exit/:id", async (req, res) => {
    try {
        const { amount } = req.body;
        await registerExit(req.params.id, amount);
        res.status(200).send({ message: "Salida registrada" });
    } catch (error) {
        res.status(500).send({ error: "Error registrando la salida" });
    }
});

app.get("/gateRegistry/:id", async (req, res) => {
    try {
        const gateRegister = await getGateRegisterByID(req.params.id);
        res.status(200).send(gateRegister);
    } catch (error) {
        res.status(500).send({ error: "Error obteniendo el registro" });
    }
});

app.get("/gateRegistry", async (req, res) => {
    try {
        const gateRegistry = await getAllGateRegisters();
        res.status(200).json(gateRegistry);
    } catch (error) {
        res.status(500).send({ error: "Error obteniendo registros" });
    }
});

// Endpoints para la gestión de clientes
app.post("/clients", async (req, res) => {
    try {
        const { vehiclePlate, name, email, phoneNumber, hasSubscription } = req.body;
        const clientId = await addClient(vehiclePlate, name, email, phoneNumber, hasSubscription);
        res.status(201).send({ message: "Cliente agregado", clientId });
    } catch (error) {
        res.status(500).send({ error: "Error agregando cliente" });
    }
});

// Endpoints para la gestión de empleados
app.post("/employees", async (req, res) => {
    try {
        const { name, email, password, phoneNumber, isAdmin } = req.body;
        const employeeId = await addEmployee(name, email, password, phoneNumber, isAdmin);
        res.status(201).send({ message: "Empleado registrado", employeeId });
    } catch (error) {
        res.status(500).send({ error: "Error registrando empleado" });
    }
});

// Carga las rutas de autenticación
app.use('/', authRoutes);

// Sincronizar Sequelize y arrancar el servidor
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("Conexión a la base de datos establecida");

        await sequelize.sync();
        console.log("Modelos sincronizados");

        const port = process.env.PORT || 8080 || 8081;
        app.listen(port, () => console.log(`Servidor en puerto ${port}`));
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
    }
}

startServer();
import express from "express";
import cors from "cors";
// Importar SQL Queries:
import {
    registerEntry,
    registerExit,
    getGateRegisterByID,
    addClient,
    updateClient,
    deleteClient,
    addSubscription,
    deleteSubscription,
    addEmployee,
    getEmployeeByEmail,
    getAllGateRegisters
} from "./database.js";

const app = express();
app.use(express.json());

/*
SOBRE CORS:
-----------------------------------------------------------------------------------------------------------
Cors es un middleware para controlar de dónde provienen las peticiones y qué se puede hacer con ellas en función de su procedencia.
------------------------------------------------------------------------------------------------------------
*/
const corsOptions = {
    origin: "*",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
};
app.use(cors(corsOptions));

// Endpoints para el registro de entradas y salidas
app.post("/gateRegistry/entry", async (req, res) => {
    const { gate, vehiclePlate, clientId } = req.body;
    const entryId = await registerEntry(gate, vehiclePlate, clientId);
    res.status(201).send({ message: "Entrada registrada", entryId });
});

app.put("/gateRegistry/exit/:id", async (req, res) => {
    const { amount } = req.body;
    await registerExit(req.params.id, amount);
    res.status(200).send({ message: "Salida registrada" });
});

app.get("/gateRegistry/:id", async (req, res) => {
    const gateRegister = await getGateRegisterByID(req.params.id);
    res.status(200).send(gateRegister);
});

app.get("/gateRegistry", async (req, res) => {
    const gateRegistry = await getAllGateRegisters();
    console.log("Datos enviados al cliente:", gateRegistry);
    res.status(200).json(gateRegistry);
});



// Endpoints para la gestión de clientes
app.post("/clients", async (req, res) => {
    const { vehiclePlate, name, email, phoneNumber, hasSubscription } = req.body;
    const clientId = await addClient(vehiclePlate, name, email, phoneNumber, hasSubscription);
    res.status(201).send({ message: "Cliente agregado", clientId });
});

app.put("/clients/:id", async (req, res) => {
    const { name, email, phoneNumber, hasSubscription } = req.body;
    await updateClient(req.params.id, name, email, phoneNumber, hasSubscription);
    res.status(200).send({ message: "Cliente actualizado" });
});

app.delete("/clients/:id", async (req, res) => {
    await deleteClient(req.params.id);
    res.status(200).send({ message: "Cliente eliminado" });
});

// Endpoints para la gestión de suscripciones
app.post("/subscriptions", async (req, res) => {
    const { clientId, subscriptionType, startDate, endDate } = req.body;
    const subscriptionId = await addSubscription(clientId, subscriptionType, startDate, endDate);
    res.status(201).send({ message: "Suscripción añadida", subscriptionId });
});

app.delete("/subscriptions/:id", async (req, res) => {
    await deleteSubscription(req.params.id);
    res.status(200).send({ message: "Suscripción eliminada" });
});

// Endpoints para la gestión de empleados
app.post("/employees", async (req, res) => {
    const { name, email, password, phoneNumber, isAdmin } = req.body;
    const employeeId = await addEmployee(name, email, password, phoneNumber, isAdmin);
    res.status(201).send({ message: "Empleado registrado", employeeId });
});

app.get("/employees/:email", async (req, res) => {
    const employee = await getEmployeeByEmail(req.params.email);
    res.status(200).send(employee);
});

app.listen(8080, () => {
    console.log("Servidor ejecutándose en el puerto 8080 | Server running on port 8080");
});

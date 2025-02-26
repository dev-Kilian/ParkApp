import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js';

export const register = async (req, res) => {
    const { name, email, password, phone_number} = req.body;
    const is_admin = req.body.is_admin ?? false; // Si no se envía, asigna false

    try {
        console.log("Contraseña sin hashear:", password); // Log adicional
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Contraseña hasheada:", hashedPassword); // Log adicional

        await Employee.create({
            name,
            email,
            password: hashedPassword,
            phone_number,
            is_admin
        });

        res.status(201).json({ message: 'Empleado registrado correctamente' });
    } catch (error) {
        console.error("Error al registrar empleado:", error);
        res.status(400).json({ error: 'Error al registrar empleado' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const employee = await Employee.findOne({ where: { email } });
        if (!employee) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        console.log("Comparación de contraseñas:", isMatch); // Log adicional
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const token = jwt.sign(
            { id: employee.id, email: employee.email, is_admin: employee.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};
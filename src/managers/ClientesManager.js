import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_FILE_PATH = path.join(__dirname, '../data/clientes.json');

class ClientesManager {
    constructor(filePath = DEFAULT_FILE_PATH) {
        this.filePath = path.resolve(filePath);
        this.clientes = this.loadClientes();
    }

    loadClientes() {
        if (!fs.existsSync(this.filePath)) {
            this.ensureDataDirectory();
            const initialClientes = this.getInitialClientes();
            this.saveClientes(initialClientes);
            return initialClientes;
        }

        try {
            const raw = fs.readFileSync(this.filePath, 'utf-8');
            const parsed = JSON.parse(raw);

            if (!Array.isArray(parsed)) {
                throw new Error('El contenido de clientes debe ser un arreglo');
            }

            return parsed;
        } catch (error) {
            if (error.code === 'ENOENT') {
                const initialClientes = this.getInitialClientes();
                this.saveClientes(initialClientes);
                return initialClientes;
            }

            throw new Error(`No se pudo cargar los clientes: ${error.message}`);
        }
    }

    ensureDataDirectory() {
        const directory = path.dirname(this.filePath);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }

    getInitialClientes() {
        return [
            {
                id: 'cli-1',
                nombre: 'Juan Perez',
                telefono: '5551234',
                correo: 'juan@example.com'
            }
        ];
    }

    saveClientes(clientes = this.clientes) {
        fs.writeFileSync(this.filePath, JSON.stringify(clientes, null, 2), 'utf-8');
    }

    validateClienteData(payload, isUpdate = false) {
        if (typeof payload !== 'object' || payload === null) {
            throw new Error('Los datos del cliente deben ser un objeto');
        }

        if ('id' in payload) {
            throw new Error('No se puede modificar el id del cliente');
        }

        const allowedKeys = ['nombre', 'telefono', 'correo'];
        const keys = Object.keys(payload);

        if (keys.length === 0) {
            throw new Error('No hay datos validos para procesar');
        }

        for (const key of keys) {
            if (!allowedKeys.includes(key)) {
                throw new Error(`Propiedad invalida del cliente: ${key}`);
            }
        }

        const validateString = (field, value) => {
            if (typeof value !== 'string' || !value.trim()) {
                throw new Error(`El campo ${field} es obligatorio`);
            }
        };

        if (!isUpdate || 'nombre' in payload) validateString('nombre', payload.nombre);
        if (!isUpdate || 'telefono' in payload) validateString('telefono', payload.telefono);
        if (!isUpdate || 'correo' in payload) validateString('correo', payload.correo);

        if ((!isUpdate || 'correo' in payload) && !payload.correo.includes('@')) {
            throw new Error('El correo debe tener un formato valido');
        }
    }

    getClientes() {
        return [...this.clientes];
    }

    getClienteById(id) {
        return this.clientes.find((cliente) => cliente.id === id) || null;
    }

    createCliente(payload) {
        this.validateClienteData(payload);

        const nuevoCliente = {
            id: `cli-${Date.now()}`,
            nombre: payload.nombre.trim(),
            telefono: payload.telefono.trim(),
            correo: payload.correo.trim()
        };

        this.clientes.push(nuevoCliente);
        this.saveClientes();
        return nuevoCliente;
    }

    updateCliente(id, payload) {
        const cliente = this.getClienteById(id);
        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }

        this.validateClienteData(payload, true);

        if ('nombre' in payload) cliente.nombre = payload.nombre.trim();
        if ('telefono' in payload) cliente.telefono = payload.telefono.trim();
        if ('correo' in payload) cliente.correo = payload.correo.trim();

        this.saveClientes();
        return cliente;
    }

    deleteCliente(id) {
        const index = this.clientes.findIndex((cliente) => cliente.id === id);
        if (index === -1) {
            throw new Error('Cliente no encontrado');
        }

        const [deleted] = this.clientes.splice(index, 1);
        this.saveClientes();
        return { id: deleted.id };
    }
}

export default ClientesManager;

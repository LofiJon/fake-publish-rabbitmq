const Modbus = require('modbus-serial');
const server = new Modbus.ServerTCP({
    // Os buffers são definidos aqui, mas serão gerenciados separadamente
    holding: Buffer.alloc(10000), // Registros de retenção
    coils: Buffer.alloc(10000)    // Bobinas
}, {
    host: "192.168.69.111",
    port: 502,
    debug: true,
    unitID: 1
});

server.on('connection', (client) => {
    console.log('Cliente conectado:', client.remoteAddress);
});

server.on('error', (err) => {
    console.error('Erro no servidor Modbus:', err);
});

// Criar e gerenciar os buffers separadamente
let holdingRegisterBuffer = Buffer.alloc(10000);
let coilsBuffer = Buffer.alloc(10000);

// Preencher os buffers com dados de teste
for (let i = 0; i < holdingRegisterBuffer.length; i += 2) {
    holdingRegisterBuffer.writeUInt16BE(0, i); // Substitua 0 pelo valor desejado
}

for (let i = 0; i < coilsBuffer.length; i++) {
    coilsBuffer[i] = true; // Define todas as bobinas como verdadeiras
}

// Handler para leitura de bobinas
server.on('readCoils', function (request, reply) {
    let start = request.address;
    let quantity = request.quantity;
    let coilData = coilsBuffer.slice(start, start + quantity);
    reply(null, coilData);
});

// Handler para leitura de registros de retenção
server.on('readHoldingRegisters', function (request, reply) {
    let start = request.address;
    let quantity = request.quantity;
    let registerData = Buffer.alloc(quantity * 2);
    holdingRegisterBuffer.copy(registerData, 0, start * 2, (start + quantity) * 2);
    reply(null, registerData);
});

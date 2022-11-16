const TicketControl = require('../models/ticket-control');
const ticketControl = new TicketControl();

//nte . Controlador Set.
const socketController = (socket) => {
    //mtd . Aca se declaran las emisiones y canales de eventos que se pueden recibir.
    
    socket.emit( 'ultimo-ticket', ticketControl.ultimo );
    
    // este canal, lado del server, recibe el pulso para crear un t, y retornar el numero.
    socket.on('siguiente-ticket', ( payload, callback ) => {
        const siguiente = ticketControl.siguiente();
        callback(siguiente);
    });
    socket.on('atender-ticket', ({escritorio}, callback) => {
        console.log(payload);
    })

}

module.exports = {
    socketController
}


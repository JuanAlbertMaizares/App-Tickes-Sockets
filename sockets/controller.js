const TicketControl = require('../models/ticket-control');
const ticketControl = new TicketControl();

//nte . Controlador Set.
const socketController = (socket) => {
    //mtd . Aca se declaran las emisiones y canales de eventos que se pueden recibir.
    // Emisiones a clientes que se conectan.
    socket.emit( 'ultimo-ticket', ticketControl.ultimo );
    socket.emit( 'estado-actual', ticketControl.ultimos4 );
    socket.emit( 'tickets-pendientes', ticketControl.tickets.length );
    
    // este canal, lado del server, recibe el pulso para crear un t, y retornar el numero.
    socket.on('siguiente-ticket', ( payload, callback ) => {
        const siguiente = ticketControl.siguiente();
        callback(siguiente);
        socket.broadcast.emit( 'tickets-pendientes', ticketControl.tickets.length );

    });
    // canal de evento para atender ticket
    // recibe paramentros: el escritorio y una f
    socket.on('atender-ticket', ({escritorio}, callback) => {
        if (!escritorio) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }
        const ticket = ticketControl.atenderTicket(escritorio);

        socket.broadcast.emit( 'estado-actual', ticketControl.ultimos4 );
        socket.emit( 'tickets-pendientes', ticketControl.tickets.length );
        socket.broadcast.emit( 'tickets-pendientes', ticketControl.tickets.length );

        if (!ticket) {
            callback({
                ok:false,
                msg: 'Ya no hay tickets pendientes'
            });
        } else {
            callback({
                ok:true,
                ticket
            })
        }

    })

}

module.exports = {
    socketController
}


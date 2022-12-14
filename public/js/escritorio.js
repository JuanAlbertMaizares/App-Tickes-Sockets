const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.getElementById('cliente');
const divAlerta = document.getElementById('infoAlert');
const lblPendientes = document.querySelector('#lblPendientes');
//
const searchParams = new URLSearchParams( window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');

}
const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;
divAlerta.style.display = 'none';
const socket = io();




//tkt . Declaracion de canales de eventos.
socket.on('connect', () => {
    btnAtender.disabled=false;
});

socket.on('disconnect', () => {
    btnAtender.disabled=true;
});
socket.on('tickets-pendientes', (pendientes)=>{
    if (pendientes === 0) {
        lblPendientes.style.display = 'none';
    } else {
        lblPendientes.style.display = '';
        lblPendientes.innerText = pendientes;
    }
})
socket.on('ultimo-ticket', (ultimo) => {
    // lblNuevoTicket.innerText = 'Ticket' + ultimo; 
})

btnAtender.addEventListener( 'click', () => {
    // se emite señal de evento al canal: atender ticket. Mandamos
    // el param escritorio en url
    // el payload es el objeto que tiene la f anonima que es usada en el server
    socket.emit('atender-ticket', {escritorio}, ({ok, ticket, msg}) => {
        if (!ok) {
            return divAlerta.style.display = '';
        }
        lblTicket.innerText = 'Ticket' + ticket.numero;
    });
    
    
});
//tkt . Fin Declaración de canales de eventos.
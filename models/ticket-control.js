// path, para contruir el path donde grabamos los datos
const path = require('path');
const fs = require('fs');
//nte . CLASS Ticket Item.
class Ticket{
    constructor(numero, escritorio){
        this.numero = numero;
        this.escritorio = escritorio;
    }
}
//nte . CLASS Ticket Set.
class TicketControl {
    constructor(){
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];

        this.init();
    }
    //mtd este metodo es cuando se llama a la clase y su metodo toJson, retorna este objeto
    get toJson(){
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4,
        }
    }
    //mtd . el metodo que sirve para inicializar, no contruir sino inicializar.
    init(){
        // Podemos leer de un json y, js, lo transforma en objeto literal
        const {hoy, tickets, ultimo, ultimos4} = require('../db/data.json');
        if ( hoy === this.hoy ) {
            this.tickets = tickets;
            this.ultimo =ultimo;
            this.ultimos4 =ultimos4;
        }else{
            this.guardarDB();
        }
    }
    // mtd. 
    guardarDB(){
        const dbPath = path.join(__dirname, '../db/data.json');
        fs.writeFileSync( dbPath, JSON.stringify(this.toJson));
        
    }
    
    // mtd 
    siguiente(){
        this.ultimo += 1;
        const ticket = new Ticket( this.ultimo, null);
        this.tickets.push(ticket);
        console.log(this.tickets);
        this.guardarDB();
        return 'Ticket' + ticket.numero;
    }
    // mtd 
    atenderTicket(escritorio){
        if (this.tickets.length === 0 ) {
            return null;
        }
        const ticket = this.tickets.shift(); //retorna el primero y lo elimina del arreglo
        ticket.escritorio = escritorio;
        this.ultimos4.unshift(ticket);
        if (this.ultimos4.length > 4 ) {
            this.ultimos4.splice(-1,1);
        }
        this.guardarDB();
        return ticket;
    }

}

module.exports = TicketControl;
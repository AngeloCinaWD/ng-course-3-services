import { Injectable } from "@angular/core";

// un service è caratterizzato dal decorator @Injectable, questo permette al nostro service di essere iniettato nel nostro componente tramite Dependency Injection nel costruttore della classe
// la proprietà providedIn con valore root indica che verrà creata una sola istanza della classe per l'intero progetto e può essere iniettata ed utilizzata ovunque, pattern di programmazione ad oggetti Singleton: una classe viene istanziata una sola volta e può essere utilizzata globalmente
// questa cosa la posso confermare andando ad iniettare il service in più componenti e mettendo qui nel costruttore un console.log, in console troverò solo un console.log anche se ho iniettato il service in più componenti, proprio perchè il service viene istanziato una sola volta ed in tutti i componenti viene iniettata la stessa classe
@Injectable({
  providedIn: "root",
})
export class CoursesService {
  constructor() {}
}

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { COURSES } from "../db-data";
import { Course } from "./model/course";
import { CourseCardComponent } from "./course-card/course-card.component";
import { HighlightedDirective } from "./directives/highlighted.directive";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  // SERVICES, i services ci consentono di creare metodi riutilizzabili nel progetto, ad esempio interrogare un DB ed ottenere dati da utilizzare
  // per utilizzare un service mi basta iniettarlo nel costruttore della classe dove mi serve utilizzarlo

  // i corsi non li prendo più direttamente dal file db-data, ma li definerò tramite chiamata get http
  // courses = COURSES;
  courses;

  // HTTP NG SERVICE, per fetchare dati da un DB
  // per utilizzare un servive va dichiarato un riferimento ad esso e NG saprà, quando istanzia questa classe, che deve fornire questa dipendenza
  // definisco una proprietà private http di tipo HttpClient
  constructor(private http: HttpClient) {}

  // questo Lyfecycle Hook viene chiamato dopo il costruttore, quindi la variabile http sarà disponibile
  ngOnInit() {
    // chiamata GET tramite http service, si passa l'url da fetchare, restituisce un observable
    // quindi va effettuata un'iscrizione per ottenere i dati, tramite il metodo subscribe() che ci restituisce il valore restituito dalla chiamata GET
    // assegnamo il valore ricevuto alla variabile courses
    // this.http.get("/api/courses").subscribe((valore) => {
    //   console.log(valore);
    //   this.courses = valore;
    // });

    // per aggiungere query params all'url che vogliamo fetchare, utilizziamo la classe HttpParams e settiamo i parametri chiave valore che vogliamo passare
    const params = new HttpParams().set("page", "1").set("pageSize", "10");

    // non è possibile settare parametri dalla classe istanziata, perchè la proprietà updates, dove vengono messi i parametri è privata e non accessibile dall'esterno

    // params.set() non funziona

    // i parametri li passiamo in un oggetto come secondo argomento della chiamata GET, che ha diverse proprietà tra le quali params
    // se controllo in console l'url che viene chiamato, vedo che ci saranno i query params: http://localhost:63311/api/courses?page=1&pageSize=10
    this.http.get("/api/courses", { params: params }).subscribe((valore) => {
      console.log(valore);
      this.courses = valore;
    });
  }
}

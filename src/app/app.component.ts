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
  courses: Course[];

  // ASYNC PIPE, pipe che ci permette di sottoscrivere un osservabile direttamente dal template, in modo da avere componenti più reattivi
  // la variabile courses indicata come sopra è una variabile mutabile, non ha un tipo, potrebbe ricevere qualsiasi cosa
  // per farla diventare immutabile la rinominiamo in courses$, il dollaro alla fine è una convenzione per indicare che si tratta di un osservable
  // la tipizziamo come un Observable<Course[]> cioè un osservabile che restituisce un array di oggetti Course
  courses$: Observable<Course[]>;

  // HTTP NG SERVICE, per fetchare dati da un DB
  // per utilizzare un servive va dichiarato un riferimento ad esso e NG saprà, quando istanzia questa classe, che deve fornire questa dipendenza
  // definisco una proprietà private http di tipo HttpClient
  constructor(private http: HttpClient) {}

  // questo Lyfecycle Hook viene chiamato dopo il costruttore, quindi la variabile http sarà disponibile
  ngOnInit() {
    // chiamata GET tramite http service, si passa l'url da fetchare, restituisce un observable
    // quindi va effettuata un'iscrizione per ottenere i dati, tramite il metodo subscribe() che ci restituisce i dati contenuti nell'Observable restituito dalla chiamata GET
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
    // se non tipizzo il get, cioè tipizzo cosa ricevo, il type di valore sarà Object e non potrei assegnarlo alla proprietà this.courses che è un array di Course
    this.http
      .get<Course[]>("/api/courses", { params: params })
      .subscribe((valore) => {
        console.log(valore);
        this.courses = valore;
      });

    // per passare dati alla proprietà courses$, che è un osservabile, non devo più utilizzare il metodo subscribe()
    // devo assegnarle il risultato della chiamata GET, chè è un osservable
    this.courses$ = this.http.get<Course[]>("/api/courses", { params: params });
    // la variabile courses$ è quindi un obeservable e la sottoscriveremo nel template tramite il pipe ASYNC
    // quando si lavora recuperando dati da Observables è buona prassi utilizzare l'async pipe perchè questo si occuperà di annullare la sottoscrizione all'observable nel momento in cui un componente viene distrutto, utile per prevenire perdite di memoria
  }
}

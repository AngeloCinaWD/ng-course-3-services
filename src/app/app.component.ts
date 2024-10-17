import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  InjectionToken,
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
import { CoursesService } from "./services/courses.service";

// COSTRUZIONE DI UN PROVIDER, funzione che viene chiamata dal sistema di dependency injection di ng per iniettare le dipendenze
// questa funzione restituisce un'istanza della classe CoursesService, ne richiama il costruttore tramite keyword new e gli passa tutto ciò di cui ha bisogno. Nel caso di un'istanza CoursesService si ha bisogno del service HttpClient di ng
function coursesServiceProvider(http: HttpClient): CoursesService {
  return new CoursesService(http);
}
// per utilizzare il provider creato devo registrarlo nella classe, nella proprietà del decoratore providers, passandolo in un oggetto di configurazione ed indicandolo con un nome univoco, detto Token univoco di iniezione, InjectionToken
// creo l'injection token, l'identificatore univoco della dipendenza, ogni dipendenza ha il suo token
// il tipo del token sarà il service per il quale lo creo, un CoursesService
// va passato un parametro stringa che indichi il nome univoco
// in caso volessi iniettare il service in un altro componente indico il token come esportabile, ad esempio nel course-card.component
export const COURSES_SERVICE = new InjectionToken<CoursesService>(
  "COURSES_SERVICE"
);

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  // una volta creato il token, va configurato il provider
  // si indica cosa viene fornito tramite un oggetto di configurazione per ogni provider, proprietà provide: token(non è uuna stringa), e useFactory: nome funzione di factory
  // proprietà deps, dependencies, indichiamo tutte le dipendenze necessarie alla creazione dell'istanza del service, in questo caso l'HttpClient
  // stiamo informando ng di come creare la dependency per questo service
  // providers: [
  //   {
  //     provide: COURSES_SERVICE,
  //     useFactory: coursesServiceProvider,
  //     deps: [HttpClient],
  //   },
  // ],
  // esiste una forma più semplice per creare il provider di un service, utilizzando il nome della classe (perchè è univoco) e utilizzando la classe come factory, ng chimerà il costruttore della classe e gli passerà tutte le dipendenze necessarie, la proprietà non è useFactory ma useClass
  // providers: [
  //   {
  //     provide: CoursesService,
  //     useClass: CoursesService,
  //   },
  // ],
  // ancora più semplificato è passando nei providers direttamente il nome della classe, ng sa che dovrà utilizzare il nome della classe come identificatore univoco del provider e per la factory va a chiamare il costruttore della classe
  // providers: [CoursesService],
  // in questo modo non dobbiamo utilizzare più il decoratore @Inject() perchè questo ha bisogno che venga indicato il token di iniezione
  // in questo modo utilizzo il provider solo all'interno del componente, per utilizzarlo in tutta l'app o lo registro nei providers di app.module.ts oppure utilizzo la proprietà providedIn: "root" nel decoratore @Injectable() direttamente nel service
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

  coursesService$: Observable<Course[]>;

  // HTTP NG SERVICE, per fetchare dati da un DB
  // per utilizzare un servive va dichiarato un riferimento ad esso e NG saprà, quando istanzia questa classe, che deve fornire questa dipendenza
  // definisco una proprietà private http di tipo HttpClient
  // CUSTOM SERVICE, inietto nel componente il service creato da me
  constructor(
    private http: HttpClient,
    private coursesService: CoursesService
  ) {}

  // inietto il service CoursesService utilizzando il provider creato da me
  // devo utilizzare il decoratore @Inject(nome_token) per indicare a quale provider ng si deve rifare per creare la dipendenza
  // constructor(
  //   @Inject(COURSES_SERVICE) private coursesService: CoursesService,
  //   private http: HttpClient
  // ) {}

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

    // Creare un SERVICE ANGULAR CUSTOM
    // runnare il comando ng generate service services/courses, in questo modo creo un service con classe CoursesService nella cartella /src/app/services
    // assegno il valore alla variabile coursesService$ richiamando il metodo loadCourses() del service CoursesService
    this.coursesService$ = this.coursesService.loadCourses();
  }

  onCourseChanged(course: Course) {
    // il metodo put dell'httpclient restituisce un observable quindi bisogna utilizzare il metodo subscribe() per farlo funzionare
    // il put restituisce un observable con un oggetto Course, quello modificato
    this.coursesService
      .saveCourse(course)
      .subscribe((value) => console.log(value.description));
  }
}


//creo la funzione per cambiare scermata ed andare alla home page nascondendo la welcome page e facendo apparire la home page
function passaAllaHomePage() {
    let nascondiWelcomePage = document.getElementById('welcomePage')
    nascondiWelcomePage.style.display = 'none'

    let appareHomePage = document.getElementById('homePage')
    appareHomePage.style.display = 'block'
}

//funzione che attiva al pagina della guida
function guide() {

    let nascondiHomePage = document.getElementById('homePage')
    nascondiHomePage.style.display = 'none'

    let appareGuidePage = document.getElementById('guidePage')
    appareGuidePage.style.display = 'block'
}

//funzione per tornare alla WelcomePage
function tornaAllaWelcomePage() {
    let nascondiWelcomePage = document.getElementById('guidePage')
    nascondiWelcomePage.style.display = 'none'

    let appareGuidePage = document.getElementById('homePage')
    appareGuidePage.style.display = 'block'
}


//creo la funzione per aggiungere le sezioni
function addSections() {

    // chiedo all'utente di  inserire un intestazione da dare alla sezione
    let secgliNomeSezione = prompt("inserisci nome da dare alla sezione")

    //terza condizione (diventata la prima, perche se la inserisco dopo avere dato toLOwerCase si crea un conflitto), mi occupo di gestire il click di 'annulla' dell'utente nel prompt
    if(secgliNomeSezione === null) {
        return;
    }
    
    //dichiaro una seconda variabile per uniformare il testo
    let labelToLowerCase = secgliNomeSezione.toLowerCase()

    //effettuo un controllo, se la sezione che crea esiste gia allora appare un messaggio e non puo crearla.
    if(labelToLowerCase in sezioni) {
        alert('Sezione già presente, prova ad organizzarti un pò meglio ;)')
        return;
    }

    //effetuo un altro controllo per accertarmi che l utente non possa creare una sezione vuota
    if(secgliNomeSezione === '') {
        alert('Se crei una sezione senza intestazione poi come fai a ricordare cosa c\' è dentro?')
        return;
    }


    //METTO LA SEZIONE CREATA NELL OGGETTO SEZIONI
    sezioni[labelToLowerCase] = []  
    console.log(sezioni)

    //salvo la sezione creata nel local storage
    localStorage.setItem('sezioni', JSON.stringify(sezioni));

    //creo la sezione con div esterno e paragrafo dentro
    let divSezioni = document.createElement('div')
    divSezioni.classList.add('section')
    
    let paragraph = document.createElement('p')

    // dico alla sezione che il contenuto, o meglio al paragrafo dentro la sezione, deve essere ciò che l utente scrive nel prompt
    paragraph.textContent = secgliNomeSezione
    


    //inserisco uno dentro l altro i vari elementi
    divSezioni.appendChild(paragraph)

    //metto tutto all interno del (DOM (body)) <- NO PERCHE SUCCEDE CHE CREANDO LE SEZIONI NUOVE ALL'INTERNO DI ESSE SI VEDA LA SEZIONE STESSA CREATA. Quindi le nuove le metto dentro la homePage cosi siamo alla pace
    document.getElementById('containerSezioni').appendChild(divSezioni)


    //affinche anche tutte le sezione create abbiano le stesse proprieta delle 3 di presenti di default, aggiungo i listener dei press, click, touch ecc direttamente nella funzioine che le crea
    divSezioni.addEventListener('mousedown', modificaElimina)
    divSezioni.addEventListener('touchstart', modificaElimina)
    divSezioni.addEventListener('mouseup', deletePress)
    divSezioni.addEventListener('mouseleave', deletePress)
    divSezioni.addEventListener('touchend', deletePress)
    divSezioni.addEventListener('touchcancel', deletePress)

    //aggiungo anche il click per attivare il meccaniscmo che mi porta alla dettagliSezione
    divSezioni.addEventListener('click', accediAllaSezione)

    aggiornaMessaggioSezioni();
    
}

// Funzione per mostrare o nascondere il messaggio "Nessuna sezione presente"
function aggiornaMessaggioSezioni() {
    const sezioniPresenti = document.querySelectorAll('.section').length; // classe corretta
    const messaggio = document.getElementById('messaggio'); // esiste nel tuo HTML con display: none iniziale

    if (sezioniPresenti === 0) {
        messaggio.style.display = 'block';
    } else {
        messaggio.style.display = 'none';
    }
}


// al tener premuto dei una sezione accade qualcosa

//siccome querySlectorAll restituisce una nodelist la devo iterare dicendo con forEach che per ogni div , al tocco (premuto e rilasciato), fa qualcosa
//modificaElimina sarà la funzione che farà apparire il tasto modifica ed elimina e al click di uno dei due deve succede qualcosa.


let timer = null;
let sezioneCorrente = null;

// la funzione modificaElimina si attiva quando tiene premuto su una sezione
function modificaElimina(event) {
    const sezione = event.currentTarget; //la sezione su cui sto premendo
    timer = setTimeout(() => {
        //settimao un timer entro il quale deve succedere qualcosa: --> attiva funzione per mostrare la modale
        sezioneCorrente = sezione; //salvo la sezione corrente
        mostraModale()
    }, 900);
}

function deletePress() {
    clearTimeout(timer)
}

// funzione per mostrare la modale che prende dal DOM l intera struttura della modale e con display block la fa apparire
function mostraModale() {
    let mostraModale = document.getElementById('modal')
    mostraModale.style.display = 'block'
}

//funzione per chiudere la modale che si attiva quando si clicca la X dentro la modale
function chiudiModale() {
    let nascondoModale = document.getElementById('modal')
    nascondoModale.style.display = 'none'
}


//funzione per eliminare la sezione corrente
function eliminaSection() {
    if(sezioneCorrente) { // se sezione corrente === true (cioè sezione selezionata tramite la modificaElimina) allora la rimuoviamo, chiudiamo la modale e riaggiorniamo per sicurezza la sezioneCorrente
        sezioneCorrente.remove();

        //riga di codice per eliminare la sezione corrente
        const nomeKey = sezioneCorrente.querySelector('p').textContent.toLowerCase();
        delete sezioni[nomeKey];

        //aggiorno il local storage
        localStorage.setItem('sezioni', JSON.stringify(sezioni));

        chiudiModale()
        sezioneCorrente = null;

        aggiornaMessaggioSezioni();
    }
}

//funzione per rinominare la sezione corrente
function modificaSezione() {
    let sceltaNomeSezione = prompt('Inserisci il nome da dare alla sezione') //sceglie il nome tramite prompt
    if (sceltaNomeSezione === null) { //se clicca su annulla, nel prompt, allora chiudiamo la modale
        chiudiModale()
    } else { // altrimenti sezioneCorrente scava nel p specifico e poi con textContent mettiamo ciò che l'utente inserisce nel prompt
        const paragrafo = sezioneCorrente.querySelector('p')
        paragrafo.textContent = sceltaNomeSezione;
        chiudiModale()
    }
}



//var globale per la sezione scelta
let nomeSezioneAttiva = null;

//funzione per cliccare sulla sezione scelta ed accedere a quella specifica sezione
function accediAllaSezione(event) { //passiamo il parametro event perche poi con event.currentTarget andiamo a selezionare la sezione che ci interessa
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('dettagliSezione').style.display = 'block';

    const sezioneScelta = event.currentTarget;
    let nomeSezione = sezioneScelta.querySelector('p').textContent.toLowerCase();

    nomeSezioneAttiva = nomeSezione;

    const titoloDettagli = document.getElementById('titoloSezioneDettagli');
    titoloDettagli.textContent = nomeSezione;

    mostraTasksSezione(nomeSezioneAttiva);

}


// funzione che attiva il pulsante 'indietro' per tornare alla home page quando si desidera

function tornaAllaHomePage() {
    document.getElementById('dettagliSezione').style.display = 'none'
    document.getElementById('homePage').style.display = 'block'
}




function mostraTasksSezione(nomeSezione) {
    const divTask = document.getElementById('tasksAggiunti');
    divTask.innerHTML = ''; // Pulisce il contenitore

    if (sezioni[nomeSezione] && sezioni[nomeSezione].length > 0) {
        let btnRimuoviTask = document.createElement('button');
        btnRimuoviTask.textContent = 'Elimina tutti';
        btnRimuoviTask.addEventListener('click', eliminaTuttiTasks);
        divTask.appendChild(btnRimuoviTask);
    }

    if (sezioni[nomeSezione] && sezioni[nomeSezione].length > 0) {
        sezioni[nomeSezione].forEach((taskTesto, index) => {
            let paragrafoTask = document.createElement('p');
            let taskInput = document.createElement('input');
            taskInput.value = taskTesto;
            taskInput.style.borderTop = 'none';
            taskInput.style.borderRight = 'none';
            taskInput.style.borderLeft = 'none';
            taskInput.style.borderBottomColor = 'gainsboro';

            taskInput.addEventListener('input', function(event) {
                sezioni[nomeSezione][index] = event.target.value;
                localStorage.setItem('sezioni', JSON.stringify(sezioni));
                /*console.log(sezioni);*/
            });

            paragrafoTask.appendChild(taskInput);
            divTask.appendChild(paragrafoTask);
        });
    }

    
}

//costante tasksAggiunti dichiarata globalmente cosi mi assicuro che funzioni ovunque la chiami
const divTask = document.getElementById('tasksAggiunti')

//funzione per aggiungere un task nel div apposito

function addTask() {

    sezioni[nomeSezioneAttiva].push("");
    localStorage.setItem('sezioni', JSON.stringify(sezioni));

    mostraTasksSezione(nomeSezioneAttiva)
}


//funzione chiamata nella precendete per eliminare tutti i tasks
function eliminaTuttiTasks() {
    if (!nomeSezioneAttiva) return;

    sezioni[nomeSezioneAttiva] = [];
    localStorage.setItem('sezioni', JSON.stringify(sezioni));

    const divTask = document.getElementById('tasksAggiunti');
    divTask.innerHTML = '';
}


//oggetto sezioni avente la mappa delle sezioni 
//creo un oggetto con chiave: nome della sezione e valore: ciò che la sezione contiene
let sezioni = {
    
}

//BLOCCO PER LOCAL STORAGE, DA RIVEDERE
//  Recupero dati salvati, se ci sono
const sezioniSalvate = localStorage.getItem('sezioni');
if (sezioniSalvate) {
    sezioni = JSON.parse(sezioniSalvate);

    Object.keys(sezioni).forEach(nome => {
        let divSezioni = document.createElement('div');
        divSezioni.classList.add('section');

        let paragraph = document.createElement('p');
        paragraph.textContent = nome;

        divSezioni.appendChild(paragraph);
        document.getElementById('containerSezioni').appendChild(divSezioni);

        divSezioni.addEventListener('mousedown', modificaElimina);
        divSezioni.addEventListener('touchstart', modificaElimina);
        divSezioni.addEventListener('mouseup', deletePress);
        divSezioni.addEventListener('mouseleave', deletePress);
        divSezioni.addEventListener('touchend', deletePress);
        divSezioni.addEventListener('touchcancel', deletePress);
        divSezioni.addEventListener('click', accediAllaSezione);
    });
}





















//step

        // LO FACCIMAO POIIIIIII
        //EXTRA: SE NON CI SONO SEZIONI (MAGARI L UTENTE LE ELIMINA TUTTE) APPARE SCRITTA 'NESSUNA SEZIONE PRESENTE, CHE ASPETTI A PIANIFICARE IL TUO FUTURO?, DATTI DA FARE'
            //quasto lo farei: verifico se (devo prima mettere un div che contenga tutto il contenuto delle sezioni) <-- questo div è vuoto 
            //e con if(divConNomeNonDefinito.textContent === '') allora appare la scritta (non so ancora dove).



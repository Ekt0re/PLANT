-- SCRIPT SQL FINALE (V3): FIX RENDERING GRASSETTO E LAYOUT
-- Risolve il problema del Markdown non processato dentro i div HTML.

INSERT INTO public.news (title, slug, content, is_published, published_at) VALUES 
(
  'PLANT Max: L''Ecosistema Definitivo per la Tua Casa Smart', 
  'news-plant-max', 
  '# PLANT Max: Il Futuro della Botanica è Qui

Benvenuti al vertice della tecnologia per il verde domestico. **PLANT Max** non è semplicemente un vaso, ma un sistema di gestione del verde completamente autonomo, progettato per chi cerca il massimo dell''eleganza e dell''efficienza.

<div class="info-box">
  <strong>In evidenza:</strong> Dotato di un pannello solare orientabile ad alta efficienza e di un serbatoio idrico intelligente da 5 litri.
</div>

## Autonomia Senza Precedenti
Grazie all''integrazione del pannello solare, PLANT Max riduce drasticamente la necessità di manutenzione elettrica. L''energia accumulata alimenta i sensori avanzati e il sistema di irrigazione, garantendo mesi di funzionamento senza interventi esterni.

### Perchè scegliere il modello Max?
- **Capacità Idrica Superiore**: Ideale per chi viaggia spesso o ha ritmi di vita frenetici.
- **Design Iconico**: Una sintesi perfetta tra tecnologia moderna e linee organiche.
- **Connettività Cloud**: Monitoraggio completo tramite l''App ufficiale PLANT.

<div class="grid-2">
  <div>
    <strong>Sostenibilità</strong><br>
    Riduce gli sprechi d''acqua grazie all''irrigazione a goccia controllata dai sensori.
  </div>
  <div>
    <strong>Versatilità</strong><br>
    Perfetto per piante da interno di grandi dimensioni o arbusti decorativi.
  </div>
</div>

<center>
  <button class="buy-now-btn" data-product=''{"id":3,"name":"PLANT Max","price":229.0,"description":"La soluzione completa: serbatoio integrato, pannello solare e app dedicata."}'' style="background:var(--accent-green); color:white; border:none; padding:15px 30px; border-radius:12px; font-weight:700; cursor:pointer; font-family:inherit; font-size:1.1rem; margin-top:20px; box-shadow:0 4px 15px rgba(0,0,0,0.1); transition:all 0.3s;">
    Compra Ora &nbsp; € 229.00
  </button>
</center>', 
  true, 
  NOW()
),
(
  'Nutrienti Botanici 1L: La Scienza Dietro la Crescita Perfetta', 
  'news-nutrienti-1l', 
  '# Nutrienti Botanici: Energia Vitale in Ogni Goccia

La crescita rigogliosa non è un caso, è scienza. Il nostro mix di **Nutrienti Botanici 1L** rappresenta l''apice della ricerca nutrizionale per piante in idrocoltura e vasi intelligenti.

## Formulazione Esclusiva
Abbiamo bilanciato con precisione chirurgica macro-elementi (N-P-K) e micro-nutrienti chelati per assicurare una biodisponibilità immediata. Questa formula è stata specificamente testata per evitare ostruzioni nei micro-irrigatori dei sistemi PLANT.

<div class="info-box">
  <strong>Suggerimento:</strong> Per risultati ottimali, aggiungi la soluzione al serbatoio una volta al mese durante la fase di crescita attiva.
</div>

### Benefici Reali in 14 Giorni
- **Radici Forti**: Sviluppo apparato radicale più denso e sano.
- **Pigmentazione Intensa**: Foglie visibilmente più verdi e brillanti.
- **Fioritura Estesa**: Stimola la produzione di gemme e la durata dei fiori.

<center>
  <button class="buy-now-btn" data-product=''{"id":5,"name":"Nutrienti Botanici 1L","price":19.9,"description":"Mix di macro e micro elementi studiato in laboratorio per l''erogatore automatico."}'' style="background:var(--accent-green); color:white; border:none; padding:15px 30px; border-radius:12px; font-weight:700; cursor:pointer; font-family:inherit; font-size:1.1rem; margin-top:20px; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
    Aggiungi al Carrello &nbsp; € 19.90
  </button>
</center>', 
  true, 
  NOW()
),
(
  'L''Eleganza del Legno Incontra la Tecnologia', 
  'news-supporto-legno', 
  '# Design Sostenibile: Il Supporto in Rovere

Nella filosofia di PLANT, la forma segue la funzione, ma non dimentica mai l''estetica. Il nostro **Supporto in Legno di Rovere** è il complemento ideale per chi desidera trasformare la propria tecnologia verde in un vero elemento di arredo.

## Materiali di Prima Qualità
Ogni pezzo è realizzato artigianalmente partendo da rovere massello proveniente da foreste a gestione controllata. La finitura a olio naturale protegge il legno dall''umidità residua, mantenendo intatta la sua bellezza per anni.

<div class="grid-2">
  <div>
    <strong>Lavorazione Manuale</strong><br>
    Ogni supporto è unico, con venature naturali che raccontano una storia di qualità.
  </div>
  <div>
    <strong>Stabilità Progettata</strong><br>
    Il design a baricentro basso assicura che anche le piante più alte rimangano al sicuro.
  </div>
</div>

<center>
  <button class="buy-now-btn" data-product=''{"id":6,"name":"Supporto in Legno","price":45.0,"description":"Rialzo in elegante legno di rovere sostenuto ecosostenibile."}'' style="background:var(--accent-green); color:white; border:none; padding:15px 30px; border-radius:12px; font-weight:700; cursor:pointer; font-family:inherit; font-size:1.1rem; margin-top:20px; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
    Acquista Ora &nbsp; € 45.00
  </button>
</center>', 
  true, 
  NOW()
),
(
  'PLANT Pro: La Potenza della Precisione Botanica', 
  'news-plant-pro', 
  '# PLANT Pro: Per i Veri Appassionati del Verde

Se consideri le tue piante più di un semplice decoro, **PLANT Pro** è lo strumento che stavi aspettando. È la nostra versione professionale, dotata di sensoristica di grado industriale per un controllo totale dell''ambiente di crescita.

<div class="info-box">
  <strong>Dati Tecnici:</strong> Include Wi-Fi Dual Band, sensore di umidità del terreno capacitivo e sonda pH di precisione.
</div>

## Monitoraggio in Tempo Reale
Accedi alla dashboard professionale per visualizzare grafici dettagliati sull''andamento di pH, temperatura e umidità. Ricevi notifiche predittive basate sull''intelligenza artificiale per prevenire stress idrici o carenze nutritive prima che diventino visibili.

<center>
  <button class="buy-now-btn" data-product=''{"id":2,"name":"PLANT Pro","price":149.0,"description":"Irrigazione automatica, sensore pH e connettività Wi-Fi avanzata."}'' style="background:var(--accent-green); color:white; border:none; padding:15px 30px; border-radius:12px; font-weight:700; cursor:pointer; font-family:inherit; font-size:1.1rem; margin-top:20px; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
    Ordina Pro &nbsp; € 149.00
  </button>
</center>', 
  true, 
  NOW()
),
(
  'Guida alla Manutenzione: Il Set Sensori di Ricambio', 
  'news-set-sensori', 
  '# Mantieni il Cuore del Tuo PLANT Sempre Giovane

La precisione dei dati è alla base del successo del nostro sistema. Per questo motivo, abbiamo creato il **Set Sensori di Ricambio**, un kit essenziale per garantire che il tuo dispositivo mantenga le prestazioni del primo giorno.

## Perché Sostituire i Sensori?
Con il tempo, sali minerali e calcare possono influenzare la sensibilità delle sonde. Una manutenzione programmata ogni 24 mesi assicura che le letture di pH e umidità rimangano cristalline.

<center>
  <button class="buy-now-btn" data-product=''{"id":4,"name":"Set Sensori di Ricambio","price":29.9,"description":"Kit completo di sensori pH, umidità e temperatura."}'' style="background:var(--accent-green); color:white; border:none; padding:15px 30px; border-radius:12px; font-weight:700; cursor:pointer; font-family:inherit; font-size:1.1rem; margin-top:20px; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
    Acquista Kit &nbsp; € 29.90
  </button>
</center>', 
  true, 
  NOW()
),
(
  'PLANT Sprout: Il Tuo Primo Passo Verso il Verde Smart', 
  'news-plant-sprout', 
  '# PLANT Sprout: Piccole Dimensioni, Grande Cuore

Non serve una casa enorme per godere della tecnologia PLANT. **PLANT Sprout** è il nostro modello più compatto, ideale per scrivanie, uffici o piccoli spazi urbani dove ogni centimetro conta.

## Il Compagno Perfetto da Scrivania
Sprout è progettato per eliminare lo stress della cura quotidiana. Si occupa di monitorare la luce e l''umidità per te, segnalandoti esattamente quando la tua pianta ha bisogno d''attenzione.

<center>
  <button class="buy-now-btn" data-product=''{"id":1,"name":"PLANT Sprout","price":40.0,"description":"Il vaso intelligente essenziale. Sensori di umidità e temperatura integrati."}'' style="background:var(--accent-green); color:white; border:none; padding:15px 30px; border-radius:12px; font-weight:700; cursor:pointer; font-family:inherit; font-size:1.1rem; margin-top:20px; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
    Inizia ora &nbsp; € 40.00
  </button>
</center>', 
  true, 
  NOW()
);

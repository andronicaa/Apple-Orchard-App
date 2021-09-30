# Apple-Orchard-App

Aplicația "Măruleț" are ca principal obiectiv introducerea avantajelor tehnologiei în domeniul pomiculturii. Aceasta are o largă arie de acoperire fiind destinată atât administratorilor de livezi de meri, cât și persoanelor din comunitățile acestora care doresc să contribuie la activitățile specifice dintr-o livadă.

Una din funcționalitățile esențiale este implementarea unui sistem pentru programarea de operațiuni, ce depinde de un cumul de factori: temperatură, precipitații, problemă tratată, dar și stadiul de dezvoltare al fructului. Fiecare din acești factori influențează perioada și modul în care trebuie realizată o operațiune. Sistemul pentru programarea operațiunilor din aplicație analizează fiecare din aspectele precizate pentru ca utilizatorul să aleagă perioada și produsele optime în vederea efectuării tratamentelor.

Persoanele cu diferite calificări profesionale pot opta pentru locuri de muncă publicate de către cultivatorii locali. Aceștia stabilesc cerințele ce stau la baza acceptării în vederea angajării, o persoană având posibilitatea aplicării pentru un loc de muncă doar în condițiile specificate de cultivator. În acest fel, procesul de recrutare devine mai ușor de parcurs pentru ambele părți: aplicant și angajator. De asemenea, domeniul agriculturii presupune dezvoltarea spiritului de echipă, respectiv a unei comunități bine consolidate, așadar cultivatorii pot lua legătura și dezvolta o varietate de subiecte din domeniul agriculturii folosind forumul integrat în aplicație ce prezintă numeroase funcții, printre care cele de filtrare, sortare, dar și publicarea de poze.


# Prezentare generală

“Măruleț” este o aplicație web dezvoltată utilizând biblioteca ReactJs împreună cu platforma Firebase. Cele două categorii principale de utilizatori sunt cultivatorul și angajatul ce trebuie să își creeze, pentru început, un cont în scopul utilizării aplicației. Cea mai importantă funcționalitate a contului de cultivator o reprezintă gestionarea operațiunilor care se fac pe tot parcursul anului într-o livadă de meri, programate de către utilizator în funcție de starea vremii, utilajele disponibile la acel moment de timp, dar și calificarea profesională a fiecărui angajat. Tot acesta, poate publica diferite locuri de muncă în funcție de necesitățile fiecărui stadiu de dezvoltare. Angajatul ale cărui caracteristici corespund celor cerute de către angajator în anunțul postat de el, poate aplica pentru acestea în vederea obținerii unui loc de muncă. De asemenea cultivatorul poate ține evidența cheltuielilor la zi, acestea fiind reprezentate prin grafice pentru o înțelegere mai ușoară.

![imagine 1](https://user-images.githubusercontent.com/59537490/135400912-4a898d4e-7e3b-46dc-a6bb-7a39612b41a6.png)


Una dintre componentele cheie ale aplicației este forumul. Prin intermediul acestuia, cultivatorii din diferite locații pot cere și oferi sfaturi, lucru ce în timp poate deveni baza unei comunități de pomicultori din diverse zone.

![imagine 5](https://user-images.githubusercontent.com/59537490/135402500-f578430b-9f76-44ff-8d11-633789a5912a.png)


# Tehnologii utilizate

Partea de frontend a fost implementată în biblioteca ReactJS împreună cu alte tehnologii auxiliare precum Bootstrap, React-Bootstrap și CSS. 
Aplicația este de tipul serverless, astfel că gestionarea bazei de date și a serviciilor de autentificare și conectare sunt preluate de furnizorul Firebase. Baza de date folosită este Cloud Firestore, fiind o bază de date NoSQL. Aceasta mi-a permis o mai mare flexibilitate pe parcursul implementării, însă cu o atenție sporită pentru inconsistențele care ar fi putut să apară. 

*Această lucrare a fost realizata sub coordonarea doamnei profesor Lect. Dr. Carmen Chiriță*

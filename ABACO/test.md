| Excel row | Current FE check | Covered behavior |
|---|---|---|
| `CONINS | Contract - contract insert` | `getPermit("CONINS", "DOMANDE")` | Create contract button, including `Salva e inserisci contratti`. |
| `CONMOD | Contract - contract manage` | `getPermit("CONMOD", "DOMANDE")` | Contract edit/manage actions. Also required together with movement/plots permissions. |
| `CONVIS | Contract - View` | `getPermit("CONVIS", "DOMANDE")` | Contract list visibility inside filiera. |
| `FUNCT_CONTR_CAPO_FILIERA | Funzione SSO per la movimentazione del contratto Filiera` | `getPermit("FUNCT_CONTR_CAPO_FILIERA", "DOMANDE")` | Contract movement for filiera contracts, together with `CONMOD`. |
| `FILINS | Inserimento filiera` | `getPermit("FILINS", "DOMANDE")` | Create filiera button and create/save handler. |
| `FILMOD | Modifica filiera` | `getPermit("FILMOD", "DOMANDE")` | Edit/delete filiera buttons and handlers. |
| `FILVIS | Visualizzazione filiera` | `getPermit("FILVIS", "DOMANDE")` | Filiera list/page visibility. |
| `SOGG_PLOT_SC_SCHEDE | Accesso scheda appezzamenti dossier` | `getPermit("SOGG_PLOT_SC_SCHEDE", "SCHEDE")` | Add/select plots, together with `CONMOD`. |
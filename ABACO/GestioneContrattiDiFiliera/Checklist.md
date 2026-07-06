
1-  [+] In company selection, remove the **ID** and rename **Description** to **“Ragione Sociale”**.                                                                  
2-  [+] In contract date selection, the selected dates must not be outside the validity dates of the selected supply chain.                                           
3-  [+] In the **Contracts List** table, remove the column **“Tipologia Azienda”**.                                                                                   
4-  [+] In the **Contract Detail** page, the **Edit Contractor** action does not navigate/open the expected page. This needs to be checked/fixed.                     
5-  [+] Add the label/text **“Aggiunta appezzamenti”** in the specific tab, otherwise users do not understand where they need to click.                               
6-  [+] After adding plots/parcels, when returning to the contract movement page, refresh/update the page so the user can see the section related to the added plots. 
7-  [+] In the plot/parcel selection page, rename the button **“Indietro”** to **“Conferma”**.                                                                        
8-  [+] When showing the variety, do not show only the code. Add the variety description as well.                                                                     
9-  [+] After creating a contract, the user has no way to view the list of contracted plots/parcels. Enable the same selection screen, but in **read-only mode**.     
10- [+] In **Contract Data**, the contract duration is currently formatted in English. Change it to Italian format.                                                   
11- [+] On the contract creation page, remove the option **“CAPOFILIERA”** from the contractors list.                                                                 
12- [+] On the contract movement page, in the **Main Data** section, remove the field **“Tipo”**.                                                                     
13- [+] On the contract edit page, in the **Main Data** section, remove the field **“Abbonamento”**.                                                                  



<!-- 1. fix(filiere): update company selector labels -->

<!-- 2. fix(filiere): validate contract dates against filiera validity range -->

<!-- 3. fix(filiere): remove company type column from contracts list -->

<!-- 4. fix(filiere): fix contractor edit navigation from contract detail -->

<!-- 5. fix(filiere): update abc-tool-button to abc-button with title "Add Plots" -->

<!-- 6. fix(filiere): refresh contract movement data after adding plots -->

<!-- 7. fix(filiere): rename plot selection back button to confirm -->

<!-- 8. fix(filiere): display variety description with code -->

<!-- 9. feat(filiere): add read-only view for contracted plots -->

<!-- 10. fix(filiere): format contract duration in Italian -->

<!-- 11. fix(filiere): hide capofiliera option during contract creation -->

<!-- 12. fix(filiere): remove type field from contract movement main data -->

<!-- 13. fix(filiere): remove subscription field from contract edit main data -->
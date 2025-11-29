# ✅ Checklist de Test - Structure Supabase

## 🎯 **Tests à Effectuer (Dans l'Ordre)**

### **Phase 1 : Tests de Base**
- [ ] **1.1** Application compile sans erreur (`dotnet build`)
- [ ] **1.2** Application démarre (`dotnet run`)
- [ ] **1.3** Page `/TestSupabase` accessible
- [ ] **1.4** Page `/TestSupabaseDebug` accessible (nouvellement créée)

### **Phase 2 : Tests de Connexion**
- [ ] **2.1** Test de connexion Supabase passe
- [ ] **2.2** Récupération de la liste des entreprises (même vide) réussit
- [ ] **2.3** Aucune erreur de configuration dans les logs

### **Phase 3 : Tests de Génération d'ID**
- [ ] **3.1** Génération d'ID pour différents noms d'entreprise
- [ ] **3.2** Format d'ID correct : `COMP_NOM_XXXXXXXX`
- [ ] **3.3** IDs uniques pour le même nom d'entreprise
- [ ] **3.4** Gestion des caractères spéciaux dans les noms

**Résultat attendu :**
```
'Test Company' → COMP_TEST_COMPANY_A1B2C3D4
'Acme Corp' → COMP_ACME_CORP_X9Y8Z7W6
'Café & Restaurant' → COMP_CAFE_AND_RESTAURANT_B5C4D3E2
```

### **Phase 4 : Tests de Création d'Entreprise**
- [ ] **4.1** Création d'entreprise avec tous les champs
- [ ] **4.2** ID généré automatiquement et non NULL
- [ ] **4.3** Récupération de l'entreprise par ID
- [ ] **4.4** Tous les champs sauvegardés correctement

**Résultat attendu :**
```
✅ Création d'entreprise réussie !
🆔 ID : COMP_DEBUG_TEST_COMPANY_12345678
📝 Nom : Debug Test Company
📁 Dossier : documents/debug_test_company
🤖 Chatbot : DebugBot
✅ Vérification récupération : OK
```

### **Phase 5 : Tests d'Upload de Documents**
- [ ] **5.1** Upload de document avec entreprise existante
- [ ] **5.2** Fichier créé dans le bon dossier Supabase
- [ ] **5.3** Métadonnées créées avec bon company_id
- [ ] **5.4** Récupération des documents par company_id

**Résultat attendu :**
```
✅ Upload de fichier réussi !
🏢 Entreprise utilisée : Debug Test Company (COMP_DEBUG_TEST_COMPANY_12345678)
📄 Fichier uploadé : documents/debug_test_company/uuid_upload_test.txt
📁 Dossier cible : documents/debug_test_company
```

### **Phase 6 : Tests Intégrés**
- [ ] **6.1** Test complet : création entreprise + upload document
- [ ] **6.2** Récupération des entreprises et leurs documents
- [ ] **6.3** Suppression d'entreprise et cascade sur documents
- [ ] **6.4** Nettoyage complet des données de test

### **Phase 7 : Tests End-to-End**
- [ ] **7.1** Création de chatbot via `/Create`
- [ ] **7.2** Remplissage de tous les onglets du formulaire
- [ ] **7.3** Upload de documents réels (PDF, DOCX, etc.)
- [ ] **7.4** Redirection vers page de succès
- [ ] **7.5** Vérification dans Supabase que tout est créé

### **Phase 8 : Tests de Navigation**
- [ ] **8.1** Page `/Documents?companyId=XXX` affiche les documents
- [ ] **8.2** Suppression de document fonctionne
- [ ] **8.3** Informations d'entreprise correctement affichées
- [ ] **8.4** Gestion des entreprises sans documents

---

## 🚨 **Points de Vérification Critiques**

### **❌ Erreurs à Surveiller**
1. **"null value in column \"id\""** → Problème annotation PrimaryKey
2. **"foreign key violation"** → company_id invalide
3. **"bucket not found"** → Bucket documents pas créé
4. **"permission denied"** → Politiques RLS trop restrictives

### **✅ Indicateurs de Succès**
1. **IDs générés** au format `COMP_XXX_XXXXXXXX`
2. **Entreprises créées** dans table companies
3. **Documents uploadés** dans bon dossier storage
4. **Métadonnées créées** avec company_id valide
5. **Relations FK** fonctionnelles (cascade delete)

---

## 📊 **Validation des Données dans Supabase**

### **Requêtes SQL de Vérification :**
```sql
-- 1. Vérifier les entreprises créées
SELECT id, company_name, folder_path, chatbot_name, created_at 
FROM companies 
ORDER BY created_at DESC;

-- 2. Vérifier les documents et leurs relations
SELECT 
    c.company_name,
    d.file_path,
    d.status,
    d.uploaded_at
FROM companies c
JOIN document_metadata d ON c.id = d.company_id
ORDER BY d.uploaded_at DESC;

-- 3. Vérifier l'intégrité référentielle
SELECT 
    (SELECT COUNT(*) FROM companies) as total_companies,
    (SELECT COUNT(*) FROM document_metadata) as total_documents,
    (SELECT COUNT(*) FROM document_metadata WHERE company_id NOT IN (SELECT id FROM companies)) as orphaned_documents;
```

### **Vérifications Storage :**
- [ ] Bucket `documents` existe
- [ ] Dossiers créés par entreprise
- [ ] Fichiers uploadés avec noms uniques
- [ ] Politiques de sécurité permettent l'accès

---

## 🎯 **Critères de Validation Finale**

### **✅ Configuration Réussie Si :**
1. **Tous les tests passent** sans erreur
2. **Données cohérentes** entre tables et storage
3. **Navigation fluide** entre les pages
4. **Pas d'erreurs** dans les logs de l'application
5. **Performance acceptable** (< 5s pour upload)

### **📋 Fonctionnalités Validées :**
- [x] Génération d'IDs entreprise uniques et lisibles
- [x] Création d'entreprises avec tous les champs
- [x] Upload de documents vers Supabase Storage
- [x] Relations FK entre entreprises et documents
- [x] Interface de gestion et visualisation
- [x] Cascade delete (supprimer entreprise = supprimer documents)
- [x] Tests automatisés et debugging

---

## 🚀 **Prochaines Étapes Après Validation**

1. **🔒 Sécurité** : Affiner les politiques RLS selon vos besoins
2. **👥 Authentification** : Ajouter un système d'utilisateurs
3. **📊 Monitoring** : Surveiller l'usage du storage
4. **🔧 Optimisation** : Ajouter la mise en cache si nécessaire
5. **📝 Documentation** : Documenter pour votre équipe

---

**🎉 Une fois cette checklist complétée, votre intégration Supabase est prête pour la production !**
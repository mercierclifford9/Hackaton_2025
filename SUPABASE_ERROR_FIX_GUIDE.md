# 🔧 Guide de Correction - Erreur ID NULL dans Companies

## 🚨 **Problème Identifié**
```
Error: "null value in column \"id\" of relation \"companies\" violates not-null constraint"
```

### **Cause Root**
Le modèle `Company` n'indiquait pas à Supabase d'utiliser notre ID personnalisé au lieu de générer automatiquement un UUID.

---

## ✅ **Corrections Apportées**

### **1. Modèle Company.cs**
```csharp
// AVANT (incorrect)
[PrimaryKey("id")]
public string Id { get; set; } = string.Empty;

// APRÈS (correct)
[PrimaryKey("id", false)]  // false = ne pas auto-générer
public string Id { get; set; } = string.Empty;
```

### **2. Service CompanyService.cs**
```csharp
// AVANT (potentiellement problématique)
await _client.From<Company>().Insert(company);
return company;

// APRÈS (plus robuste)
var result = await _client.From<Company>().Insert(company);
return result.Models.First();
```

### **3. Page de Test Améliorée**
- ✅ **Validation étape par étape** : ID généré → Entreprise créée → Vérification → Upload
- ✅ **Messages d'erreur détaillés** : Type d'erreur + StackTrace
- ✅ **Tests séparés** : Génération ID, Création entreprise, Upload séparément
- ✅ **Page de debug** : `/TestSupabaseDebug` pour diagnostiquer

---

## 🧪 **Comment Tester la Correction**

### **Étape 1 : Lancer l'Application**
```bash
dotnet run
```

### **Étape 2 : Tests Séquentiels**
1. **Connexion** : `/TestSupabase` → "Test de Connexion"
2. **Génération ID** : `/TestSupabaseDebug` → "Test Génération ID"
3. **Création Entreprise** : `/TestSupabaseDebug` → "Test Création Entreprise"
4. **Upload** : `/TestSupabaseDebug` → "Test Upload Seul"
5. **Test Complet** : `/TestSupabase` → "Test d'Insertion"

### **Étape 3 : Vérification Résultats**
- ✅ Tous les tests doivent passer
- ✅ IDs générés format : `COMP_NOM_XXXXXXXX`
- ✅ Entreprises créées dans Supabase
- ✅ Documents uploadés avec métadonnées

---

## 🔍 **Diagnostic d'Erreurs**

### **Si l'erreur persiste :**

#### **Vérification 1 : Configuration Supabase**
```sql
-- Vérifier la structure de la table companies
\d companies;

-- Vérifier que la colonne id n'a pas de DEFAULT
SELECT column_name, column_default, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'companies' AND column_name = 'id';
```

#### **Vérification 2 : Données de Test**
```sql
-- Voir les entreprises créées
SELECT id, company_name, folder_path, created_at 
FROM companies 
ORDER BY created_at DESC LIMIT 5;
```

#### **Vérification 3 : Politiques RLS**
```sql
-- Vérifier que les politiques permettent l'insertion
SELECT * FROM pg_policies WHERE tablename = 'companies';
```

### **Autres Erreurs Possibles :**

| **Erreur** | **Cause** | **Solution** |
|------------|-----------|-------------|
| `"duplicate key value"` | ID déjà existant | Partie aléatoire de l'ID |
| `"foreign key violation"` | company_id invalide | Vérifier que l'entreprise existe |
| `"permission denied"` | Politiques RLS trop strictes | Ajuster les politiques |
| `"bucket not found"` | Bucket documents manquant | Créer le bucket dans Supabase |

---

## 🎯 **Tests de Validation Recommandés**

### **Test 1 : Génération d'ID Unique**
```csharp
var id1 = _companyService.GenerateCompanyId("Test Company");
var id2 = _companyService.GenerateCompanyId("Test Company");
// id1 != id2 (grâce au suffixe aléatoire)
```

### **Test 2 : Création Multiple**
```csharp
// Créer plusieurs entreprises avec le même nom
for (int i = 0; i < 3; i++)
{
    await _companyService.CreateCompanyAsync($"Test Company {i}");
}
// Tous doivent réussir avec des IDs différents
```

### **Test 3 : Récupération**
```csharp
var company = await _companyService.CreateCompanyAsync("Test");
var retrieved = await _companyService.GetCompanyByIdAsync(company.Id);
// retrieved != null && retrieved.Id == company.Id
```

---

## 📋 **Checklist de Validation**

- [ ] ✅ Annotation `[PrimaryKey("id", false)]` dans Company.cs
- [ ] ✅ Méthode `GenerateCompanyId()` fonctionnelle
- [ ] ✅ `CreateCompanyAsync()` retourne un objet avec ID valide
- [ ] ✅ Test de connexion Supabase passe
- [ ] ✅ Test de génération d'ID produit des IDs uniques
- [ ] ✅ Test de création d'entreprise réussit
- [ ] ✅ Test d'upload de document réussit
- [ ] ✅ Page `/Create` fonctionne end-to-end
- [ ] ✅ Page `/Documents?companyId=XXX` affiche les documents

---

## 🚀 **Fonctionnement Final Attendu**

### **Flux Complet :**
1. **Utilisateur remplit le formulaire** sur `/Create`
2. **Génération ID entreprise** : `COMP_ACME_CORP_A1B2C3D4`
3. **Création entreprise** dans table `companies`
4. **Upload documents** vers `documents/acme_corp/`
5. **Création métadonnées** dans table `document_metadata` avec `company_id`
6. **Redirection** vers page de succès

### **Résultat dans Supabase :**
```
📋 Table companies:
├── COMP_ACME_CORP_A1B2C3D4 | Acme Corp | documents/acme_corp | ...

📋 Table document_metadata:
├── uuid1 | COMP_ACME_CORP_A1B2C3D4 | documents/acme_corp/guid_file1.pdf
├── uuid2 | COMP_ACME_CORP_A1B2C3D4 | documents/acme_corp/guid_file2.docx

📁 Storage documents:
├── acme_corp/
│   ├── guid_file1.pdf
│   └── guid_file2.docx
```

---

## 🎉 **Confirmation de Correction**

Si tous les tests passent, l'erreur est corrigée et vous pouvez :
- ✅ Créer des chatbots via `/Create`
- ✅ Uploader des documents
- ✅ Voir les documents via `/Documents?companyId=XXX`
- ✅ Utiliser toutes les fonctionnalités Supabase

**La nouvelle structure entreprises/documents fonctionne correctement !**
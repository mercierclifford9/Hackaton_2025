# 🆕 Guide Supabase - Nouvelle Structure Entreprises/Documents

Ce guide vous accompagne pour configurer Supabase avec la nouvelle structure séparant les entreprises et les documents.

---

## 🏗️ **Architecture de la Nouvelle Structure**

```
🏢 COMPANIES                    📄 DOCUMENTS
┌─────────────────┐            ┌─────────────────┐
│ companies       │◄─────────┐ │ document_metadata│
├─────────────────┤          │ ├─────────────────┤
│ id (TEXT) PK    │          └─│ company_id (FK) │
│ company_name    │            │ id (UUID) PK    │
│ url             │            │ user_id         │
│ folder_path     │            │ file_path       │
│ description     │            │ status          │
│ chatbot_name    │            │ uploaded_at     │
│ chatbot_default_language │    └─────────────────┘
│ chatbot_welcome_message  │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

---

## 📋 **Script de Configuration Complet**

### **Pour une Nouvelle Installation**
Exécutez ce script dans l'éditeur SQL de Supabase :

```sql
-- ============================================================================
-- CONFIGURATION COMPLÈTE SUPABASE - NOUVELLE STRUCTURE
-- Exécutez ce script d'un bloc dans l'éditeur SQL
-- ============================================================================

-- 1. CRÉER LE BUCKET DE STOCKAGE (si pas déjà fait)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- 2. CRÉER LA TABLE COMPANIES
CREATE TABLE IF NOT EXISTS public.companies (
    id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    url TEXT,
    folder_path TEXT NOT NULL,
    description TEXT,
    chatbot_name TEXT NOT NULL,
    chatbot_default_language TEXT DEFAULT 'fr',
    chatbot_welcome_message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contraintes
    CONSTRAINT company_name_not_empty CHECK (char_length(company_name) > 0),
    CONSTRAINT chatbot_name_not_empty CHECK (char_length(chatbot_name) > 0),
    CONSTRAINT folder_path_not_empty CHECK (char_length(folder_path) > 0)
);

-- 3. CRÉER LA TABLE DOCUMENT_METADATA
CREATE TABLE IF NOT EXISTS public.document_metadata (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    company_id TEXT NOT NULL,
    file_path TEXT NOT NULL,
    status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'processed', 'error')),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contraintes
    CONSTRAINT file_path_not_empty CHECK (char_length(file_path) > 0),
    
    -- Clé étrangère
    CONSTRAINT fk_document_company 
    FOREIGN KEY (company_id) REFERENCES public.companies(id) 
    ON DELETE CASCADE
);

-- 4. CRÉER LES INDEX POUR LES PERFORMANCES
-- Index pour companies
CREATE INDEX IF NOT EXISTS idx_companies_company_name ON public.companies(company_name);
CREATE INDEX IF NOT EXISTS idx_companies_folder_path ON public.companies(folder_path);

-- Index pour document_metadata
CREATE INDEX IF NOT EXISTS idx_document_metadata_company_id ON public.document_metadata(company_id);
CREATE INDEX IF NOT EXISTS idx_document_metadata_user_id ON public.document_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_document_metadata_status ON public.document_metadata(status);
CREATE INDEX IF NOT EXISTS idx_document_metadata_company_status ON public.document_metadata(company_id, status);

-- 5. ACTIVER ROW LEVEL SECURITY
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_metadata ENABLE ROW LEVEL SECURITY;

-- 6. CRÉER LES POLITIQUES RLS POUR COMPANIES
CREATE POLICY IF NOT EXISTS "Enable all operations on companies" ON public.companies
    FOR ALL USING (true) WITH CHECK (true);

-- 7. CRÉER LES POLITIQUES RLS POUR DOCUMENT_METADATA
CREATE POLICY IF NOT EXISTS "Enable all operations on documents" ON public.document_metadata
    FOR ALL USING (true) WITH CHECK (true);

-- 8. CRÉER LES POLITIQUES STORAGE
CREATE POLICY IF NOT EXISTS "Enable all storage operations" ON storage.objects 
    FOR ALL USING (bucket_id = 'documents') WITH CHECK (bucket_id = 'documents');

-- 9. AJOUTER LES COMMENTAIRES DE DOCUMENTATION
COMMENT ON TABLE public.companies IS 'Table des entreprises pour les chatbots';
COMMENT ON TABLE public.document_metadata IS 'Table des métadonnées des documents uploadés';

COMMENT ON COLUMN public.companies.id IS 'Identifiant unique de l''entreprise (format: COMP_NAME_XXXXXXXX)';
COMMENT ON COLUMN public.companies.folder_path IS 'Chemin du dossier dans le storage Supabase';
COMMENT ON COLUMN public.document_metadata.company_id IS 'Référence vers l''entreprise propriétaire';

-- ============================================================================
-- CONFIGURATION TERMINÉE !
-- ============================================================================

-- VÉRIFICATIONS FINALES
SELECT 'COMPANIES TABLE' as check_type, COUNT(*) as count FROM public.companies;
SELECT 'DOCUMENTS TABLE' as check_type, COUNT(*) as count FROM public.document_metadata;
SELECT 'STORAGE BUCKET' as check_type, name FROM storage.buckets WHERE id = 'documents';

SELECT '✅ CONFIGURATION RÉUSSIE ! Votre base de données est prête.' as status;
```

---

## 🧪 **Script de Test et Validation**

Après la configuration, exécutez ce script pour valider :

```sql
-- ============================================================================
-- TESTS DE VALIDATION
-- ============================================================================

-- 1. Test d'insertion d'une entreprise
INSERT INTO public.companies (
    id, company_name, url, folder_path, 
    chatbot_name, chatbot_welcome_message
) VALUES (
    'COMP_TEST_COMPANY_12345678',
    'Test Company',
    'https://test.com',
    'documents/test_company',
    'TestBot',
    'Bonjour ! Je suis un chatbot de test.'
) ON CONFLICT (id) DO NOTHING;

-- 2. Test d'insertion d'un document
INSERT INTO public.document_metadata (
    company_id, file_path, status
) VALUES (
    'COMP_TEST_COMPANY_12345678',
    'documents/test_company/test_document.pdf',
    'uploaded'
);

-- 3. Test de requête avec jointure
SELECT 
    c.company_name,
    c.chatbot_name,
    d.file_path,
    d.status,
    d.uploaded_at
FROM public.companies c
LEFT JOIN public.document_metadata d ON c.id = d.company_id
WHERE c.id = 'COMP_TEST_COMPANY_12345678';

-- 4. Nettoyage du test
DELETE FROM public.document_metadata WHERE company_id = 'COMP_TEST_COMPANY_12345678';
DELETE FROM public.companies WHERE id = 'COMP_TEST_COMPANY_12345678';

SELECT '✅ TESTS DE VALIDATION RÉUSSIS !' as status;
```

---

## 🔧 **Configuration de l'Application**

### **1. Fichiers de Configuration**

**appsettings.json** et **appsettings.Development.json** :
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Supabase": {
    "Url": "https://votre-projet-id.supabase.co",
    "Key": "votre-clé-anon-publique"
  }
}
```

### **2. Tester l'Application**

1. **Compilation** :
   ```bash
   dotnet restore
   dotnet build
   dotnet run
   ```

2. **Tests Fonctionnels** :
   - Allez sur `/TestSupabase`
   - Exécutez tous les tests dans l'ordre
   - Vérifiez que tout fonctionne

3. **Test Complet** :
   - Allez sur `/Create`
   - Créez un nouveau chatbot avec des documents
   - Vérifiez que les entreprises et documents sont créés

---

## 📊 **Fonctionnalités de la Nouvelle Structure**

### **🆔 Génération d'ID Entreprise**
- **Format** : `COMP_NOM_ENTREPRISE_XXXXXXXX`
- **Exemple** : `COMP_ACME_CORP_A1B2C3D4`
- **Longueur** : Maximum 50 caractères
- **Unicité** : Garantie par suffixe aléatoire

### **📁 Organisation des Dossiers**
- **Structure** : `documents/nom_entreprise_clean/`
- **Exemple** : `documents/acme_corp/guid_filename.pdf`
- **Nettoyage** : Caractères spéciaux supprimés automatiquement

### **🔗 Relations**
- **Contrainte FK** : Cascade sur suppression d'entreprise
- **Intégrité** : Impossible d'avoir des documents orphelins
- **Performance** : Index optimisés pour les jointures

---

## 📋 **Mapping des Champs du Formulaire**

| **Section Formulaire** | **Page** | **Champ Formulaire** | **Table** | **Champ DB** |
|------------------------|----------|---------------------|-----------|-------------|
| **Entreprise** | Create | CompanyName | companies | company_name |
| **Entreprise** | Create | CompanyDescription | companies | description |
| **Site web** | Create | WebsiteUrl | companies | url |
| **Configuration** | Create | ChatbotName | companies | chatbot_name |
| **Configuration** | Create | Language | companies | chatbot_default_language |
| **Configuration** | Create | WelcomeMessage | companies | chatbot_welcome_message |
| **Documents** | Create | Documents (files) | document_metadata | file_path |

### **Champs Générés Automatiquement**
- `companies.id` → Généré par `CompanyService.GenerateCompanyId()`
- `companies.folder_path` → Généré par `CompanyService.GenerateFolderPath()`
- `companies.created_at/updated_at` → Timestamps automatiques
- `document_metadata.id` → UUID généré automatiquement

---

## ✅ **Checklist de Validation**

- [ ] ✅ Bucket `documents` créé
- [ ] 🏢 Table `companies` créée avec toutes les colonnes
- [ ] 📄 Table `document_metadata` créée avec company_id
- [ ] 🔗 Clé étrangère configurée (companies ← document_metadata)
- [ ] 📊 Index créés pour les performances
- [ ] 🔒 Politiques RLS configurées
- [ ] 🧪 Tests de validation réussis
- [ ] 🔧 Application qui compile et fonctionne
- [ ] 📤 Test d'upload fonctionnel via `/Create`
- [ ] 🔍 Test de récupération via `/Documents?companyId=...`

---

## 🎯 **URLs et Navigation**

### **Nouvelles URLs**
- **Documents d'une entreprise** : `/Documents?companyId=COMP_XXX_XXX`
- **Tests** : `/TestSupabase`

### **Exemples d'Usage**
```csharp
// Créer une entreprise
var company = await _companyService.CreateCompanyAsync("Acme Corp", "https://acme.com");

// Uploader un document
var filePath = await _supabaseService.UploadDocumentAsync(file, company.Id);

// Récupérer les documents d'une entreprise
var documents = await _supabaseService.GetDocumentsForCompanyAsync(company.Id);
```

---

**🎉 Votre nouvelle structure Supabase est maintenant configurée et prête à l'emploi !**

La nouvelle architecture offre :
- ✅ **Séparation claire** entre entreprises et documents
- ✅ **IDs lisibles** et personnalisés pour les entreprises
- ✅ **Intégrité référentielle** avec clés étrangères
- ✅ **Performance optimisée** avec index appropriés
- ✅ **Extensibilité** pour futures fonctionnalités
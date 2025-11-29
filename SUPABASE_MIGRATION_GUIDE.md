# 🔄 Guide de Migration Supabase - Nouvelle Structure

Ce guide vous accompagne pour migrer votre base de données Supabase vers la nouvelle structure avec séparation entreprises/documents.

---

## 🎯 **Résumé des Changements**

### Avant (Structure Ancienne)
```
📋 Table: document_metadata
├── id (UUID)
├── user_id (UUID)
├── file_path (TEXT)
├── business_name (TEXT) ← SUPPRIMÉ
├── status (TEXT)
└── uploaded_at (TIMESTAMP)
```

### Après (Nouvelle Structure)
```
📋 Table: companies (NOUVEAU)
├── id (TEXT) ← ID personnalisé
├── company_name (TEXT)
├── url (TEXT)
├── folder_path (TEXT)
├── description (TEXT)
├── chatbot_name (TEXT)
├── chatbot_default_language (TEXT)
├── chatbot_welcome_message (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

📋 Table: document_metadata (MODIFIÉE)
├── id (UUID)
├── user_id (UUID)
├── company_id (TEXT) ← NOUVEAU (Foreign Key)
├── file_path (TEXT)
├── status (TEXT)
└── uploaded_at (TIMESTAMP)
```

---

## 🚀 **Étapes de Migration**

### **Étape 1 : Backup de Sécurité**
⚠️ **IMPORTANT** : Toujours sauvegarder avant migration !

```sql
-- Exporter les données existantes
SELECT * FROM document_metadata;
-- Copiez le résultat dans un fichier de sauvegarde
```

### **Étape 2 : Créer la Table Companies**
Exécutez dans l'éditeur SQL de Supabase :

```sql
-- ============================================================================
-- CRÉATION DE LA TABLE COMPANIES
-- ============================================================================

CREATE TABLE public.companies (
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

-- Index pour les performances
CREATE INDEX idx_companies_company_name ON public.companies(company_name);
CREATE INDEX idx_companies_folder_path ON public.companies(folder_path);

-- Commentaires
COMMENT ON TABLE public.companies IS 'Table des entreprises pour les chatbots';
```

### **Étape 3 : Migrer les Données Existantes**

#### **Option A : Migration Automatique (Recommandée)**
```sql
-- ============================================================================
-- MIGRATION AUTOMATIQUE DES DONNÉES
-- ============================================================================

-- 1. Créer les entreprises à partir des business_name existants
INSERT INTO public.companies (id, company_name, folder_path, chatbot_name, chatbot_welcome_message)
SELECT DISTINCT
    'COMP_' || UPPER(REPLACE(REPLACE(REPLACE(business_name, ' ', '_'), '-', '_'), '.', '_')) || '_' || 
    SUBSTRING(MD5(business_name || EXTRACT(EPOCH FROM NOW())), 1, 8) as id,
    business_name as company_name,
    'documents/' || LOWER(REPLACE(REPLACE(REPLACE(business_name, ' ', '_'), '-', '_'), '.', '_')) as folder_path,
    business_name as chatbot_name,
    'Bonjour ! Comment puis-je vous aider aujourd''hui ?' as chatbot_welcome_message
FROM public.document_metadata
WHERE business_name IS NOT NULL 
  AND business_name != '';

-- 2. Afficher les entreprises créées pour vérification
SELECT * FROM public.companies ORDER BY created_at;
```

#### **Option B : Migration Manuelle**
Si vous voulez contrôler chaque entreprise :

```sql
-- Insérer chaque entreprise manuellement
-- Remplacez les valeurs par vos données réelles

INSERT INTO public.companies (
    id, company_name, url, folder_path, description, 
    chatbot_name, chatbot_default_language, chatbot_welcome_message
) VALUES (
    'COMP_ACME_CORP_A1B2C3D4',  -- ID personnalisé
    'Acme Corporation',          -- Nom de l'entreprise
    'https://acme.com',          -- URL (optionnel)
    'documents/acme_corporation', -- Chemin du dossier
    'Leader en innovation',      -- Description (optionnel)
    'Acme Assistant',            -- Nom du chatbot
    'fr',                        -- Langue par défaut
    'Bonjour ! Je suis l''assistant virtuel d''Acme. Comment puis-je vous aider ?'
);

-- Répétez pour chaque entreprise unique dans votre base
```

### **Étape 4 : Modifier la Table document_metadata**

```sql
-- ============================================================================
-- MODIFICATION DE LA TABLE DOCUMENT_METADATA
-- ============================================================================

-- 1. Ajouter la nouvelle colonne company_id
ALTER TABLE public.document_metadata 
ADD COLUMN company_id TEXT;

-- 2. Remplir company_id en se basant sur business_name
UPDATE public.document_metadata 
SET company_id = (
    SELECT c.id 
    FROM public.companies c 
    WHERE c.company_name = document_metadata.business_name
    LIMIT 1
);

-- 3. Vérifier que tous les documents ont un company_id
SELECT 
    COUNT(*) as total_documents,
    COUNT(company_id) as documents_with_company_id,
    COUNT(*) - COUNT(company_id) as orphaned_documents
FROM public.document_metadata;

-- 4. Supprimer les documents orphelins (optionnel)
-- DELETE FROM public.document_metadata WHERE company_id IS NULL;

-- 5. Rendre company_id obligatoire
ALTER TABLE public.document_metadata 
ALTER COLUMN company_id SET NOT NULL;

-- 6. Ajouter la contrainte de clé étrangère
ALTER TABLE public.document_metadata 
ADD CONSTRAINT fk_document_company 
FOREIGN KEY (company_id) REFERENCES public.companies(id) 
ON DELETE CASCADE;

-- 7. Supprimer l'ancienne colonne business_name
ALTER TABLE public.document_metadata 
DROP COLUMN business_name;

-- 8. Mettre à jour les index
CREATE INDEX idx_document_metadata_company_id ON public.document_metadata(company_id);
```

### **Étape 5 : Configurer les Politiques RLS**

```sql
-- ============================================================================
-- POLITIQUES RLS POUR LES NOUVELLES TABLES
-- ============================================================================

-- Activer RLS sur la table companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Politiques pour companies
CREATE POLICY "Enable all operations on companies" ON public.companies
    FOR ALL USING (true) WITH CHECK (true);

-- Mettre à jour les politiques pour document_metadata si nécessaire
-- (Les politiques existantes devraient continuer à fonctionner)
```

### **Étape 6 : Vérification Post-Migration**

```sql
-- ============================================================================
-- SCRIPTS DE VÉRIFICATION
-- ============================================================================

-- 1. Vérifier la structure des tables
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('companies', 'document_metadata')
  AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 2. Vérifier l'intégrité des données
SELECT 
    c.company_name,
    c.id as company_id,
    COUNT(d.id) as document_count
FROM public.companies c
LEFT JOIN public.document_metadata d ON c.id = d.company_id
GROUP BY c.id, c.company_name
ORDER BY c.company_name;

-- 3. Vérifier qu'il n'y a pas de documents orphelins
SELECT COUNT(*) as orphaned_documents
FROM public.document_metadata d
LEFT JOIN public.companies c ON d.company_id = c.id
WHERE c.id IS NULL;

-- 4. Tester une requête de récupération
SELECT 
    c.company_name,
    c.chatbot_name,
    d.file_path,
    d.status,
    d.uploaded_at
FROM public.companies c
JOIN public.document_metadata d ON c.id = d.company_id
WHERE c.company_name = 'VOTRE_ENTREPRISE_TEST'
ORDER BY d.uploaded_at DESC;
```

---

## ⚠️ **Points d'Attention**

### **Problèmes Courants et Solutions**

1. **Documents Orphelins**
   - **Problème** : Documents sans company_id après migration
   - **Solution** : Créez manuellement les entreprises manquantes ou supprimez les documents

2. **Doublons d'Entreprises**
   - **Problème** : Plusieurs entreprises avec le même nom
   - **Solution** : Nettoyez les doublons avant la migration

3. **Contraintes de Clés Étrangères**
   - **Problème** : Erreur lors de l'ajout de la contrainte FK
   - **Solution** : Vérifiez qu'il n'y a pas de documents orphelins

### **Rollback en Cas de Problème**
```sql
-- Restaurer l'ancienne structure si nécessaire
ALTER TABLE public.document_metadata DROP CONSTRAINT IF EXISTS fk_document_company;
ALTER TABLE public.document_metadata DROP COLUMN IF EXISTS company_id;
ALTER TABLE public.document_metadata ADD COLUMN business_name TEXT;

-- Restaurer les données depuis votre backup
-- ... (utilisez votre backup de l'étape 1)

DROP TABLE IF EXISTS public.companies;
```

---

## ✅ **Validation Finale**

Après la migration, testez avec l'application :

1. **Test de Connexion** : `/TestSupabase` → Test de connexion
2. **Test de Création** : `/TestSupabase` → Test d'insertion
3. **Test de Récupération** : `/TestSupabase` → Test de récupération
4. **Test Complet** : Créez un nouveau chatbot via `/Create`

---

**🎉 Félicitations ! Votre base de données est maintenant migrée vers la nouvelle structure !**

La nouvelle structure permet :
- ✅ Une meilleure organisation des données
- ✅ Des IDs d'entreprise personnalisés et lisibles
- ✅ Une séparation claire entre entreprises et documents
- ✅ Une extensibilité future (ajout de champs entreprise)
- ✅ Une intégrité référentielle renforcée
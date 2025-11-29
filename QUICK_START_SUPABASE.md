# ⚡ Guide de Démarrage Rapide - Supabase

Ce guide vous permet de configurer Supabase en 15 minutes maximum !

## 🚀 Étapes Rapides

### 1️⃣ Créer le Projet Supabase (2 min)
1. Allez sur [supabase.com](https://supabase.com) → **New Project**
2. Nom : `hackaton-2025-chatbot`
3. Générez un mot de passe fort
4. **Créer le projet**

### 2️⃣ Configuration Express (5 min)
1. **Storage** → **Create bucket** → Nom: `documents` → **Privé** ✅
2. **SQL Editor** → **New Query** → Copiez le script ci-dessous :

```sql
-- SCRIPT DE CONFIGURATION EXPRESS
-- Copiez-collez tout et exécutez d'un coup !

-- 1. Créer la table
CREATE TABLE public.document_metadata (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    file_path TEXT NOT NULL,
    business_name TEXT NOT NULL,
    status TEXT DEFAULT 'uploaded',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer les index
CREATE INDEX idx_document_metadata_business_name ON public.document_metadata(business_name);
CREATE INDEX idx_document_metadata_user_id ON public.document_metadata(user_id);

-- 3. Activer RLS
ALTER TABLE public.document_metadata ENABLE ROW LEVEL SECURITY;

-- 4. Politiques pour la table
CREATE POLICY "Allow all operations" ON public.document_metadata FOR ALL USING (true) WITH CHECK (true);

-- 5. Politiques pour le storage
CREATE POLICY "Allow all storage operations" ON storage.objects FOR ALL USING (bucket_id = 'documents') WITH CHECK (bucket_id = 'documents');
```

### 3️⃣ Récupérer les Clés (1 min)
1. **Settings** → **API**
2. Copiez : **Project URL** et **anon public key**

### 4️⃣ Configurer l'App (2 min)
Dans `appsettings.json` :
```json
{
  "Supabase": {
    "Url": "https://cjixltplqwyjailfiemg.supabase.co",
    "Key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqaXhsdHBscXd5amFpbGZpZW1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MzA1NDYsImV4cCI6MjA4MDAwNjU0Nn0.xK7Y2ohq9Em4w92xDF-L0Y5h32TfIERgVixc9f-e4dk "
  }
}
```

Même chose dans `appsettings.Development.json`.

### 5️⃣ Tester (5 min)
```bash
dotnet run
```
Puis allez sur : `http://localhost:5000/TestSupabase`

---

## ✅ Checklist de Vérification

- [ ] ✅ Projet Supabase créé
- [ ] 📁 Bucket `documents` créé (privé)
- [ ] 🗄️ Table `document_metadata` créée
- [ ] 🔒 Politiques RLS configurées
- [ ] 🔑 Clés API récupérées et configurées
- [ ] 🧪 Tests passés avec succès

---

## 🆘 Problèmes Courants

**❌ "Insufficient privileges"**
→ Vérifiez que les politiques RLS permettent les opérations

**❌ "Bucket not found"**  
→ Assurez-vous que le bucket s'appelle exactement `documents`

**❌ "Connection failed"**
→ Vérifiez URL et clé API dans appsettings.json

---

## 🎯 Prêt !
Une fois tout configuré, vos documents seront automatiquement uploadés vers Supabase lors de la création de chatbots !

**Page de test** : `/TestSupabase`  
**Voir les documents** : `/Documents?businessName=NomEntreprise`
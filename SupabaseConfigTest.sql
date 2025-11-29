-- ============================================================================
-- SCRIPT DE VÉRIFICATION CONFIGURATION SUPABASE
-- Copiez et exécutez ce script dans l'éditeur SQL de Supabase
-- ============================================================================

-- 1. VÉRIFIER QUE LA TABLE EXISTE
SELECT 'TABLE DOCUMENT_METADATA' as check_type, 
       CASE WHEN EXISTS (
           SELECT 1 FROM information_schema.tables 
           WHERE table_name = 'document_metadata' 
           AND table_schema = 'public'
       ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

-- 2. VÉRIFIER LA STRUCTURE DE LA TABLE
SELECT 'COLUMNS CHECK' as check_type,
       column_name,
       data_type,
       is_nullable,
       column_default
FROM information_schema.columns 
WHERE table_name = 'document_metadata' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. VÉRIFIER LES INDEX
SELECT 'INDEXES CHECK' as check_type,
       indexname,
       indexdef 
FROM pg_indexes 
WHERE tablename = 'document_metadata'
AND schemaname = 'public';

-- 4. VÉRIFIER LES POLITIQUES RLS
SELECT 'RLS POLICIES' as check_type,
       policyname,
       cmd as operation,
       permissive
FROM pg_policies 
WHERE tablename = 'document_metadata'
AND schemaname = 'public';

-- 5. VÉRIFIER QUE RLS EST ACTIVÉ
SELECT 'RLS STATUS' as check_type,
       CASE WHEN relrowsecurity THEN '✅ RLS ENABLED' 
            ELSE '❌ RLS DISABLED' END as status
FROM pg_class 
WHERE relname = 'document_metadata';

-- 6. VÉRIFIER LE BUCKET STORAGE
SELECT 'STORAGE BUCKET' as check_type,
       CASE WHEN EXISTS (
           SELECT 1 FROM storage.buckets WHERE name = 'documents'
       ) THEN '✅ BUCKET EXISTS' ELSE '❌ BUCKET MISSING' END as status;

-- 7. VÉRIFIER LES POLITIQUES STORAGE
SELECT 'STORAGE POLICIES' as check_type,
       name as policy_name,
       definition
FROM storage.policies 
WHERE bucket_id = 'documents';

-- 8. TEST D'INSERTION (OPTIONNEL)
-- Décommentez les lignes suivantes pour tester une insertion

/*
-- Test d'insertion
INSERT INTO public.document_metadata 
(file_path, business_name, status) 
VALUES 
('documents/test_company/test_document.pdf', 'Test Company', 'uploaded')
RETURNING id, file_path, business_name, status, uploaded_at;

-- Vérification du test
SELECT 'INSERTION TEST' as check_type,
       COUNT(*) as total_records,
       COUNT(CASE WHEN business_name = 'Test Company' THEN 1 END) as test_records
FROM public.document_metadata;
*/

-- 9. RÉSUMÉ DE LA CONFIGURATION
SELECT '🎯 CONFIGURATION SUMMARY' as summary,
       (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'document_metadata') as total_columns,
       (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'document_metadata') as total_indexes,
       (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'document_metadata') as total_policies,
       (SELECT CASE WHEN EXISTS(SELECT 1 FROM storage.buckets WHERE name = 'documents') THEN 1 ELSE 0 END) as bucket_configured;
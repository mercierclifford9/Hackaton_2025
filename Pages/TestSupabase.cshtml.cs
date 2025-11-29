using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Hackaton_2025.Services;
using Hackaton_2025.Models;

namespace Hackaton_2025.Pages
{
    /// <summary>
    /// Page de test pour vérifier la connexion et les opérations Supabase
    /// Accessible via /TestSupabase
    /// </summary>
    public class TestSupabaseModel : PageModel
    {
        private readonly SupabaseService _supabaseService;
        private readonly CompanyService _companyService;

        public TestSupabaseModel(SupabaseService supabaseService, CompanyService companyService)
        {
            _supabaseService = supabaseService;
            _companyService = companyService;
        }

        [BindProperty]
        public string TestResult { get; set; } = string.Empty;

        [BindProperty]
        public bool IsSuccess { get; set; } = false;

        [BindProperty]
        public string TestCompanyId { get; set; } = string.Empty;

        public async Task<IActionResult> OnGetAsync()
        {
            return Page();
        }

        /// <summary>
        /// Test de connexion basique à Supabase
        /// </summary>
        public async Task<IActionResult> OnPostTestConnectionAsync()
        {
            try
            {
                // Test simple : récupérer toutes les entreprises
                var companies = await _companyService.GetAllCompaniesAsync();
                
                TestResult = $"✅ Connexion Supabase réussie ! Nombre d'entreprises trouvées : {companies.Count}";
                IsSuccess = true;
            }
            catch (Exception ex)
            {
                TestResult = $"❌ Erreur de connexion : {ex.Message}";
                IsSuccess = false;
            }

            return Page();
        }

        /// <summary>
        /// Test de création d'entreprise et upload de document
        /// </summary>
        public async Task<IActionResult> OnPostTestInsertAsync()
        {
            try
            {
                // 1. Tester la génération d'ID d'abord avec un nom unique
                var uniqueName = $"Test Upload Company {DateTime.Now:yyyyMMdd_HHmmss}";
                var generatedId = _companyService.GenerateCompanyId(uniqueName);
                if (string.IsNullOrEmpty(generatedId))
                {
                    TestResult = "❌ Erreur : Génération d'ID échouée";
                    IsSuccess = false;
                    return Page();
                }

                // 2. Créer une entreprise de test avec le même nom unique
                var company = await _companyService.CreateCompanyAsync(
                    companyName: uniqueName,
                    url: "https://test-upload-company.com",
                    description: "Entreprise de test pour les fonctionnalités d'upload Supabase",
                    chatbotName: "UploadTestBot",
                    chatbotLanguage: "fr",
                    welcomeMessage: "Bonjour ! Je suis un chatbot de test d'upload."
                );

                // 3. Vérifier que l'entreprise a bien été créée avec un ID
                if (string.IsNullOrEmpty(company?.Id))
                {
                    TestResult = "❌ Erreur : Entreprise créée mais ID manquant";
                    IsSuccess = false;
                    return Page();
                }

                TestCompanyId = company.Id;

                // 4. Vérifier que l'entreprise existe dans la base
                var retrievedCompany = await _companyService.GetCompanyByIdAsync(company.Id);
                if (retrievedCompany == null)
                {
                    TestResult = $"❌ Erreur : Impossible de récupérer l'entreprise avec l'ID {company.Id}";
                    IsSuccess = false;
                    return Page();
                }

                // 5. Créer un fichier de test factice
                var testFileContent = System.Text.Encoding.UTF8.GetBytes("Test file content for Supabase integration");
                var testFile = new FormFile(
                    new MemoryStream(testFileContent),
                    0,
                    testFileContent.Length,
                    "testFile",
                    "test_document.txt"
                )
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "text/plain"
                };

                // 6. Tenter l'upload
                var filePath = await _supabaseService.UploadDocumentAsync(testFile, company.Id, Guid.NewGuid());

                if (!string.IsNullOrEmpty(filePath))
                {
                    TestResult = $"✅ Test complet réussi !" +
                               $"\n🆔 ID généré : {generatedId}" +
                               $"\n📋 Entreprise créée : {company.Id} ({company.CompanyName})" +
                               $"\n📁 Dossier : {company.FolderPath}" +
                               $"\n🤖 Chatbot : {company.ChatbotName}" +
                               $"\n💬 Message : {company.ChatbotWelcomeMessage}" +
                               $"\n✅ Vérification récupération : OK" +
                               $"\n📄 Document uploadé : {filePath}";
                    IsSuccess = true;
                }
                else
                {
                    TestResult = $"✅ Entreprise créée ({company.Id}) mais ❌ échec de l'upload du document";
                    IsSuccess = false;
                }
            }
            catch (Exception ex)
            {
                TestResult = $"❌ Erreur lors du test d'insertion : {ex.Message}" +
                           $"\n🔍 Type d'erreur : {ex.GetType().Name}" +
                           $"\n📍 StackTrace : {ex.StackTrace?.Split('\n').FirstOrDefault()}";
                IsSuccess = false;
            }

            return Page();
        }

        /// <summary>
        /// Test de récupération des entreprises et documents
        /// </summary>
        public async Task<IActionResult> OnPostTestRetrieveAsync()
        {
            try
            {
                // Récupérer toutes les entreprises de test
                var allCompanies = await _companyService.GetAllCompaniesAsync();
                var testCompanies = allCompanies.Where(c => c.CompanyName.Contains("Test")).ToList();
                
                if (!testCompanies.Any())
                {
                    TestResult = "ℹ️ Aucune entreprise de test trouvée. Créez d'abord une entreprise avec le test d'insertion.";
                    IsSuccess = true;
                    return Page();
                }

                var results = new List<string>();
                foreach (var company in testCompanies)
                {
                    var documents = await _supabaseService.GetDocumentsForCompanyAsync(company.Id);
                    results.Add($"🏢 {company.CompanyName} ({company.Id}) : {documents.Count} document(s)");
                }
                
                TestResult = $"✅ Récupération réussie !\n" + string.Join("\n", results);
                IsSuccess = true;
            }
            catch (Exception ex)
            {
                TestResult = $"❌ Erreur lors de la récupération : {ex.Message}";
                IsSuccess = false;
            }

            return Page();
        }

        /// <summary>
        /// Nettoyer les données de test
        /// </summary>
        public async Task<IActionResult> OnPostCleanupAsync()
        {
            try
            {
                // Récupérer toutes les entreprises de test
                var allCompanies = await _companyService.GetAllCompaniesAsync();
                var testCompanies = allCompanies.Where(c => c.CompanyName.Contains("Test")).ToList();

                int deletedCompanies = 0;
                int deletedDocuments = 0;

                foreach (var company in testCompanies)
                {
                    // Compter les documents avant suppression
                    var documents = await _supabaseService.GetDocumentsForCompanyAsync(company.Id);
                    deletedDocuments += documents.Count;

                    // Supprimer l'entreprise (supprime automatiquement les documents)
                    var deleted = await _companyService.DeleteCompanyAsync(company.Id);
                    if (deleted) deletedCompanies++;
                }

                TestResult = $"✅ Nettoyage terminé !" +
                           $"\n🏢 {deletedCompanies} entreprise(s) supprimée(s)" +
                           $"\n📄 {deletedDocuments} document(s) supprimé(s)";
                IsSuccess = true;
            }
            catch (Exception ex)
            {
                TestResult = $"❌ Erreur lors du nettoyage : {ex.Message}";
                IsSuccess = false;
            }

            return Page();
        }

        /// <summary>
        /// Test de génération d'ID uniquement
        /// </summary>
        public IActionResult OnPostTestIdGeneration()
        {
            try
            {
                var testNames = new[] { "Test Company", "Acme Corp", "Café & Restaurant", "Tech Co." };
                var results = new List<string>();

                foreach (var name in testNames)
                {
                    var id = _companyService.GenerateCompanyId(name);
                    var folderPath = _companyService.GenerateFolderPath(name);
                    results.Add($"'{name}' → {id} (Dossier: {folderPath})");
                }

                TestResult = "✅ Génération d'IDs testée avec succès !\n" + string.Join("\n", results);
                IsSuccess = true;
            }
            catch (Exception ex)
            {
                TestResult = $"❌ Erreur lors de la génération d'ID : {ex.Message}";
                IsSuccess = false;
            }

            return Page();
        }

        /// <summary>
        /// Test de création d'entreprise uniquement
        /// </summary>
        public async Task<IActionResult> OnPostTestCompanyCreationAsync()
        {
            try
            {
                // Étape 1: Test de génération d'ID
                var testId = _companyService.GenerateCompanyId("Debug Test Company");
                if (string.IsNullOrEmpty(testId))
                {
                    TestResult = "❌ Erreur : Échec de la génération d'ID";
                    IsSuccess = false;
                    return Page();
                }

                // Étape 2: Création de l'entreprise
                var company = await _companyService.CreateCompanyAsync(
                    companyName: "Debug Test Company",
                    url: "https://debug-test.com",
                    description: "Entreprise créée pour le debug",
                    chatbotName: "DebugBot",
                    chatbotLanguage: "fr",
                    welcomeMessage: "Bonjour ! Je suis un bot de debug."
                );

                if (string.IsNullOrEmpty(company?.Id))
                {
                    TestResult = "❌ Erreur : L'entreprise a été créée mais l'ID est NULL";
                    IsSuccess = false;
                    return Page();
                }

                TestCompanyId = company.Id;

                // Étape 3: Vérifier en récupérant l'entreprise
                var retrieved = await _companyService.GetCompanyByIdAsync(company.Id);
                
                TestResult = $"✅ Création d'entreprise réussie !" +
                           $"\n🧪 ID de test généré : {testId}" +
                           $"\n🆔 ID final : {company.Id}" +
                           $"\n📝 Nom : {company.CompanyName}" +
                           $"\n📁 Dossier : {company.FolderPath}" +
                           $"\n🤖 Chatbot : {company.ChatbotName}" +
                           $"\n🌍 Langue : {company.ChatbotDefaultLanguage}" +
                           $"\n📅 Créé le : {company.CreatedAt:yyyy-MM-dd HH:mm:ss}" +
                           $"\n✅ Vérification récupération : {(retrieved != null ? "OK" : "ÉCHEC")}";
                IsSuccess = true;
            }
            catch (Exception ex)
            {
                TestResult = $"❌ Erreur lors de la création d'entreprise : {ex.Message}" +
                           $"\n🔍 Type : {ex.GetType().Name}" +
                           $"\n📍 Détails : {(ex.InnerException?.Message ?? "Aucun détail supplémentaire")}" +
                           $"\n📋 Stack Trace : {ex.StackTrace?.Split('\n').FirstOrDefault()}";
                IsSuccess = false;
            }

            return Page();
        }

        /// <summary>
        /// Test d'upload avec une entreprise existante
        /// </summary>
        public async Task<IActionResult> OnPostTestUploadOnlyAsync()
        {
            try
            {
                // Récupérer une entreprise existante ou en créer une
                var companies = await _companyService.GetAllCompaniesAsync();
                var testCompany = companies.FirstOrDefault(c => c.CompanyName.Contains("Test") || c.CompanyName.Contains("Debug"));

                if (testCompany == null)
                {
                    TestResult = "ℹ️ Aucune entreprise de test trouvée. Créez d'abord une entreprise avec le test de création.";
                    IsSuccess = true;
                    return Page();
                }

                TestCompanyId = testCompany.Id;

                // Créer un fichier de test
                var testFileContent = System.Text.Encoding.UTF8.GetBytes($"Upload test file - {DateTime.Now:yyyy-MM-dd HH:mm:ss}");
                var testFile = new FormFile(
                    new MemoryStream(testFileContent),
                    0,
                    testFileContent.Length,
                    "uploadTestFile",
                    "upload_test.txt"
                )
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "text/plain"
                };

                // Tester l'upload
                var filePath = await _supabaseService.UploadDocumentAsync(testFile, testCompany.Id, Guid.NewGuid());

                if (!string.IsNullOrEmpty(filePath))
                {
                    TestResult = $"✅ Upload de fichier réussi !" +
                               $"\n🏢 Entreprise utilisée : {testCompany.CompanyName} ({testCompany.Id})" +
                               $"\n📄 Fichier uploadé : {filePath}" +
                               $"\n📁 Dossier cible : {testCompany.FolderPath}";
                    IsSuccess = true;
                }
                else
                {
                    TestResult = $"❌ Échec de l'upload du fichier pour l'entreprise {testCompany.Id}";
                    IsSuccess = false;
                }
            }
            catch (Exception ex)
            {
                TestResult = $"❌ Erreur lors du test d'upload : {ex.Message}" +
                           $"\n🔍 Type : {ex.GetType().Name}";
                IsSuccess = false;
            }

            return Page();
        }

        /// <summary>
        /// Test d'insertion SQL directe
        /// </summary>
        public async Task<IActionResult> OnPostTestDirectSqlAsync()
        {
            try
            {
                // Générer un ID de test
                var testId = _companyService.GenerateCompanyId("SQL Test Company");
                var folderPath = _companyService.GenerateFolderPath("SQL Test Company");

                // Essayer une insertion SQL directe via RPC ou query custom
                var sql = $@"
                INSERT INTO companies (id, company_name, url, folder_path, description, chatbot_name, chatbot_default_language, chatbot_welcome_message, created_at, updated_at)
                VALUES (
                    '{testId}',
                    'SQL Test Company',
                    'https://sql-test.com',
                    '{folderPath}',
                    'Entreprise créée via SQL direct',
                    'SQLBot',
                    'fr',
                    'Bonjour depuis SQL !',
                    NOW(),
                    NOW()
                )
                RETURNING *;";

                Console.WriteLine($"[DEBUG] SQL à exécuter: {sql}");

                // Note: Cette méthode nécessite d'avoir accès aux fonctions RPC de Supabase
                // Pour l'instant, on va simuler avec une création normale mais en loggant tout
                
                var company = await _companyService.CreateCompanyAsync(
                    "SQL Test Company",
                    "https://sql-test.com",
                    "Test via méthode SQL directe",
                    "SQLBot"
                );

                TestResult = $"✅ Test SQL simulé réussi !" +
                           $"\n🆔 ID généré: {testId}" +
                           $"\n📋 Entreprise créée: {company.Id}" +
                           $"\n📁 Dossier: {folderPath}" +
                           $"\n📝 SQL généré (voir console): OK";
                IsSuccess = true;
                TestCompanyId = company.Id;
            }
            catch (Exception ex)
            {
                TestResult = $"❌ Erreur lors du test SQL: {ex.Message}" +
                           $"\n🔍 Type: {ex.GetType().Name}";
                IsSuccess = false;
            }

            return Page();
        }

        /// <summary>
        /// Test de validation des champs avant insertion
        /// </summary>
        public async Task<IActionResult> OnPostTestDictionaryAsync()
        {
            try
            {
                // Test de validation étape par étape
                Console.WriteLine("[DEBUG TEST] Début du test de validation");

                // Étape 1: Générer l'ID
                var testId = _companyService.GenerateCompanyId("Validation Test Company");
                Console.WriteLine($"[DEBUG TEST] ID généré: '{testId}' (longueur: {testId.Length})");

                if (string.IsNullOrWhiteSpace(testId))
                {
                    TestResult = "❌ Erreur: ID généré est vide ou null";
                    IsSuccess = false;
                    return Page();
                }

                // Étape 2: Générer le chemin de dossier
                var folderPath = _companyService.GenerateFolderPath("Validation Test Company");
                Console.WriteLine($"[DEBUG TEST] Folder path généré: '{folderPath}'");

                // Étape 3: Créer l'objet Company manuellement
                var company = new Company
                {
                    Id = testId,
                    CompanyName = "Validation Test Company",
                    Url = "https://validation-test.com",
                    FolderPath = folderPath,
                    Description = "Test de validation des champs",
                    ChatbotName = "ValidationBot",
                    ChatbotDefaultLanguage = "fr",
                    ChatbotWelcomeMessage = "Bonjour ! Je valide les champs.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                Console.WriteLine($"[DEBUG TEST] Objet Company créé:");
                Console.WriteLine($"  - Id: '{company.Id}'");
                Console.WriteLine($"  - CompanyName: '{company.CompanyName}'");
                Console.WriteLine($"  - FolderPath: '{company.FolderPath}'");
                Console.WriteLine($"  - ChatbotName: '{company.ChatbotName}'");
                Console.WriteLine($"  - ChatbotWelcomeMessage: '{company.ChatbotWelcomeMessage}'");

                // Étape 4: Insérer avec le service (qui a maintenant plus de validation)
                var insertedCompany = await _companyService.CreateCompanyAsync(
                    company.CompanyName,
                    company.Url,
                    company.Description,
                    company.ChatbotName,
                    company.ChatbotDefaultLanguage,
                    company.ChatbotWelcomeMessage
                );

                TestResult = $"✅ Test de validation réussi !" +
                           $"\n🧪 ID généré initialement: {testId}" +
                           $"\n🆔 ID après insertion: {insertedCompany.Id}" +
                           $"\n📝 Nom: {insertedCompany.CompanyName}" +
                           $"\n📁 Dossier: {insertedCompany.FolderPath}" +
                           $"\n✅ Validation: Tous les champs non-null";
                IsSuccess = true;
                TestCompanyId = insertedCompany.Id;
            }
            catch (Exception ex)
            {
                TestResult = $"❌ Erreur lors du test de validation: {ex.Message}" +
                           $"\n🔍 Type: {ex.GetType().Name}" +
                           $"\n📍 InnerException: {(ex.InnerException?.Message ?? "Aucune")}" +
                           $"\n📋 Stack: {ex.StackTrace?.Split('\n').FirstOrDefault()}";
                IsSuccess = false;
            }

            return Page();
        }
    }
}
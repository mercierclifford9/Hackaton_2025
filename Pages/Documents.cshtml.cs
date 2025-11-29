using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Hackaton_2025.Services;
using Hackaton_2025.Models;

namespace Hackaton_2025.Pages
{
    public class DocumentsModel : PageModel
    {
        private readonly SupabaseService _supabaseService;
        private readonly CompanyService _companyService;

        public DocumentsModel(SupabaseService supabaseService, CompanyService companyService)
        {
            _supabaseService = supabaseService;
            _companyService = companyService;
        }

        [BindProperty(SupportsGet = true)]
        public string CompanyId { get; set; } = string.Empty;

        public Company? Company { get; set; }
        public List<DocumentMetadata> Documents { get; set; } = new List<DocumentMetadata>();

        public async Task<IActionResult> OnGetAsync(string companyId)
        {
            if (string.IsNullOrEmpty(companyId))
            {
                return RedirectToPage("/Index");
            }

            CompanyId = companyId;
            Company = await _companyService.GetCompanyByIdAsync(companyId);
            
            if (Company == null)
            {
                return NotFound($"Entreprise avec l'ID {companyId} non trouvée");
            }

            Documents = await _supabaseService.GetDocumentsForCompanyAsync(companyId);

            return Page();
        }

        public async Task<IActionResult> OnPostDeleteDocumentAsync(Guid documentId)
        {
            var result = await _supabaseService.DeleteDocumentAsync(documentId);
            
            if (result)
            {
                return new JsonResult(new { success = true });
            }
            else
            {
                return new JsonResult(new { success = false, error = "Erreur lors de la suppression" });
            }
        }
    }
}
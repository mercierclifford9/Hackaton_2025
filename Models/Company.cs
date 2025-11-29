using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Hackaton_2025.Models
{
    [Table("companies")]
    public class Company : BaseModel
    {
        [PrimaryKey("id", false)]  // false = ne pas auto-générer, nous gérons l'ID manuellement
        public string Id { get; set; } = string.Empty;

        [Column("company_name")]
        public string CompanyName { get; set; } = string.Empty;

        [Column("url")]
        public string? Url { get; set; }

        [Column("folder_path")]
        public string FolderPath { get; set; } = string.Empty;

        [Column("description")]
        public string? Description { get; set; }

        [Column("chatbot_name")]
        public string ChatbotName { get; set; } = string.Empty;

        [Column("chatbot_default_language")]
        public string ChatbotDefaultLanguage { get; set; } = "fr";

        [Column("chatbot_welcome_message")]
        public string ChatbotWelcomeMessage { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
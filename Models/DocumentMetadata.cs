using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Hackaton_2025.Models
{
    [Table("document_metadata")]
    public class DocumentMetadata : BaseModel
    {
        [PrimaryKey("id")]
        public Guid Id { get; set; }

        [Column("user_id")]
        public Guid? UserId { get; set; }

        [Column("company_id")]
        public string CompanyId { get; set; } = string.Empty;

        [Column("file_path")]
        public string FilePath { get; set; } = string.Empty;

        [Column("status")]
        public string Status { get; set; } = "uploaded";

        [Column("uploaded_at")]
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}
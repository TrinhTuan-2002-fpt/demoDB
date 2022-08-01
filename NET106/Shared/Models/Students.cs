namespace NET106.Shared.Models;

public class Students // Sinh Viên
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Gender { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
    public string Address { get; set; }


    public Branch? Branch { get; set; }
    public int? BranchId { get; set; }
    public Class? Class { get; set; }
    public int? ClassId { get; set; }
    public ICollection<StudentSubject>? StudentSubject { get; set; }
}
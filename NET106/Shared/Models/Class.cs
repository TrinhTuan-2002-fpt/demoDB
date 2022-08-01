namespace NET106.Shared.Models;

public class Class // Lớp
{
    public int Id { get; set; }
    public string Name { get; set; }


    public School? School { get; set; }
    public int SchoolId { get; set; }

    public ICollection<Students>? Student { get; set; }
}
namespace NET106.Shared.Models;

public class School // Trường
{
    public int Id { get; set; }
    public string Name { get; set; }

    public ICollection<Branch>? Branche { get; set; }
    public ICollection<Class>? Class { get; set; }
    public ICollection<Subjects>? Subject { get; set; }

}
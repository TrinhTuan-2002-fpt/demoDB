namespace NET106.Shared.Models;

public class StudentSubject
{
    public int Id { get; set; }

    public Students? Student { get; set; }
    public int StudentId { get; set; }
    public Subjects? Subject { get; set; }
    public int SubjectId { get; set; }
}
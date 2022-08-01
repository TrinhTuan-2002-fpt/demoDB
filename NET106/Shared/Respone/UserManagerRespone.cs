namespace NET106.Shared.Respone;

public class UserManagerRespone
{
    public string Message { get; set; }
    public bool IsSuccess { get; set; }
    public IEnumerable<string> Error { get; set; }
}
namespace NET106.Server.Service;

public interface ISerrvice<T> where T : class
{
    Task<List<T>> Get();
    Task<List<T>> Get(int id);
    Task<bool> Create(T entity);
    Task<bool> Update(int id, T entity);
    Task<bool> Delete(int id);
}
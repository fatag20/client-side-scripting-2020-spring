class MyClass
{
    public int id;
    public MyClass(int id)
    {
        this.id = id;
    }
}

class Consumer
{
    public void useMyClass(MyClass myClass)
    {
        myClass.id = 100001010101;
        myClass = new MyClass(10000);
        myClass = null;
    }
}